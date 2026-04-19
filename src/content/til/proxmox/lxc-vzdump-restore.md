---
title: Proxmox LXC backup and restore with vzdump
pubDate: 2025-01-01
tags: [proxmox, lxc, backup]
---

`vzdump` backs up both LXCs and VMs. Key mode decision:

- **snapshot**: non-disruptive, uses filesystem snapshot or QEMU snapshot. May miss in-flight writes.
- **stop**: cleanest backup, briefly stops the container. Required for containers that can't be snapshot-consistent (databases writing outside of volumes).
- **suspend**: pauses the container, takes snapshot, resumes. Middle ground — not widely used.

## Restore an LXC

```sh
pct restore <new-vmid> /path/to/backup.tar.zst --storage local-lvm
```

## Restore a VM

```sh
qmrestore /path/to/backup.vma.zst <new-vmid> --storage local-lvm
```

## What not to vzdump

Plex Media Server should never be backed up via vzdump if it contains a large media library. Plex generates `.bif` thumbnail files that can easily be 50–100GB, making backups enormous and slow. Backup the Plex database and config only — exclude the media directory.

## Recovery philosophy

For homelab resilience, the most practical pattern is: small root disk on fast local storage + appdata on NAS via bind mount. Rebuilding the container from scratch takes minutes; the data on NAS is unaffected. Only the config needs backing up.
