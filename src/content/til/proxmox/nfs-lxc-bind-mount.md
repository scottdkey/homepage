---
title: NFS in Proxmox LXCs via host bind mounts
pubDate: 2025-01-01
tags: [proxmox, lxc, nfs]
---

LXC containers can't reliably mount NFS directly — kernel namespace restrictions cause "Operation Not Permitted" errors for unprivileged containers and intermittent failures even in privileged ones.

The correct pattern: **mount NFS on the Proxmox host, then bind-mount the path into the container**.

## Host fstab

```
192.168.1.10:/volume1/data  /mnt/nas  nfs  _netdev,nofail  0 0
```

## LXC config (`/etc/pve/lxc/<id>.conf`)

```
mp0: /mnt/nas/appdata/myservice,mp=/mnt/appdata
```

This bind-mounts the host's `/mnt/nas/appdata/myservice` into the container at `/mnt/appdata`.

## UID mapping for unprivileged containers

Unprivileged LXCs map container UIDs to high host UIDs (starting at 100000). If a service inside the container runs as UID 1000, it actually runs as UID 101000 on the host.

The bind-mounted NFS path must be owned by the host UID:

```sh
chown 100000:100000 /mnt/nas/appdata/myservice
```

Failure to do this results in permission denied errors inside the container even though the host can read the path fine.

## Cluster requirement

All Proxmox cluster nodes that might host the LXC must have identical NFS mount paths. If you live-migrate or restore an LXC to a different node and that node doesn't have the same NFS mount, the container won't start.
