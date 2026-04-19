---
title: Running Docker inside a Proxmox LXC
pubDate: 2026-03-14
tags: [docker, proxmox, lxc]
description: Step-by-step guide to running Docker inside a privileged Proxmox LXC container, including NFS storage options and security trade-offs.
---

Running Docker in an LXC container is lighter than a full VM — an Alpine LXC idles at ~30 MB RAM vs ~150 MB for a Debian VM. The trade-off is that the container must be privileged, which reduces isolation.

**Best for:** Lightweight services, media automation (\*arr stack), downloaders, anything that doesn't need GPU access.

**Use a VM instead for:** GPU workloads (hardware transcoding, ML), USB device passthrough, or strict isolation requirements.

## Step 1: Create the LXC

### Via web UI

1. **Create CT**
2. General: hostname, password — **uncheck Unprivileged container** (must be privileged)
3. Template: Debian 12 or Ubuntu 22.04
4. Disk: 8–20 GB depending on workload
5. CPU: 2–4 cores; Memory: 2048–4096 MB, no swap
6. Network: static IP, your bridge (vmbr0)

### Via CLI

```bash
pveam update
pveam download local debian-12-standard_12.2-1_amd64.tar.zst

pct create 300 local:vztmpl/debian-12-standard_12.2-1_amd64.tar.zst \
  --hostname docker-worker \
  --cores 2 \
  --memory 2048 \
  --swap 0 \
  --rootfs local-lvm:10 \
  --net0 name=eth0,bridge=vmbr0,ip=192.168.1.30/24,gw=192.168.1.1 \
  --nameserver "192.168.1.1 1.1.1.1" \
  --unprivileged 0 \
  --features nesting=1,keyctl=1 \
  --onboot 1
```

## Step 2: Configure the LXC for Docker

Edit the container config on the **Proxmox host** (not inside the container):

```bash
nano /etc/pve/lxc/300.conf
```

Add these lines at the end:

```ini
lxc.apparmor.profile: unconfined
lxc.cgroup2.devices.allow: a
lxc.cap.drop:
lxc.mount.auto: proc:rw sys:rw
```

What each does:

- `apparmor.profile: unconfined` — disables AppArmor restrictions Docker needs
- `cgroup2.devices.allow: a` — allows access to all devices
- `cap.drop:` — empty value means "drop nothing" (Docker needs `NET_ADMIN`, `SYS_ADMIN`, etc.)
- `mount.auto: proc:rw sys:rw` — mounts `/proc` and `/sys` read-write for namespace operations

## Step 3: Install Docker inside the container

```bash
pct start 300
pct enter 300
```

Inside the container, follow the [Debian Docker install](/til/docker/host-setup/setup-debian):

```bash
apt-get update && apt-get upgrade -y
apt-get install -y curl gnupg ca-certificates apt-transport-https

install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg \
  -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
  https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io \
  docker-buildx-plugin docker-compose-plugin

systemctl enable docker
docker run --rm hello-world
```

## Step 4: NFS storage

### Option A — Mount NFS inside the container

```bash
apt-get install -y nfs-common
mkdir -p /mnt/nfs/media /mnt/nfs/data

# Add to /etc/fstab — replace <NAS_IP> and paths with your values
# <NAS_IP>:/exports/media  /mnt/nfs/media  nfs  defaults,_netdev,nofail  0  0
mount -a
```

### Option B — Bind mount from the Proxmox host (recommended)

Mount NFS on the host, then pass directories into the container. More reliable — NFS reconnects are handled at the host level and all containers benefit automatically.

On the **Proxmox host**:

```bash
mkdir -p /mnt/nfs/media /mnt/nfs/data
# Add NFS entries to host /etc/fstab, then:
mount -a
```

In `/etc/pve/lxc/300.conf`, add bind mount entries:

