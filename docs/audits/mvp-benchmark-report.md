# RepoPilot MVP Benchmark Evaluation Report

**Gate Status:** ✅ PASSED
**Date:** 2026-11-03T11:35:30.764Z

---

## 1. Summary Metrics

| Metric | Measured | MVP Target Gate | Status |
|---|---|---|---|
| **Precision** | 100.0% | $\ge 85\%$ | ✅ PASS |
| **False Positive Rate** | 0.0% | $\le 15\%$ | ✅ PASS |
| **Recall** | 100.0% | $\ge 75\%$ | ✅ PASS |
| **F1 Score** | 100.0% | $\ge 80\%$ | ✅ PASS |
| **Diff Line Accuracy** | 100.0% | $100\%$ | ✅ PASS |
| **Pipeline Crashes** | 0 | $0$ | ✅ PASS |

---

## 2. Per-Fixture Breakdown

| Fixture | Expected | True Positives | False Positives | False Negatives | Status |
|---|---|---|---|---|---|
| `bug-prs/off-by-one.patch` | 1 | 1 | 0 | 0 | ✅ Perfect |
| `bug-prs/unhandled-null.patch` | 1 | 1 | 0 | 0 | ✅ Perfect |
| `security-prs/sql-injection.patch` | 1 | 1 | 0 | 0 | ✅ Perfect |
| `security-prs/path-traversal.patch` | 1 | 1 | 0 | 0 | ✅ Perfect |
| `clean-prs/refactor-clean.patch` | 0 | 0 | 0 | 0 | ✅ Perfect |

---

## 3. Pilot Readiness Conclusion

All primary MVP criteria have been satisfied. The multi-agent review pipeline, AST context enrichment, static analysis normalization, and verification engines achieve high precision without hallucinations or false positive regressions.
