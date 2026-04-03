---
name: atech-iaas-standards
description: "Managed-service operational baseline for Azure IaaS audits. USE FOR: VM monitoring, patching, backup, and severity scoring. DO NOT USE FOR: governance tagging, FinOps waste analysis, or remediation code generation."
---

# Atech IaaS Standards Skill

Authoritative rulebook for read-only Azure IaaS managed-service audits.
This skill mirrors the builder repo's skill-first pattern, but for live-state
compliance checks rather than infrastructure generation.

## Quick Reference

| Control Domain | Mandatory Outcome | Severity When Missing |
| --- | --- | --- |
| Monitoring | Azure Monitor Agent installed and healthy, no legacy agent, DCR associated | Critical |
| Patching | `AutomaticByPlatform` patching and assessment, approved maintenance policy | Critical |
| Backup | Azure Backup protection enabled with a valid policy and recent recovery point evidence | Critical |

## Audit Order

1. Confirm Azure authentication and target scope.
2. Run inventory and monitoring sweeps.
3. Run patch posture sweep.
4. Run backup protection sweep.
5. Compress noisy results before analysis.
6. Write a report to `audit-reports/`.

## Severity Model

| Status | Meaning | Examples |
| --- | --- | --- |
| Critical | Non-negotiable MSP control is absent or misconfigured | Missing AMA, no DCR, patch mode not set, backup missing |
| Warning | A control exists but the posture is weak or ambiguous | Backup item exists but recovery point missing, non-standard maintenance policy |
| Pass | Control is present and aligned to the baseline | AMA healthy, approved maintenance policy, protected backup item |

## Reporting Rules

- Use British English throughout the report.
- Evidence must come from ARG results, not inference.
- If the target scope contains no VMs, report that explicitly and stop.
- Structure the report like a readiness checkpoint: verdict first, then
	blockers, warnings, required plugins or platform attachments, and finally the
	domain evidence tables.
- Call out missing onboarding prerequisites explicitly, including Azure Monitor
	Agent, banned legacy agents, DCR association, maintenance configuration, and
	backup policy or protection gaps where evidenced by live state.
- Keep remediation advice prioritised, but high-level. Do not generate scripts or IaC unless the user asks.

## References

- `references/monitoring-rules.md` — Monitoring and DCR controls
- `references/patch-rules.md` — Azure Update Manager controls
- `references/backup-dr.md` — Backup and recovery controls
