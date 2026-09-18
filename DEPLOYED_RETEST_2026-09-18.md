# KYC Reviewer deployed defect-delivery retest

Completed: 2026-09-18T10:10:00Z

Environment: deployed development · Google Chrome · 1792x976 by default; additional sizes only for responsive findings.

This report records terminal disposition for every KYC Reviewer entry in the 276-finding delivery batch. PASS means the deployed behavior was verified. FAIL means the deployed defect remains reproducible. PASSED_OVER means the bounded attempt could not produce trustworthy proof, commonly because an exact fixture, actor, reversible mutation, or stable protected page was unavailable. DUPLICATE_COVERAGE points to another finding that exercised the same behavior.

## Summary

| Total | PASS | FAIL | DUPLICATE_COVERAGE | PASSED_OVER |
|---:|---:|---:|---:|---:|
| 1 | 0 | 0 | 0 | 1 |

Severity inventory: MEDIUM 1. Outcome reconciliation: PASSED_OVER 1.

## Finding dispositions

| ID | Severity | Outcome | Title | Disposition | Tested |
|---|---|---|---|---|---|
| KYCR-F004 | MEDIUM | PASSED_OVER | Time-range change gives Request Distribution the wrong accessible name | INTERNAL_OPERATIONS_ACTOR_UNAVAILABLE | 2026-09-18T07:25:36.296Z |

The machine-readable companion file preserves target URLs, evidence paths, notes, browser, viewport, and API provenance for each entry.
