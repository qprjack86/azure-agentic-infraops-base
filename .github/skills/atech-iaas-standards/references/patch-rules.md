# MSP Patch Management Standard

Every deployed IaaS Virtual Machine must strictly conform to the following Azure Update Manager standards. Any deviation is considered a Critical Failure.

1. **Mandatory Patch Mode:** The VM's `patchMode` must be explicitly set to `AutomaticByPlatform` (Azure Update Manager). 
2. **Maintenance Configuration Enrollment:** The VM MUST be associated with a Maintenance Configuration schedule that aligns with one of our two standard MSP policies:
   - `Patch & Reboot in hours`
   - `Patch & reboot out of hours`
   *Rejection Criteria:* If the VM is unassigned, or if the assigned schedule name does not match our standard in-hours or out-of-hours conventions, flag the resource as non-compliant.
3. **Periodic Assessment:** The VM's `assessmentMode` must be set to `AutomaticByPlatform` to ensure continuous compliance scanning.