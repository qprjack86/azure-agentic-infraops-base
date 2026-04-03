# Governance Audit KQL Library

Use these Azure Resource Graph queries to fetch the live governance state of the target scope.

## 1. Tagging Compliance Sweep
Fetches all resources and extracts their tags to evaluate against the MSP Mandatory Tagging Standard.

```kusto
Resources
| where type !startswith 'microsoft.security/'
| where type !startswith 'microsoft.alertsmanagement/'
| project
    ResourceName = name,
    ResourceType = type,
    ResourceGroup = resourceGroup,
    Location = location,
    Tags = tags
| order by ResourceName asc
```

## 2. RBAC Role Assignment Sweep
Fetches role assignments and joins role definitions so the auditor can reason over privileged roles by name.

```kusto
AuthorizationResources
| where type =~ 'microsoft.authorization/roleassignments'
| extend RoleDefinitionId = tolower(tostring(properties.roleDefinitionId))
| extend PrincipalId = tostring(properties.principalId)
| extend PrincipalType = tostring(properties.principalType)
| extend Scope = tostring(properties.scope)
| join kind=leftouter (
    AuthorizationResources
    | where type =~ 'microsoft.authorization/roledefinitions'
    | extend RoleDefinitionId = tolower(id)
    | project RoleDefinitionId, RoleName = tostring(properties.roleName), RoleType = tostring(properties.type)
) on RoleDefinitionId
| project
    AssignmentName = name,
    Scope,
    PrincipalId,
    PrincipalType,
    RoleName,
    RoleType,
    RoleDefinitionId
| order by Scope asc
```

## 3. Azure Policy Compliance Sweep
Fetches policy assignments and joins policy definitions so the auditor can reason over effect and enforcement state.

```kusto
PolicyResources
| where type =~ 'microsoft.authorization/policyassignments'
| extend PolicyDefinitionId = tolower(tostring(properties.policyDefinitionId))
| join kind=leftouter (
    PolicyResources
    | where type =~ 'microsoft.authorization/policydefinitions'
    | extend PolicyDefinitionId = tolower(id)
    | project PolicyDefinitionId, PolicyEffect = tostring(properties.policyRule.then.effect)
) on PolicyDefinitionId
| project
    AssignmentName = name,
    DisplayName = tostring(properties.displayName),
    Scope = tostring(properties.scope),
    EnforcementMode = tostring(properties.enforcementMode),
    PolicyDefinitionId,
    PolicyEffect
| order by DisplayName asc
```