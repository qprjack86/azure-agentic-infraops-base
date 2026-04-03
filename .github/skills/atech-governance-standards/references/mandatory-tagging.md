# Atech Mandatory Tagging Standard

## Scope
This standard defines the minimum tagging baseline for Azure subscriptions managed by Atech.

**Initial implementation scope:** tags are to be applied at the **subscription level** only.

This is a deliberate change from generic resource-level tagging guidance. The first phase is intended to give Atech a consistent subscription-level view for service ownership, support model, automation, and reporting.

Resource-level tagging can be added later where there is a clear operational, billing, or automation need.

## Core Rule for Tag Value Collection
The agent must **ask the user to provide the tag values** for the subscription unless the value is explicitly known from another trusted source.

If a value appears to be known from another source, such as:
- contract or service onboarding data,
- CRM or PSA records,
- customer tenancy records,
- previously approved governance records,
- policy-backed reference data,

the agent must still **present the proposed value to the user and ask for confirmation before applying it**.

The agent must not assume or infer tag values from incomplete context, naming conventions, or pattern matching alone.

## Tagging Principles
- Apply the agreed Atech tags at the **subscription scope** as the first step.
- Use a consistent controlled vocabulary for tag values where defined.
- Treat some tags as **base tags** that should exist on every in-scope subscription.
- Treat other tags as **conditional tags** that should only be set where relevant.
- Where policy automation is introduced, use it to stamp or validate tags consistently.
- The agent must collect tag values from the user unless a trusted source already holds the value.
- Where a trusted source already holds a value, the agent must still ask the user to confirm it before use.
- The agent must not auto-populate uncertain business metadata.

## Mandatory Base Tags at Subscription Level
The following tags form the mandatory baseline for subscriptions.

### 1. `Atech_Customer`
**Purpose:** Customer or tenant identifier.

**Example values:** `BTG`, `Pro-Global`

**Requirement:** Mandatory on every in-scope subscription.

**Collection rule:** Ask the user to provide the value. If obtained from a trusted source, present the proposed value and ask the user to confirm it.

### 2. `Atech_ServiceLevel`
**Purpose:** Service tier aligned to the contracted service level.

**Example values:** `Premium`, `Assurance`, `Transactional`

**Requirement:** Mandatory on every in-scope subscription.

**Collection rule:** Ask the user to provide the value. If obtained from a trusted source, present the proposed value and ask the user to confirm it.

**Implementation note:** Where policy automation is used, a `Transactional` value should drive `Atech_ManagedBy=Customer`.

### 3. `Atech_SupportTier`
**Purpose:** Support model used to align support response expectations and engineer handling.

**Example values:** `24x7`, `BusinessHours`, `Break/Fix`, `None`

**Requirement:** Mandatory on every in-scope subscription.

**Collection rule:** Ask the user to provide the value. If obtained from a trusted source, present the proposed value and ask the user to confirm it.

**Implementation note:** This tag is intended to support engineer stopping and support process decisions.

### 4. `Atech_ManagedBy`
**Purpose:** Identifies who manages the service or estate.

**Example values:** `Atech`, `Customer`, `Co-managed`

**Requirement:** Mandatory on every in-scope subscription.

**Collection rule:** Ask the user to provide the value. If obtained from a trusted source, present the proposed value and ask the user to confirm it.

**Implementation note:** Where a subscription is customer managed, policy automation may be used so that other managed-service operational tags do not apply.

### 5. `Atech_CostCenter`
**Purpose:** Billing or chargeback code.

**Example values:** `tbc`

**Requirement:** Mandatory on every in-scope subscription.

**Collection rule:** Ask the user to provide the value. If obtained from a trusted source, present the proposed value and ask the user to confirm it.

**Implementation note:** This should align with FinOps and customer billing/reporting requirements once agreed.

## Conditional Subscription Tags
These tags are not part of the mandatory baseline for day one, but should be added at subscription level where relevant.

### `Atech_ServiceModules`
**Purpose:** Records service modules or bolt-ons in scope.

**Example values:** `AVD`, `ServerOS`, `ServerWorkload`, `Network`, `Backup/DR`

**Use when:** A subscription includes one or more defined managed service modules.

**Collection rule:** Ask the user to provide the value. If a value is available from a trusted source, present it for confirmation before applying it.

### `Atech_Compliance`
**Purpose:** Records formal compliance requirements.

**Example values:** `ISO27001`, `CE+`, `NIST`

