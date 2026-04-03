---
name: "Onboard IaaS Workloads"
description: "Assess Azure IaaS workloads for onboarding onto the Atech managed service and produce a gap-focused readiness report."
agent: agent
model: "GPT-5.4"
argument-hint: "Describe the target scope and any onboarding context, for example: Onboard IaaS workloads in rg-prod-web onto Atech managed service."
tools:
  [
    read/readFile,
    search/fileSearch,
    search/textSearch,
    agent,
    vscode/askQuestions,
    todo
  ]
---

# Onboard IaaS Workloads

Assess Azure IaaS workloads for onboarding onto the Atech managed service.
Treat onboarding as a read-only readiness assessment, not as an automated
migration or remediation exercise.

## Mission

- Route the request through the existing managed-service audit workflow.
- Frame the outcome as an onboarding readiness assessment.
- Identify the operational gaps that must be closed before Atech can safely
  support the workload.
- Pivot to the commercial lane only when the user explicitly wants cost posture
  reviewed as part of onboarding.

## Scope & Preconditions

- This repository is read-only by design.
- "Onboard" means assess, evidence, and report. It does not mean deploy,
  configure, or remediate Azure resources.
- Start with `01-Audit Conductor` unless the user has already supplied a fully
  qualified IaaS scope and clearly wants the IaaS lane only.
- Use the existing IaaS standards and session-state flow already defined in the
  repo.

## Inputs

Collect or confirm these inputs before execution:

| Input | Required | Notes |
| --- | --- | --- |
| Target scope | Yes | Subscription ID or resource group name |
| Service context | No | Production tier, support tier, business criticality |
| Onboarding intent | Yes | Confirm this is an Atech managed-service onboarding assessment |
| Known exclusions | No | Workloads or subscriptions to ignore |

## Workflow

1. Read `AGENTS.md` and `.github/copilot-instructions.md` for the audit routing model.
2. If scope or onboarding intent is unclear, ask for the missing details.
3. Invoke `01-Audit Conductor` with a routing prompt equivalent to:

```text
Onboard the Azure IaaS workloads in {scope} onto the Atech managed service.
Treat this as an onboarding readiness assessment, classify the audit type as
iaas, initialise session state, and route to the IaaS auditor.
```

4. If the conductor is unnecessary because the user already supplied a precise
   IaaS-only scope and wants the assessment immediately, invoke
   `02-IaaS Auditor` directly with a prompt equivalent to:

```text
Assess this scope for onboarding onto the Atech managed service.
Run the managed-service IaaS audit workflow, but present the findings as an
onboarding readiness gap assessment with clear blockers, warnings, and data gaps.
```

5. Ensure the final report explicitly distinguishes:
   - onboarding blockers,
   - non-blocking warnings,
   - evidence gaps that prevent acceptance.
6. Suggest a pivot to governance or PaaS only when the findings show those lanes
  are required for onboarding confidence.
7. If the user also asks whether the workload is commercially well aligned,
  invoke `06-Commercial Optimiser` after the IaaS assessment with a prompt
  equivalent to:

```text
Review the same scope for commercial optimisation as part of onboarding.
Use Atech commercial standards as the authority, use pricing MCP data only if
available in the current workspace, and report any cost evidence gaps clearly.
```

## Output Expectations

- Primary artifact: the normal IaaS audit report in `audit-reports/`.
- Optional secondary artifact: a commercial optimisation report in
  `audit-reports/` when onboarding explicitly includes cost posture.
- The executive summary should make it clear that the report is being used as an
  onboarding readiness assessment.
- The report should read like a preflight checkpoint: verdict first, explicit
  blockers second, and required plugins, extensions, or platform attachments
  called out before the detailed compliance tables.
- The final user-facing summary should state whether the workload appears:
  - ready for onboarding,
  - conditionally ready with remediation,
  - not ready pending major control gaps.

## Guardrails

- Do not generate onboarding runbooks, remediation scripts, or deployment code
  unless the user asks for them explicitly.
- Do not claim onboarding approval where evidence is missing.
- Treat Atech standards as authoritative. Use Microsoft guidance only when the
  Atech baseline is silent on a specific onboarding question.
- Keep the language operational and evidence-based.