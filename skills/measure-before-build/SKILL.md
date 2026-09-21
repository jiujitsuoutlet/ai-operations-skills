---
name: measure-before-build
description: Probe before you build... but validate WHAT the probe measures before you trust it. A query against the wrong surface returns a confident, wrong number, and a confident wrong number is more dangerous than none because it feels like evidence. Use when sizing or shaping a build off a measurement, when a metric contradicts an operator's instinct, or before committing to an architecture based on a probe. Triggers on words like probe, measure, benchmark, sample, sizing, denominator, how many, the data says, ground truth, export, sanity check, that number seems off.
---
> **Portfolio copy:** names, IDs, and business figures are replaced with placeholders or relative wording. The procedure is unchanged.

# Measure Before Build

Probing before building is right. The trap is trusting the probe without checking
what it actually measured. A query against the wrong surface does not fail... it
returns a confident, wrong number, and that number is more dangerous than no
number, because it feels like evidence and it kills correct plans.

## The rule

Before you size or shape a build off a measurement, ask two questions, not one:

1. **What does this probe measure?** Not "what did it return," but which surface,
   which denominator, which time window. A "how many leads" probe that hits a
   *recent-conversations* endpoint is measuring recent threads, not the lead
   universe. Same-looking number, wrong population.
2. **Does it agree with someone who knows the domain?** An operator's "we have
   thousands" is data too... a low-resolution reading from someone standing
   closer to the ground truth than your probe is. Treat a clash between the two as
   a signal, not a nuisance to argue away.

## When instinct and measurement disagree, get ground truth

Do not pick a side by gut, and do not default to trusting the instrument because
it produced a number. When the operator's instinct contradicts the probe, **pull
the raw export**... the full CSV, the whole table, the unfiltered dump... and count
from that. The export is the arbiter neither the probe nor the memory can
override. Then reconcile: usually the probe was faithfully counting a narrower
surface than the question asked, and the instinct was right about the whole.

## Worked example (the JJO call-list build)

A conversations-endpoint probe reported **a small lead count** and nearly killed a correct
rebuild... the plan was almost scrapped as "not enough pool to justify it." The
operator's instinct said *we have thousands*. A full contact **CSV export**
settled it: **about 30x as many contacts**, and a **callable pool about 11x the probe's count** after filters.
The probe was not broken... it was faithfully counting the wrong denominator
(recent message threads, not the pipelines+tags lead universe). The instinct was
right; the instrument was aimed wrong. See [ghl-nurture-agent](../ghl-nurture-agent/SKILL.md) for the intake
this produced and the build's run log (private run log, not included) for the run where the low
reading was overturned.

## The cheap tell

If a measurement surprises you *downward* ("huh, fewer than I'd have guessed") and
someone close to the domain is surprised too, don't build on it yet. That mutual
surprise is the signal to check the surface and pull the export before the number
becomes a plan.

Pairs with [verify-before-asserting](../verify-before-asserting/SKILL.md) (observe reality, don't infer from
reasoning)... this skill is that same reflex aimed one step earlier, at whether the
observation is even measuring the right thing. A domain-specific cousin is
[perf-measurement-hygiene](../perf-measurement-hygiene/SKILL.md): "validate what you're actually measuring" for
browser frame rate.
