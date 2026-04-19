---
title: Cloud-init VM templates
pubDate: 2026-04-18
tags: [proxmox, cloud-init, vm]
---

Cloud-init templates let you clone a pre-configured VM in seconds instead of stepping through an OS installer every time.

## Build the template once

Download a cloud image (Debian example):

```sh
wget https://cloud.debian.org/images/cloud/bookworm/latest/debian-12-genericcloud-amd64.qcow2
```

Create a VM (9000 is a conventional ID for templates):

```sh
qm create 9000 --name debian-12-template --memory 2048 --cores 2 --net0 virtio,bridge=vmbr0
```

Import the disk into local-lvm storage:

```sh
qm importdisk 9000 debian-12-genericcloud-amd64.qcow2 local-lvm
```

Attach the imported disk:

```sh
qm set 9000 --scsihw virtio-scsi-pci --scsi0 local-lvm:vm-9000-disk-0
```

Add the cloud-init drive:

```sh
qm set 9000 --ide2 local-lvm:cloudinit
```

Set boot order and enable QEMU guest agent:

```sh
qm set 9000 --boot c --bootdisk scsi0 --agent enabled=1
```

Set cloud-init defaults (these can be overridden per-clone):

```sh
qm set 9000 --ciuser your-username --sshkeys ~/.ssh/id_ed25519.pub --ipconfig0 ip=dhcp
```

Convert to template — **this is irreversible**:

```sh
qm template 9000
```

## Clone and use

```sh
qm clone 9000 101 --name my-new-vm --full
```

```sh
qm resize 101 scsi0 +20G
```

```sh
qm start 101
```

The VM boots with your SSH key already authorized.

## Per-clone overrides

In the Proxmox UI, each clone has a Cloud-Init tab where you can set a static IP, different user, or additional SSH keys before first boot.

## Keep the template updated

Templates don't update themselves. Periodically download a fresh cloud image and rebuild the template, or maintain a post-clone ansible playbook that runs `apt upgrade` on first boot.
