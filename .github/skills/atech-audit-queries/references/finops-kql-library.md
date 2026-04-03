# FinOps Audit KQL Library

Use these Azure Resource Graph queries to discover orphaned, underutilised, or misconfigured resources that cause financial waste.

## 1. Unattached Managed Disks
Disks that have been provisioned but are no longer attached to a running Virtual Machine.

```kusto
Resources
| where type =~ 'microsoft.compute/disks'
| where properties.diskState =~ 'Unattached'
| project
    ResourceName = name,
    ResourceGroup = resourceGroup,
    Location = location,
    SKU = sku.name,
    SizeGB = toint(properties.diskSizeGB)
| order by ResourceName asc
```

## 2. Empty App Service Plans
App Service Plans that currently have no sites attached.

```kusto
Resources
| where type =~ 'microsoft.web/serverfarms'
| where properties.numberOfSites == 0
| project
    ResourceName = name,
    ResourceGroup = resourceGroup,
    Location = location,
    SKU = sku.name,
    Tier = sku.tier
| order by ResourceName asc
```

## 3. Unused Public IP Addresses
Public IPs that are not attached to a NIC or load balancer frontend.

```kusto
Resources
| where type =~ 'microsoft.network/publicipaddresses'
| where isnull(properties.ipConfiguration)
| project
    ResourceName = name,
    ResourceGroup = resourceGroup,
    Location = location,
    SKU = sku.name
| order by ResourceName asc
```

## 4. Running Compute For Commercial Optimisation
Fetches running Virtual Machines and their exact SKUs to evaluate for Reserved
Instance or Savings Plan eligibility, SKU efficiency, and Hybrid Benefit signals.

```kusto
Resources
| where type =~ 'microsoft.compute/virtualmachines'
| where properties.extended.instanceView.powerState.code == 'PowerState/running'
| project
    ResourceName = name,
    ResourceGroup = resourceGroup,
    Location = location,
    SKU = tostring(properties.hardwareProfile.vmSize),
    OSType = tostring(properties.storageProfile.osDisk.osType),
    LicenseType = tostring(properties.licenseType)
| order by ResourceName asc
```