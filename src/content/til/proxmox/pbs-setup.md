---
title: Proxmox Backup Server setup
pubDate: 2026-04-18
tags: [proxmox, backup, pbs]
---

PBS is a dedicated backup appliance that stores Proxmox VM and LXC backups with deduplication and incremental transfers. It runs as a separate Debian-based installation, not a package on the PVE node.

## Installation

Install PBS on a dedicated VM or physical machine from the [official ISO](https://www.proxmox.com/en/downloads). After install, access the web UI at `https://<ip>:8007`.

## Create a datastore

A datastore is a directory where backups are stored. It must be on a dedicated filesystem — don't share it with the OS.

In the PBS UI: **Administration → Datastore → Add Datastore**. Point it at your backup disk mount (e.g. `/mnt/backup`).

## Add PBS to PVE

In the Proxmox VE UI: **Datacenter → Storage → Add → Proxmox Backup Server**

- Server: PBS IP
- Username: `root@pam` (or a dedicated backup user)
- Password: PBS root password
- Datastore: name of the datastore you created
- Fingerprint: copy from PBS **Dashboard → Fingerprint**

## Configure backup jobs

**Datacenter → Backup → Add**

- Storage: select PBS
- Schedule: e.g. `daily` or `0 2 * * *`
- Mode: `snapshot` for running VMs, `stop` if you need consistency guarantees
- Select VMs/LXCs to include

## Prune and garbage collect

Backups accumulate. Set a prune schedule on the datastore to keep N daily/weekly/monthly snapshots. After pruning, run **GC (Garbage Collection)** to reclaim space — pruning just removes index entries, GC removes the actual chunks.

## Restore

From PVE UI, select a VM → Backup → Restore. Or from CLI:

```sh
qmrestore /path/to/backup.vma.zst <vmid>
proxmox-backup-client restore <snapshot> /path/to/output
```
