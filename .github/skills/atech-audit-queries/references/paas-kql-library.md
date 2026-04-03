# PaaS Audit KQL Library

Use these Azure Resource Graph queries to fetch the live state of supported
Azure PaaS services in the target scope.

## 1. App Service Configuration Sweep
Fetches web app configuration needed to evaluate HTTPS-only, minimum TLS,
managed identity, and public network exposure.

```kusto
Resources
| where type =~ 'microsoft.web/sites'
| where kind !contains 'functionapp'
| project
    SiteId = tolower(id),
    SiteName = name,
    ResourceGroup = resourceGroup,
    Location = location,
    Kind = kind,
    HttpsOnly = tostring(properties.httpsOnly),
    PublicNetworkAccess = tostring(properties.publicNetworkAccess),
    IdentityType = tostring(identity.type)
| join kind=leftouter (
    AppServiceResources
    | where type =~ 'microsoft.web/sites/config'
    | extend SiteId = tolower(substring(id, 0, indexof(id, '/config')))
    | project
        SiteId,
        MinTlsVersion = tostring(properties.minTlsVersion),
        ScmMinTlsVersion = tostring(properties.scmMinTlsVersion),
        FtpsState = tostring(properties.ftpsState)
) on SiteId
| project
    SiteName,
    ResourceGroup,
    Location,
    Kind,
    HttpsOnly,
    MinTlsVersion,
    ScmMinTlsVersion,
    FtpsState,
    PublicNetworkAccess,
    IdentityType
| order by SiteName asc
```

## 2. Storage Account Security Sweep
Fetches HTTPS, TLS, blob access, and network exposure posture for storage
accounts.

```kusto
Resources
| where type =~ 'microsoft.storage/storageaccounts'
| project
    AccountName = name,
    ResourceGroup = resourceGroup,
    Location = location,
    Kind = kind,
    Sku = tostring(sku.name),
    HttpsOnly = tostring(properties.supportsHttpsTrafficOnly),
    MinimumTlsVersion = tostring(properties.minimumTlsVersion),
    PublicNetworkAccess = tostring(properties.publicNetworkAccess),
    AllowBlobPublicAccess = tostring(properties.allowBlobPublicAccess),
    DefaultAction = tostring(properties.networkAcls.defaultAction)
| order by AccountName asc
```

## 3. Azure SQL Exposure Sweep
Fetches SQL server exposure posture and database counts for Azure SQL logical
servers in scope.

```kusto
Resources
| where type =~ 'microsoft.sql/servers'
| project
    ServerId = tolower(id),
    ServerName = name,
    ResourceGroup = resourceGroup,
    Location = location,
    PublicNetworkAccess = tostring(properties.publicNetworkAccess),
    MinimalTlsVersion = tostring(properties.minimalTlsVersion)
| join kind=leftouter (
    Resources
    | where type =~ 'microsoft.sql/servers/databases'
    | where name !endswith '/master'
    | extend ServerId = tolower(substring(id, 0, indexof(id, '/databases')))
    | project ServerId, DatabaseName = name
) on ServerId
| summarize
    DatabaseCount = countif(isnotempty(DatabaseName)),
    Databases = make_set(DatabaseName)
    by ServerName, ResourceGroup, Location, PublicNetworkAccess, MinimalTlsVersion
| order by ServerName asc
```