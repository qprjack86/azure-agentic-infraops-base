---
name: atech-commercial-standards
description: "Managed-service commercial baseline for Azure audits. USE FOR: SKU efficiency review, Reserved Instance and Savings Plan recommendations, Hybrid Benefit signal checks, and cost-analysis reporting limits. DO NOT USE FOR: governance tagging, VM operational standards, or remediation code generation."
---

# Atech Commercial Standards

Use this skill when the audit objective is commercial efficiency rather than
operational compliance.

## When to Use This Skill

- Reviewing whether running compute appears aligned to an efficient SKU family
- Assessing whether Reserved Instances or Savings Plans should be recommended
- Checking for Azure Hybrid Benefit signals on supported compute workloads
- Explaining what cost posture can and cannot be proven from the available data

## Core Principles

1. Stay read-only. Report commercial findings; do not purchase, reconfigure, or migrate.
2. Separate proven live-state signals from pricing-model recommendations.
3. Treat orphaned or idle resources as waste findings, not commitment opportunities.
4. Call out evidence gaps explicitly when billing or reservation coverage data is unavailable.

## Evidence And Reference Precedence

1. Atech commercial standards are authoritative when they define a rule.
2. Live Azure state is the source of truth for the current deployed posture.
3. Workspace-exposed pricing MCP tools may be used for numeric estimates when
  available, but absence of those tools must not block a qualitative review.
4. Microsoft or Azure best-practice content is supplementary and should be used
  only where the Atech baseline is silent.
5. Never let generic guidance override live-state evidence or Atech policy.

## Commercial Review Areas

| Area | What To Check | Evidence Type |
| --- | --- | --- |
| SKU efficiency | Current VM size, region, OS, and workload fit | Azure Resource Graph + pricing comparison |
| Commitment options | RI and Savings Plan suitability for steady-state compute | Pricing tools + running inventory |
| Hybrid Benefit | License type signals on supported resources | Azure Resource Graph live-state fields |
| Regional arbitrage | Same-family SKU pricing in lower-cost regions | Pricing comparison |

## Evidence Rules

- You can recommend RI or Savings Plan options from SKU and runtime signals.
- You cannot claim that RI or Savings Plan coverage is already in place unless a
  live billing or commitment source explicitly proves it.
- You can flag Azure Hybrid Benefit signals when the resource exposes a relevant
  `licenseType` or equivalent live-state property.
- You must distinguish between `not configured`, `not visible from current data`,
  and `not applicable`.

## Decision Guidance

### SKU Efficiency

- Focus first on continuously running compute in production-like scopes.
- Prefer findings that compare the current SKU against a plausible lower-cost
  or better-fit alternative, not generic downsizing advice.
- If the available data does not include utilisation, state that the SKU review
  is rightsizing-oriented rather than performance-proven.

### Reserved Instances And Savings Plans

- Recommend these only for workloads that appear consistently running.
- Savings Plans are usually more flexible; RIs may be stronger where the VM
  family and region look stable.
- If pricing tools are unavailable, report the opportunity qualitatively and
  mark the financial estimate as unavailable.

### Hybrid Benefit

- Treat `licenseType` as a signal, not as proof of economic optimisation.
- If `licenseType` is null or missing, report `not visible` unless the workload
  is clearly in a category where Hybrid Benefit is not applicable.

## Reporting Expectations

Include these themes in the final commercial report where relevant:

- Current cost baseline
- Waste findings
- SKU efficiency review
- RI and Savings Plan recommendation summary
- Hybrid Benefit signal summary
- Data gaps and confidence limits
- Data source clarity, including whether pricing MCP estimates were available