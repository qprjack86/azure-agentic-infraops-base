# MSP Data Service Standard

Managed-service Azure Storage and Azure SQL services must conform to the
following baseline controls.

## Storage Accounts

1. **HTTPS Only Required:** `supportsHttpsTrafficOnly` must be enabled.
2. **Minimum TLS Required:** `minimumTlsVersion` must be `TLS1_2` or higher.
3. **No Public Blob Access:** `allowBlobPublicAccess` must be disabled.
4. **Public Network Restricted:** `publicNetworkAccess` should be disabled or
   the network ACL default action should be `Deny`.

## Azure SQL Servers

1. **Minimum TLS Required:** `minimalTlsVersion` must be `1.2` or higher.
2. **Public Network Restricted:** `publicNetworkAccess` should be disabled.
3. **Exception Handling:** If public access is enabled for a valid business
   reason, report it as a warning unless there is evidence of broad exposure.

## Audit Outcome

- `Critical`: TLS below 1.2, public blob access enabled, or public network
  access clearly left open without restriction.
- `Warning`: Exposure posture needs review but is not clearly wide open.
- `Pass`: Encryption and public-access controls align to the baseline.