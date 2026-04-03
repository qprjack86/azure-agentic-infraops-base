# MSP Backup And Recovery Standard

Every managed-service Azure IaaS Virtual Machine must conform to the following
backup and recovery baseline. Any deviation is a compliance failure.

1. **Backup Protection Required:** The VM must be represented by an Azure Backup
	protected item for `AzureIaasVM` in a Recovery Services vault.
2. **Policy Assignment Required:** The protected item must reference an active
	backup policy. A protected item without a policy is non-compliant.
3. **Recovery Point Evidence:** The protected item should expose a recent
	`lastRecoveryPoint`. Treat a missing recovery point as a warning unless the
	VM is entirely unprotected, which is critical.
4. **Audit Outcome:**
	- `Critical`: no backup item found, or no backup policy is attached.
	- `Warning`: protected item exists but recovery point evidence is blank or stale.
	- `Pass`: protected item, policy, and recovery point evidence are all present.