```ini
mp0: /mnt/nfs/media,mp=/mnt/nfs/media
mp1: /mnt/nfs/data,mp=/mnt/nfs/data
```

Restart the container to apply: `pct stop 300 && pct start 300`

## Docker Compose + NFS volumes

Once NFS is mounted, reference it directly in compose files:

```yaml
services:
  myapp:
    image: linuxserver/sonarr
    volumes:
      - /mnt/nfs/media/tv:/tv
      - /mnt/nfs/data/downloads:/downloads
      - myapp_config:/config

volumes:
  myapp_config:
    driver: local # keep config on local storage, not NFS
```

Keep application config in local Docker volumes. NFS is appropriate for media and downloads, not databases.

## Alpine LXC variant

For an even lighter host, use Alpine:

```bash
pveam download local alpine-3.21-default_20241217_amd64.tar.xz

pct create 301 local:vztmpl/alpine-3.21-default_20241217_amd64.tar.xz \
  --hostname docker-alpine \
  --cores 2 \
  --memory 1024 \
  --rootfs local-lvm:4 \
  --net0 name=eth0,bridge=vmbr0,ip=192.168.1.31/24,gw=192.168.1.1 \
  --unprivileged 0 \
  --features nesting=1,keyctl=1
```

Apply the same four `lxc.*` config lines, then install Docker per the [Alpine Docker install](/til/docker/host-setup/setup-alpine).

## Full example config

`/etc/pve/lxc/300.conf`:

```ini
arch: amd64
cores: 2
features: nesting=1,keyctl=1
hostname: docker-worker
memory: 2048
net0: name=eth0,bridge=vmbr0,gw=192.168.1.1,ip=192.168.1.30/24,type=veth
onboot: 1
ostype: debian
rootfs: local-lvm:vm-300-disk-0,size=10G
swap: 0
unprivileged: 0

lxc.apparmor.profile: unconfined
lxc.cgroup2.devices.allow: a
lxc.cap.drop:
lxc.mount.auto: proc:rw sys:rw

# optional NFS bind mounts from host
mp0: /mnt/nfs/media,mp=/mnt/nfs/media
mp1: /mnt/nfs/data,mp=/mnt/nfs/data
```

## Troubleshooting

```bash
# Docker won't start
journalctl -u docker -f
cat /proc/cgroups   # verify cgroup v2 is active
pct config 300 | grep features   # should show nesting=1,keyctl=1

# "Operation not permitted"
pct config 300 | grep unprivileged   # should show: unprivileged: 0
grep apparmor /etc/pve/lxc/300.conf  # confirm unconfined is set

# Network / overlay module issues — run on Proxmox host
modprobe overlay br_netfilter

# Container won't start after config change
journalctl -u pve-container@300
pct start 300 --debug
```

## Security considerations

A privileged LXC with these settings has reduced isolation:

- A container escape could access the Proxmox host
- Full device access via `cgroup2.devices.allow: a`
- No AppArmor restrictions

Mitigations: keep packages updated, use firewall rules, don't run untrusted images, prefer VMs for anything sensitive.

## LXC vs VM decision table

| Use case                            | Recommendation |
| ----------------------------------- | -------------- |
| Lightweight services, \*arr stack   | LXC            |
| GPU workloads (transcoding, ML)     | VM             |
| USB device passthrough              | VM             |
| High-security / untrusted workloads | VM             |
| Resource-constrained host           | LXC            |
| Quick testing                       | LXC            |

## See also

- [Docker on Debian/Ubuntu](/til/docker/host-setup/setup-debian) — standard Docker install for LXC containers
- [Docker on Alpine](/til/docker/host-setup/setup-alpine) — lighter LXC variant
- [Alpine Docker gotchas](/til/docker/host-setup/alpine-docker-gotchas) — diskless mode, OpenRC, ash differences
- [NFS bind mounts in LXC](/til/proxmox/lxcs/nfs-lxc-bind-mount) — advanced NFS configuration
