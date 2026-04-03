# IaaS Audit KQL Library

Use these Azure Resource Graph queries to fetch the live state of Azure IaaS
virtual machines in the target scope.

## 1. VM Inventory Baseline
Use this query first to establish the virtual machines in scope and capture the
core metadata needed by later sweeps.

```kusto
Resources
| where type =~ 'microsoft.compute/virtualmachines'
| project
    VMId = tolower(id),
    VMName = name,
    ResourceGroup = resourceGroup,
    Location = location,
    OSType = tostring(properties.storageProfile.osDisk.osType),
    PowerState = tostring(properties.extended.instanceView.powerState.code)
| order by VMName asc
```

## 2. Monitoring And DCR Sweep
Use this query to validate Azure Monitor Agent coverage, detect banned legacy
agents, and confirm at least one data collection rule association.

This query follows Microsoft ARG patterns for VM extension joins and DCR
association discovery.

```kusto
Resources
| where type =~ 'microsoft.compute/virtualmachines'
| project
    JoinId = toupper(id),
    VMName = name,
    ResourceGroup = resourceGroup,
    OSType = tostring(properties.storageProfile.osDisk.osType)
| join kind=leftouter (
    Resources
    | where type =~ 'microsoft.compute/virtualmachines/extensions'
    | extend JoinId = toupper(substring(id, 0, indexof(id, '/extensions')))
    | project
        JoinId,
        ExtensionName = name,
        ExtensionType = tostring(properties.type),
        ProvisioningState = tostring(properties.provisioningState)
) on JoinId
| summarize
    ExtensionTypes = make_set(ExtensionType),
    ExtensionStates = make_set(ProvisioningState),
    ExtensionNames = make_set(ExtensionName)
    by VMName, ResourceGroup, OSType
| join kind=leftouter (
    InsightsResources
    | where type =~ 'microsoft.insights/datacollectionruleassociations'
    | where id contains 'microsoft.compute/virtualmachines/'
    | project AssociationId = trim_start('/', tolower(id)), DcrId = tostring(properties.dataCollectionRuleId)
    | extend Parts = split(AssociationId, '/')
    | project
        ResourceGroup = tostring(Parts[3]),
        VMName = tostring(Parts[7]),
        DcrId
    | summarize DcrIds = make_set(DcrId), DcrCount = count() by ResourceGroup, VMName
) on ResourceGroup, VMName
| project
    VMName,
    ResourceGroup,
    OSType,
    ExtensionTypes,
    ExtensionStates,
    ExtensionNames,
    DcrCount = coalesce(DcrCount, 0),
    DcrIds
| order by VMName asc
```

## 3. Backup Protection Sweep
Use this query to validate Azure Backup coverage for IaaS virtual machines.
This query follows the Microsoft ARG pattern for `RecoveryServicesResources`
protected items.

```kusto
Resources
| where type =~ 'microsoft.compute/virtualmachines'
| project
    VMId = tolower(id),
    VMName = name,
    ResourceGroup = resourceGroup,
    Location = location
| join kind=leftouter (
    RecoveryServicesResources
    | where type == 'microsoft.recoveryservices/vaults/backupfabrics/protectioncontainers/protecteditems'
    | extend PropertiesJson = parse_json(properties)
    | where tostring(PropertiesJson.backupManagementType) == 'AzureIaasVM'
    | project
        VMId = tolower(tostring(PropertiesJson.sourceResourceId)),
        BackupItemId = id,
        PolicyId = tostring(PropertiesJson.policyId),
        LastBackupStatus = tostring(PropertiesJson.lastBackupStatus),
        LastRecoveryPoint = tostring(PropertiesJson.lastRecoveryPoint)
) on VMId
| extend IsProtected = isnotempty(BackupItemId)
| project
    VMName,
    ResourceGroup,
    Location,
    IsProtected,
    PolicyId,
    LastBackupStatus,
    LastRecoveryPoint
| order by VMName asc
```
