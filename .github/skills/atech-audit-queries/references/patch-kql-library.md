# Patch Management Audit KQL Library

Use this precise Azure Resource Graph (ARG) query to fetch the OS patch settings and Maintenance Configuration assignments for all Virtual Machines in the target scope. 

```kusto
Resources
| where type =~ 'microsoft.compute/virtualmachines'
| project 
    vmId = tolower(id), 
    VMName = name, 
    ResourceGroup = resourceGroup, 
    osType = tostring(properties.storageProfile.osDisk.osType),
    patchMode = iff(properties.storageProfile.osDisk.osType =~ 'Windows', tostring(properties.osProfile.windowsConfiguration.patchSettings.patchMode), tostring(properties.osProfile.linuxConfiguration.patchSettings.patchMode)),
    assessmentMode = iff(properties.storageProfile.osDisk.osType =~ 'Windows', tostring(properties.osProfile.windowsConfiguration.patchSettings.assessmentMode), tostring(properties.osProfile.linuxConfiguration.patchSettings.assessmentMode))
| join kind=leftouter (
    Resources
    | where type =~ 'microsoft.maintenance/configurationassignments'
    | extend vmId = tolower(properties.resourceId)
    | extend maintenanceConfigId = tostring(properties.maintenanceConfigurationId)
    | extend maintenanceConfigName = tostring(split(maintenanceConfigId, '/')[-1])
    | project vmId, maintenanceConfigName
) on vmId
| project 
    VMName, 
    ResourceGroup, 
    OSType = osType, 
    PatchMode = patchMode, 
    AssessmentMode = assessmentMode,
    MaintenancePolicy = coalesce(maintenanceConfigName, "Unassigned")
| order by VMName asc