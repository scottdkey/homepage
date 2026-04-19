---
title: Debian VM in Proxmox
pubDate: 2026-04-18
tags: [proxmox, debian, vm]
---

Debian is the default choice for general-purpose VMs in Proxmox. Use cloud-init images for repeatability; the ISO installer only when you need custom partitioning.

## Cloud-init (preferred)

```sh
wget https://cloud.debian.org/images/cloud/bookworm/latest/debian-12-genericcloud-amd64.qcow2
```

Follow the [cloud-init template guide](/til/proxmox/cloud-init-templates) to build a reusable template, then clone per-VM.

## Post-install essentials

Install the QEMU guest agent — required for Proxmox IP reporting and clean shutdown:

```sh
apt install -y qemu-guest-agent
```

```sh
systemctl enable --now qemu-guest-agent
```

Useful baseline packages:

```sh
apt install -y curl wget git htop vim
```

If using a cloud image and want man pages restored:

```sh
unminimize
```

## Resize the disk

Cloud images default to 2–8GB. Resize in Proxmox first (UI: VM → Hardware → Hard Disk → Resize, or CLI):

```sh
qm resize <vmid> scsi0 +20G
```

Then expand inside the VM. For a standard partition:

```sh
growpart /dev/sda 1
```

```sh
resize2fs /dev/sda1
```

For LVM:

```sh
lvextend -l +100%FREE /dev/debian-vg/root
```

```sh
resize2fs /dev/debian-vg/root
```
