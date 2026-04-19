---
title: Alpine Linux VM
pubDate: 2026-04-18
tags: [proxmox, alpine, vm]
---

Alpine VMs are useful for lightweight workloads where you want full VM isolation but minimal overhead. Alpine idles at ~30MB RAM.

## Option 1: cloud-init (preferred)

Use the Alpine cloud image with the [cloud-init template approach](/til/proxmox/cloud-init-templates). Download the official Alpine cloud image:

```sh
wget https://dl-cdn.alpinelinux.org/alpine/v3.19/releases/cloud/nocloud_alpine-3.19.0-x86_64-bios-cloudinit-r0.qcow2
```

Import and template exactly as you would a Debian cloud image.

## Option 2: ISO install

Download the Alpine "virtual" ISO (stripped for VMs) from alpinelinux.org. Create a VM with VirtIO SCSI disk and VirtIO network. Boot, log in as root (no password), and run the setup script:

```sh
setup-alpine
```

After reboot, remove the ISO from the VM's CD-ROM drive in the Proxmox UI.

## QEMU guest agent

Alpine uses OpenRC, not systemd:

```sh
apk add qemu-guest-agent
```

```sh
rc-update add qemu-guest-agent default
```

```sh
service qemu-guest-agent start
```

Without the guest agent, Proxmox can't report the VM's IP or issue clean shutdowns.

## Key Alpine differences from Debian

- Package manager: `apk add <package>`
- Init system: OpenRC (`rc-update add <svc> default` / `service <svc> start`)
- No `sudo` by default — install `doas` or `sudo`: `apk add doas`
- Shell: `ash` not bash — install bash if your scripts need it: `apk add bash`
