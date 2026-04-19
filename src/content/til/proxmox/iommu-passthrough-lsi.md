---
title: LSI HBA passthrough requires iommu=pt
pubDate: 2025-01-01
tags: [proxmox, pcie-passthrough, iommu]
---

When passing through an LSI SAS2008 HBA to a VM, the `mpt3sas` driver inside the VM fails with doorbell timeout errors unless the host kernel is booted with `iommu=pt` (passthrough mode).

Add to `/etc/kernel/cmdline` (or `/etc/default/grub` on older setups):

```
intel_iommu=on iommu=pt
```

Without `iommu=pt`, the IOMMU remaps DMA transactions in a way that confuses the SAS controller's firmware. The `rombar=0` option that's sometimes suggested for problematic cards does not fix this — it only suppresses ROM reads at init.

## Why passthrough mode

`iommu=pt` bypasses translation for devices that don't need it (most of the host), only enforcing strict translation for passthrough devices. This improves performance and avoids DMA faults that strict mode can trigger on older hardware with 36-bit addressing limits.

After changing kernel cmdline on Proxmox, regenerate and reboot:

```sh
proxmox-boot-tool refresh
reboot
```