**Use when:** The customer or workload has a stated compliance requirement.

**Collection rule:** Ask the user to provide the value. If a value is available from a trusted source, present it for confirmation before applying it.

### `Atech_Criticality`
**Purpose:** Business or service criticality.

**Example values:** `mission-critical`, `medium`, `low`

**Use when:** Criticality classification is known and agreed.

**Collection rule:** Ask the user to provide the value. If a value is available from a trusted source, present it for confirmation before applying it.

### `Atech_DataSensitivity`
**Purpose:** Data classification.

**Example values:** `Public`, `Internal`, `Confidential`

**Use when:** Data classification is known and relevant to governance or control selection.

**Collection rule:** Ask the user to provide the value. If a value is available from a trusted source, present it for confirmation before applying it.

### `Atech_BackupPolicy/Product`
**Purpose:** Backup policy profile or backup product in use.

**Example values:** `Standard-30D`, `Premium-1Y`, `Azure`, `Acronis`, `Veeam`

**Use when:** Backup is managed or explicitly in scope.

**Collection rule:** Ask the user to provide the value. If a value is available from a trusted source, present it for confirmation before applying it.

### `Atech_PatchWindow/Patch Product`
**Purpose:** Maintenance window or patch tooling reference.

**Example values:** `Sun-22:00-02:00-UTC`, `AUM`, `3rd Party`

**Use when:** Patching is managed or a formal maintenance window applies.

**Collection rule:** Ask the user to provide the value. If a value is available from a trusted source, present it for confirmation before applying it.

### `Atech_P1Alerting/System`
**Purpose:** Identifies whether P1 alerting or system monitoring integration is enabled.

**Example values:** `Yes`, `No`

**Use when:** Monitoring integration is applicable.

**Collection rule:** Ask the user to provide the value. If a value is available from a trusted source, present it for confirmation before applying it.

**Implementation note:** This tag may be used to drive automation such as Site24x7 Azure agent deployment.

## Agent Interaction Model
When preparing or validating subscription tags, the agent should follow this order:

1. Identify the required base tags for the subscription.
2. Check whether any candidate values already exist in trusted source systems.
3. Ask the user for each missing value.
4. For each value found from another source, present the proposed value to the user and ask for confirmation.
5. Only apply or recommend the tag set after the user has confirmed the values.
6. Where the user declines a proposed value, use the user's confirmed value instead.
7. Where the user is unsure, leave the tag unset and flag it for follow-up rather than guessing.

## Required Behaviour by Service Type

### Managed subscriptions
Managed subscriptions should carry the full mandatory base tag set.

Conditional tags should be added where the related service module or operational process exists.

### Transactional subscriptions
Transactional subscriptions should still carry the mandatory base tag set.

Where policy logic is implemented, `Atech_ServiceLevel=Transactional` should set or validate `Atech_ManagedBy=Customer`.

Operational tags that only make sense for managed services should not be forced where Atech is not delivering that operational function.

### Customer-managed subscriptions
Where a subscription is explicitly customer managed, `Atech_ManagedBy` should be set to `Customer`.

Any automation that applies managed-service operational tags should exclude these subscriptions unless there is a defined exception.

## Policy and Automation Guidance
- Use Azure Policy to **audit** and then **enforce** the mandatory base tags at subscription level.
- Start with controlled allowed values where they are already defined.
- Add remediation only where the source value is known and governed.
- Do not auto-populate business metadata without user confirmation.
- Use tag-driven automation only where there is a documented operational dependency.
- If automation proposes a value from another source, it must still be confirmed by the user before the value is written.

## Minimum Day-One Compliance Standard
A subscription is compliant in the initial phase when it has all of the following tags populated with user-provided or user-confirmed values:
- `Atech_Customer`
- `Atech_ServiceLevel`
- `Atech_SupportTier`
- `Atech_ManagedBy`
- `Atech_CostCenter`

## Future Expansion
The next phase can extend this standard to:
- resource group level where ownership differs inside a subscription,
- resource level where automation, billing, backup, or patching require it,
- inheritance and remediation patterns through Azure Policy,
- stronger integration with trusted source systems for pre-population of candidate values.

## Summary
The original markdown described a generic resource-level mandatory tagging model.

This revised version aligns to the Atech tagging spreadsheet, changes the standard to a subscription-level mandatory baseline, and adds a clear rule that the agent must ask the user for tag values unless they are already known from a trusted source, in which case the agent must still ask the user to confirm those values before applying them.
