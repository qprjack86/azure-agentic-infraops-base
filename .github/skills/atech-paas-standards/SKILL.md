---
name: atech-paas-standards
description: "Managed-service operational baseline for Azure PaaS audits. USE FOR: App Service, Storage Account, and Azure SQL exposure, encryption, and identity checks. DO NOT USE FOR: VM operational standards, governance tagging, or remediation code generation."
---

# Atech PaaS Standards Skill

Authoritative rulebook for read-only Azure PaaS managed-service audits.
This skill covers the common PaaS services currently in scope for this repo:
App Service, Storage Accounts, and Azure SQL.

## Quick Reference

| Control Domain | Mandatory Outcome | Severity When Missing |
| --- | --- | --- |
| App Service | HTTPS only, minimum TLS 1.2 or higher, managed identity enabled, public exposure reviewed | Critical |
| Storage | HTTPS only, minimum TLS 1.2 or higher, public blob access disabled, public network restricted | Critical |
| Azure SQL | Minimum TLS 1.2 or higher, public network disabled or tightly controlled | Critical |

## Audit Order

1. Confirm Azure authentication and target scope.
2. Run the App Service configuration sweep.
3. Run the Storage account security sweep.
4. Run the Azure SQL exposure sweep.
5. Compress noisy results before analysis.
6. Write a report to `audit-reports/`.

## Severity Model

| Status | Meaning | Examples |
| --- | --- | --- |
| Critical | Non-negotiable security or exposure control is absent | HTTPS-only disabled, TLS below 1.2, public blob access enabled, unrestricted public SQL exposure |
| Warning | Control exists but posture needs review or is weaker than preferred | Managed identity missing, App Service public exposure still enabled, storage network rules incomplete |
| Pass | Control is present and aligned to the baseline | TLS 1.2+, HTTPS-only enabled, public access restricted |

## Reporting Rules

- Use British English throughout the report.
- Evidence must come from ARG results, not inference.
- If the target scope contains no supported PaaS resources, report that explicitly.
- Structure the report like a readiness checkpoint: verdict first, then
	blockers, warnings, required protections or platform prerequisites, and
	finally the service evidence tables.
- Call out missing onboarding prerequisites explicitly, including HTTPS-only,
	minimum TLS, managed identity, public blob access restrictions, public network
	restrictions, and SQL exposure controls where evidenced by live state.
- Keep remediation advice prioritised, but high-level. Do not generate scripts or IaC unless the user asks.

## References

- `references/app-service-rules.md` — App Service exposure and TLS controls
- `references/data-service-rules.md` — Storage and Azure SQL exposure controls