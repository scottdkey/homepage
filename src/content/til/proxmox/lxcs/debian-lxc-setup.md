---
title: Debian LXC
pubDate: 2026-04-18
tags: [proxmox, debian, lxc]
---

Debian LXCs are the default choice for containerized services in Proxmox — familiar tooling, systemd, and wide package availability.

## Create from CLI

```sh
pveam update
pveam download local debian-12-standard_12.7-1_amd64.tar.zst

pct create 201 local:vztmpl/debian-12-standard_12.7-1_amd64.tar.zst \
  --hostname debian-ct \
  --memory 512 \
  --rootfs local-lvm:8 \
  --net0 name=eth0,bridge=vmbr0,ip=dhcp,gw=192.168.1.1 \
  --nameserver 192.168.1.1 \
  --unprivileged 1 \
  --start 1
```

## Privileged vs unprivileged

**Unprivileged** (recommended): UIDs inside the container are remapped to high UIDs on the host. A root escape inside the container gets a nobody UID on the host.

**Privileged**: UID 0 inside = UID 0 on the host. Required for some workloads (NFS mounts, nested Docker) but increases attack surface.

Switch in `/etc/pve/lxc/<id>.conf`:

```
unprivileged: 1
```

## Post-create

```sh
pct enter 201

apt update && apt upgrade -y
apt install -y curl wget git htop

# Set a root password for console access
passwd
```

## Systemd in LXC

Systemd works in Debian LXCs but some units are masked by default (those requiring hardware access). Check with:

```sh
systemctl --failed
```

Networking, timers, and most service units work normally.

## Mount points

To mount host paths into an LXC, add to `/etc/pve/lxc/<id>.conf`:

```
mp0: /mnt/nas,mp=/mnt/nas
```

Unprivileged containers require UID mapping to be correct for the mounted path — see the [NFS bind mount entry](/til/proxmox/lxcs/nfs-lxc-bind-mount).
