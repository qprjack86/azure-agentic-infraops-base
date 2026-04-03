---
name: atech-governance-standards
description: "Managed-service governance baseline for Azure audits. USE FOR: mandatory tagging, RBAC anomaly checks, and Azure Policy guardrail validation. DO NOT USE FOR: VM operational standards, FinOps savings analysis, or remediation code generation."
---

# Atech Governance Standards Skill

Authoritative rulebook for read-only governance audits across Azure scopes.

## Quick Reference

| Control Domain | Mandatory Outcome | Severity When Missing |
| --- | --- | --- |
| Tagging | `ManagedBy`, `Environment`, and `CostCentre` tags present with valid values | Critical |
| RBAC | No direct user `Owner` or `User Access Administrator` assignments at subscription scope | Critical |
| Azure Policy | MSP guardrail assignments remain active and enforced | Critical |

## Audit Order

1. Confirm Azure authentication and target scope.
2. Run tagging compliance sweep.
3. Run RBAC assignment sweep.
4. Run Azure Policy assignment sweep.
5. Compress noisy resource results before analysis.
6. Write a report to `audit-reports/`.

## Severity Model

| Status | Meaning | Examples |
| --- | --- | --- |
| Critical | Mandatory governance control is missing or disabled | Missing `ManagedBy`, `DoNotEnforce` on MSP policy, direct user `Owner` assignment |
| Warning | Governance control exists but posture is weak or needs review | Non-standard environment value, custom role detected |
| Pass | Control is present and aligned to the baseline | Tags valid, built-in role assignment pattern acceptable, policy enforced |

## Reporting Rules

- Use British English throughout the report.
- Evidence must come from ARG results, not inference.
- If the target scope contains no matching resources, report that explicitly.
- Structure the report like a readiness checkpoint: verdict first, then
	blockers, warnings, required governance prerequisites, and finally the domain
	evidence tables.
- Call out missing onboarding prerequisites explicitly, including mandatory
	tags, enforced policy assignments, and RBAC assignment patterns required for
	managed-service acceptance.
- Keep remediation guidance prioritised and high-level only.

## References

- `references/mandatory-tagging.md` — Tagging, RBAC, and Azure Policy rules
