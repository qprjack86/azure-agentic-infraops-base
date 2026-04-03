# MSP App Service Standard

Every managed-service Azure App Service workload must conform to the following
baseline unless the customer has an approved exception.

1. **HTTPS Only Required:** `httpsOnly` must be enabled.
2. **Minimum TLS Required:** `minTlsVersion` must be `1.2` or higher.
3. **Managed Identity Preferred:** A system-assigned or user-assigned managed
   identity should be present. Treat a missing identity as a warning unless a
   stronger customer-specific rule exists.
4. **Public Exposure Reviewed:** `publicNetworkAccess` should be disabled for
   privately exposed workloads or explicitly documented for internet-facing apps.

## Audit Outcome

- `Critical`: HTTPS-only disabled or TLS below 1.2.
- `Warning`: Managed identity missing or public network access still enabled.
- `Pass`: HTTPS-only enabled, TLS 1.2+, and exposure posture matches the
  expected managed-service baseline.