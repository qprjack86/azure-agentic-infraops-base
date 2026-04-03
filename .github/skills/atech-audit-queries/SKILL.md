---
name: atech-audit-queries
description: "Azure Resource Graph query library for Atech managed-service audits. USE FOR: sequencing live-state discovery queries for IaaS, PaaS, governance, and FinOps workflows. DO NOT USE FOR: interpreting policy, remediation, or Azure architecture design."
---

# Atech Audit Queries Skill

This skill contains the Azure Resource Graph queries used by the auditor agents.
It follows the same skill-first pattern as the builder repo: the agent reads the
skill, then executes only the queries needed for the selected workflow.

## Query Handling Rules

1. Run inventory queries before control-specific queries.
2. Preserve resource IDs, names, and policy identifiers in the final evidence.
3. If a query returns no rows, distinguish between `no resources in scope` and
	`control missing from resources in scope`.
4. Apply context shredding before large result sets are analysed or written up.

## Current Focus

The aligned managed-service audit lanes in this repo are:

- `references/iaas-kql-library.md` — VM inventory, monitoring, DCR, and backup coverage
- `references/patch-kql-library.md` — patch mode, assessment mode, maintenance policy
- `references/paas-kql-library.md` — App Service, Storage, and Azure SQL exposure checks
- `references/governance-kql-library.md` — tagging, RBAC, and Azure Policy guardrails
- `references/finops-kql-library.md` — orphaned-resource waste and running compute discovery
