# MSP Monitoring Standard

Every deployed IaaS Virtual Machine must strictly conform to the following operational standards. Any deviation is considered a Critical Failure.

1. **Mandatory Extension:** The Azure Monitor Agent (`AzureMonitorWindowsAgent` for Windows or `AzureMonitorLinuxAgent` for Linux) must be installed and report a "Succeeded" provisioning state.
2. **Legacy Agent Ban:** The legacy Log Analytics agent (`MicrosoftMonitoringAgent` or `OmsAgentForLinux`) must NOT be present on the machine.
3. **Data Collection Rule (DCR):** The VM must have an active association to an MSP-managed Data Collection Rule.