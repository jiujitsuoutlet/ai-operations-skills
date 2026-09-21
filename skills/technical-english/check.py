#!/usr/bin/env python3
"""STE conformance linter... heuristic gate for operational drafts.

Checks the mechanical rules of ASD-STE100 Issue 9 that can be caught without
the controlled dictionary. A clean run is necessary, never sufficient... word
approval still needs the spec itself.

Usage:
    python3 check.py draft.md --mode procedure
    python3 check.py draft.md --mode descriptive
    python3 check.py draft.md            # defaults to procedure
"""

import argparse
import re
import sys

# Rule 5.1 procedures, rule 6.3 descriptive text and notes
LIMITS = {"procedure": 20, "descriptive": 25}

# Rule 3.4... auxiliary stacking into complex verb constructions
AUXILIARIES = r"\b(would|could|should|might|may|shall|must have|will have|has been|have been|had been|is being|are being|was being|were being)\b"

# Rule 9.3... phrasal verbs. Highest-frequency offenders in procedural writing.
PHRASAL = [
    "take off", "put on", "put out", "put in", "set up", "set out", "shut down",
    "shut off", "turn on", "turn off", "turn over", "hold on", "hold off",
    "pick up", "let go", "let out", "back off", "back up", "break down",
    "check out", "come off", "carry out", "fill in", "fill up", "get up",
    "go through", "hook up", "line up", "look for", "look over", "make up",
    "pull out", "push down", "run out", "take out", "take up", "tear down",
    "throw away", "warm up", "work out",
]

# Rule 3.6... passive voice candidates
PASSIVE = r"\b(is|are|was|were|be|been|being)\s+\w+(ed|en)\b(\s+by\b)?"

# GR-7... gendered pronouns are not permitted
GENDERED = r"\b(he|she|him|her|his|hers|himself|herself|man|woman|men|women|mankind|guys)\b"

# Rule 4.2... contractions are not permitted
CONTRACTION = r"\b\w+['\u2019](t|s|re|ve|ll|d|m)\b"

# Rule 1.14... American English spelling
BRITISH = {
    "colour": "color", "behaviour": "behavior", "centre": "center",
    "organise": "organize", "organised": "organized", "organisation": "organization",
    "realise": "realize", "recognise": "recognize", "analyse": "analyze",
    "licence": "license", "practise": "practice", "defence": "defense",
    "programme": "program", "metre": "meter", "litre": "liter",
    "aluminium": "aluminum", "cancelled": "canceled", "travelling": "traveling",
}

SENTENCE_SPLIT = re.compile(r"(?<=[.!?:])\s+")


def load_glossary(path):
    """Parse approved-terms.md into {banned_term: approved_term}.

    Reads rows of the form: | Approved | Part | Meaning | Never use |
    The Never use cell is a comma-separated list. Parenthetical scope notes
    inside a banned term are removed before matching.
    """
    mapping = {}
    approved_terms = []
    for line in open(path, encoding="utf-8"):
        if not line.strip().startswith("|"):
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) < 4:
            continue
        approved, banned_cell = cells[0], cells[3]
        if approved.lower() == "approved" or approved.startswith("---"):
            continue
        if approved.startswith("["):
            continue
        approved_terms.append(approved.lower())
        for banned in banned_cell.split(","):
            banned = re.sub(r"\([^)]*\)", "", banned).strip().lower()
            if banned and banned != approved.lower():
                mapping.setdefault(banned, [])
                if approved not in mapping[banned]:
                    mapping[banned].append(approved)
    # longest first... mask "team member" before "member" can match inside it
    approved_terms.sort(key=len, reverse=True)
    return mapping, approved_terms


def count_words(sentence):
    """Word count under rules 8.5 thru 8.7.

    Parenthetical text counts as one word. Hyphenated words count as one.
    Numbers with units count as one. Quoted text counts as one.
    """
    s = re.sub(r"\([^)]*\)", " PARENTHETICAL ", sentence)
    s = re.sub(r"\"[^\"]*\"", " QUOTED ", s)
    s = re.sub(r"\b(\d[\d.,]*)\s*(mm|cm|m|km|in|ft|lb|kg|g|s|min|hr|%)\b", " MEASURE ", s)
    s = re.sub(r"[\w]+(?:-[\w]+)+", "HYPHENATED", s)
    return len([w for w in re.findall(r"[\w']+", s) if w])


def strip_markup(text):
    """Remove fenced code and markdown table rows before linting."""
    text = re.sub(r"```.*?```", "", text, flags=re.S)
    lines = [ln for ln in text.split("\n") if not ln.strip().startswith("|")]
    return "\n".join(lines)


def sentences_of(block):
    raw = SENTENCE_SPLIT.split(block.strip())
    return [s.strip() for s in raw if s.strip() and len(s.strip()) > 1]


