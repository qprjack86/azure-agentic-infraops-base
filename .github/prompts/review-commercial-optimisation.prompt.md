---
name: "Review Commercial Optimisation"
description: "Assess Azure workload commercial efficiency for Atech managed-service audits and produce a read-only cost-posture report."
agent: agent
model: "GPT-5.4"
argument-hint: "Describe the target scope and cost-review intent, for example: Review commercial optimisation for rg-prod-web."
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

# Review Commercial Optimisation

Assess Azure workload commercial efficiency in a read-only manner.
This prompt routes through the managed-service commercial workflow and does not
purchase commitments, resize resources, or change Azure configuration.

## Mission

- Route the request into the existing Atech commercial audit lane.
- Review SKU fit, Reserved Instance and Savings Plan suitability, Hybrid
  Benefit signals, and obvious waste findings.
- Keep the result evidence-based and explicit about any data gaps.

## Scope & Preconditions

- Start with `01-Audit Conductor` unless the user has already supplied a fully
  qualified scope and clearly wants the commercial lane only.
- Treat `.github/skills/atech-commercial-standards/SKILL.md` as the authority
  for interpretation and reporting limits.
- Use pricing MCP tooling only if the active workspace exposes it.
- Use Microsoft or Azure best-practice sources only when Atech standards are
  silent on a specific question.

## Inputs

Collect or confirm these inputs before execution:

| Input | Required | Notes |
| --- | --- | --- |
| Target scope | Yes | Subscription ID or resource group name |
| Review intent | Yes | Confirm this is a read-only commercial audit |
| Currency preference | No | Default to GBP when unspecified |
| Known exclusions | No | Resources or workloads to leave out |

## Workflow

1. Read `AGENTS.md` and `.github/copilot-instructions.md` for routing and
   precedence rules.
2. If scope or cost-review intent is unclear, ask for the missing details.
3. Invoke `01-Audit Conductor` with a routing prompt equivalent to:

```text
Review commercial optimisation for the Azure workloads in {scope}.
Treat this as a read-only managed-service commercial audit, classify the audit
type as commercial, initialise session state, and route to the commercial lane.
```

4. If the conductor is unnecessary because the user already supplied a precise
   scope and clearly wants the commercial lane immediately, invoke
   `06-Commercial Optimiser` directly with a prompt equivalent to:

```text
Assess this scope for commercial optimisation.
Use Atech commercial standards as the authority, use pricing MCP data only if
available in the current workspace, and keep Microsoft guidance supplemental.
```

5. Ensure the final report distinguishes between:
   - proven live-state waste or licence signals,
   - estimated commitment opportunities,
   - evidence gaps that block numeric savings claims.
6. Suggest a pivot to IaaS, PaaS, or governance only when the commercial
   findings expose a wider operational issue.

## Output Expectations

- Primary artifact: `audit-reports/{scope}-commercial-optimisation.md`.
- The executive summary should make it clear whether the result is:
  - evidence-backed with quantitative estimates,
  - partially quantified because pricing data was unavailable,
  - qualitative only because commitment-pricing data could not be retrieved.

## Guardrails

- Do not claim Reserved Instance or Savings Plan coverage is already in place
  without explicit evidence.
- Do not fabricate prices, savings values, or utilisation metrics.
- Do not allow generic external guidance to override Atech standards.
- Keep the workflow read-only.