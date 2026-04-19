---
title: PCIe passthrough VFIO prep
pubDate: 2026-04-18
tags: [proxmox, pcie-passthrough, vfio]
---

PCIe passthrough lets a VM own a physical device (GPU, HBA, NIC) directly. The setup is at the host level before any VM config.

## Enable IOMMU

Edit `/etc/default/grub` and add the appropriate kernel parameter:

```
# Intel
GRUB_CMDLINE_LINUX_DEFAULT="quiet intel_iommu=on iommu=pt"
```

```
# AMD
GRUB_CMDLINE_LINUX_DEFAULT="quiet amd_iommu=on iommu=pt"
```

`iommu=pt` (passthrough mode) is required for stability on most hardware — see the [LSI passthrough entry](/til/proxmox/iommu-passthrough-lsi) for why.

```sh
update-grub
```

```sh
reboot
```

Verify after reboot:

```sh
dmesg | grep -e IOMMU -e iommu
```

## Load VFIO modules

Add to `/etc/modules`:

```
vfio
vfio_iommu_type1
vfio_pci
vfio_virqfd
```

```sh
update-initramfs -u -k all
```

## Find the device and its IOMMU group

List IOMMU groups:

```sh
find /sys/kernel/iommu_groups -type l | sort -V
```

Find PCI IDs for your device (GPU example):

```sh
lspci -nn | grep -i nvidia
```

All devices in the same IOMMU group must be passed through together. If a GPU shares a group with an unrelated device, you may need the ACS override kernel patch — but that's a security tradeoff.

## Bind the device to VFIO

Add to `/etc/modprobe.d/vfio.conf` using the IDs from `lspci -nn`:

```
options vfio-pci ids=10de:2204,10de:1aef
```

Blacklist the host driver in `/etc/modprobe.d/blacklist.conf`:

```
blacklist nouveau
blacklist nvidia
```

```sh
update-initramfs -u -k all
```

```sh
reboot
```

## Assign to a VM

In the Proxmox UI: VM → Hardware → Add → PCI Device. Select the device. Enable **ROM-Bar** and **PCI-Express** for GPUs.

## Verify inside the VM

```sh
lspci
```

```sh
nvidia-smi
```