def mask_approved(low, approved_terms):
    """Blank out approved terms so a banned term inside one cannot match.

    "team member" must not raise a finding for the banned term "member."
    """
    for term in approved_terms:
        low = re.sub(r"\b" + re.escape(term).replace(r"\ ", r"\s+") + r"\b",
                     "\x00", low)
    return low


def lint(path, mode, glossary=None, approved_terms=None):
    text = strip_markup(open(path, encoding="utf-8").read())
    limit = LIMITS[mode]
    glossary = glossary or {}
    approved_terms = approved_terms or []
    findings = []

    def flag(rule, detail, snippet):
        findings.append((rule, detail, snippet[:88]))

    paragraphs = [p for p in re.split(r"\n\s*\n", text) if p.strip()]

    for para in paragraphs:
        sents = sentences_of(para)

        # Rule 6.6... paragraph length, descriptive writing only
        if mode == "descriptive" and len(sents) > 6:
            flag("6.6", f"paragraph has {len(sents)} sentences, maximum is 6", sents[0])

        for s in sents:
            n = count_words(s)
            if n > limit:
                flag("5.1" if mode == "procedure" else "6.3",
                     f"{n} words, maximum is {limit}", s)

            if ";" in s:
                flag("8.1", "semicolon is not permitted", s)

            if "\u2014" in s or "--" in s:
                flag("house", "em-dash is banned in all registers", s)

            if "..." in s or "\u2026" in s:
                flag("house", "ellipsis reads as omitted text in an executable step", s)

            for m in re.finditer(CONTRACTION, s, re.I):
                flag("4.2", f"contraction: {m.group(0)}", s)

            for m in re.finditer(AUXILIARIES, s, re.I):
                flag("3.4", f"complex verb construction: {m.group(0)}", s)

            for m in re.finditer(GENDERED, s, re.I):
                flag("GR-7", f"gendered or non-inclusive term: {m.group(0)}", s)

            low = s.lower()
            low_masked = mask_approved(low, approved_terms)
            for pv in PHRASAL:
                if re.search(r"\b" + pv.replace(" ", r"\s+") + r"\b", low):
                    flag("9.3", f"phrasal verb: {pv}", s)

            for m in re.finditer(PASSIVE, s, re.I):
                flag("3.6", f"passive voice candidate: {m.group(0).strip()}", s)

            for banned, approved in glossary.items():
                stem = re.escape(banned).replace(r"\ ", r"\s+")
                # allow inflections, including doubled final consonant (spar, sparring)
                double = ""
                if " " not in banned and banned[-1].isalpha() and banned[-1] not in "aeiou":
                    double = banned[-1] + "?"
                pattern = r"\b" + stem + double + r"(?:s|es|ed|ing)?\b"
                if re.search(pattern, low_masked):
                    use = " or ".join(approved)
                    flag("1.11", f"unapproved term: {banned} ... use {use}", s)

            for brit, amer in BRITISH.items():
                if re.search(r"\b" + brit + r"\b", low):
                    flag("1.14", f"use American spelling: {brit} to {amer}", s)

            # Rule 3.5... "-ing" verbs are permitted only inside technical nouns
            for m in re.finditer(r"\b(is|are|was|were|be|been|being)\s+\w+ing\b", s, re.I):
                flag("3.5", f"progressive form: {m.group(0)}", s)

    return findings


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("path")
    ap.add_argument("--mode", choices=list(LIMITS), default="procedure")
    ap.add_argument("--glossary", default=None,
                    help="path to approved-terms.md ... enables rule 1.11 checking")
    args = ap.parse_args()

    if args.glossary:
        glossary, approved_terms = load_glossary(args.glossary)
    else:
        glossary, approved_terms = {}, []
    findings = lint(args.path, args.mode, glossary, approved_terms)

    if not findings:
        scope = f"{args.mode}, {len(glossary)} banned terms" if glossary else args.mode
        print(f"CLEAN [{scope}] {args.path}")
        print("Mechanical rules pass. Dictionary conformance and terminology")
        print("consistency still need a human read against the approved list.")
        return 0

    by_rule = {}
    for rule, detail, snippet in findings:
        by_rule.setdefault(rule, []).append((detail, snippet))

    print(f"{len(findings)} findings [{args.mode}] {args.path}\n")
    for rule in sorted(by_rule):
        print(f"  Rule {rule}  ({len(by_rule[rule])})")
        for detail, snippet in by_rule[rule][:8]:
            print(f"    - {detail}")
            print(f"      > {snippet}")
        if len(by_rule[rule]) > 8:
            print(f"    ... {len(by_rule[rule]) - 8} more")
        print()
    return 1


if __name__ == "__main__":
    sys.exit(main())
