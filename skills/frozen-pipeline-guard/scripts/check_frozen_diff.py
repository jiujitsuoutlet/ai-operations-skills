#!/usr/bin/env python3
"""Supplemental frozen-surface keyword tripwire for a Git diff."""

import argparse
import json
import re
import subprocess
from pathlib import Path

DEFAULT_PATTERNS = [
    r"EffectComposer",
    r"OutputPass",
    r"toneMapping",
    r"exposure",
    r"bloom",
    r"vignette",
    r"setPixelRatio",
    r"pixelRatio",
    r"orb.{0,24}material",
    r"material.{0,24}orb",
    r"camera.{0,24}(law|pose|limit)",
    r"(route|playback|completion|topology)",
]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", default="main")
    parser.add_argument("--repo", type=Path, default=Path.cwd())
    parser.add_argument("--pattern", action="append", default=[])
    parser.add_argument("paths", nargs="*")
    args = parser.parse_args()
    command = ["git", "diff", "--unified=0", args.base, "--"] + args.paths
    completed = subprocess.run(
        command, cwd=args.repo, text=True, capture_output=True, check=False
    )
    if completed.returncode:
        raise SystemExit(completed.stderr.strip() or f"git diff exited {completed.returncode}")
    expressions = [re.compile(p, re.IGNORECASE) for p in (DEFAULT_PATTERNS + args.pattern)]
    current_file = None
    matches = []
    for line in completed.stdout.splitlines():
        if line.startswith("+++ b/"):
            current_file = line[6:]
        if not line.startswith("+") or line.startswith("+++"):
            continue
        for expression in expressions:
            if expression.search(line):
                matches.append(
                    {"file": current_file, "pattern": expression.pattern, "line": line[1:]}
                )
    report = {
        "base": args.base,
        "repo": str(args.repo.resolve()),
        "paths": args.paths,
        "status": "REVIEW_REQUIRED" if matches else "NO_KEYWORD_MATCHES",
        "matches": matches,
        "warning": "Keyword absence is not semantic proof. Review the complete diff and run MAD invariants.",
    }
    print(json.dumps(report, indent=2))
    raise SystemExit(1 if matches else 0)


if __name__ == "__main__":
    main()
