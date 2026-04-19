---
title: Installing Docker on Alpine Linux
pubDate: 2026-03-14
tags: [docker, alpine, linux]
description: Install Docker on Alpine Linux using apk and OpenRC. Minimal footprint, fast boot, ideal for dedicated container hosts.
---

Alpine is an excellent lightweight Docker host: ~50 MB base install, ~30 MB RAM at idle, boots in seconds. The trade-off is OpenRC instead of systemd and `ash` instead of bash. See [Alpine Docker gotchas](/til/docker/host-setup/alpine-docker-gotchas) for the sharp edges.

## Install

Docker packages live in the `community` repository, which is disabled by default.

```bash
# Enable community repo
sed -i 's|#http://dl-cdn.alpinelinux.org/alpine/v[0-9.]*/community|http://dl-cdn.alpinelinux.org/alpine/v3.21/community|' \
  /etc/apk/repositories

apk update && apk upgrade

# docker-openrc is a PACKAGE (not a command) that provides OpenRC service scripts
apk add docker docker-cli-compose docker-openrc

rc-update add docker default
service docker start
```

## Post-install

```bash
# Add user to docker group — no newgrp on Alpine, must log out fully
addgroup $USER docker
exit   # log back in for the change to apply

# Verify
docker --version
docker compose version
docker run --rm hello-world
```

## Daemon configuration

```bash
cat > /etc/docker/daemon.json << 'EOF'
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2"
}
EOF

service docker restart
```

## Service management (OpenRC)

Alpine uses OpenRC, not systemd. The equivalents:

| systemd                    | OpenRC                         |
| -------------------------- | ------------------------------ |
| `systemctl start docker`   | `service docker start`         |
| `systemctl stop docker`    | `service docker stop`          |
| `systemctl restart docker` | `service docker restart`       |
| `systemctl status docker`  | `service docker status`        |
| `systemctl enable docker`  | `rc-update add docker default` |
| `systemctl disable docker` | `rc-update del docker default` |
| `systemctl list-units`     | `rc-update show`               |

## IP forwarding (required for overlay networks)

```bash
echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf
sysctl -p
rc-update add sysctl
```

## NFS shared storage

```bash
apk add nfs-utils
rc-update add rpcbind
rc-update add nfsmount
service rpcbind start

mkdir -p /mnt/nfs/media /mnt/nfs/data

# /etc/fstab — replace <NAS_IP> and share paths with your values
# <NAS_IP>:/exports/media  /mnt/nfs/media  nfs  defaults,_netdev,nofail  0  0
mount -a
```

## Troubleshooting

```bash
# Docker won't start
cat /var/log/docker.log
dockerd --debug   # verbose output

# cgroup issues
apk add cgroup-tools
rc-update add cgroups
service cgroups start

# DNS broken in containers
cat > /etc/docker/daemon.json << 'EOF'
{"dns": ["1.1.1.1", "8.8.8.8"]}
EOF
service docker restart

# Overlay network issues — load kernel modules on the host
modprobe ip_vs ip_vs_rr ip_vs_wrr ip_vs_sh
```

## Alpine vs Debian at a glance

| Metric          | Alpine | Debian 12 |
| --------------- | ------ | --------- |
| Base install    | ~50 MB | ~1 GB     |
| RAM at idle     | ~30 MB | ~150 MB   |
| Boot time       | ~3 sec | ~15 sec   |
| Package manager | apk    | apt       |
| Init system     | OpenRC | systemd   |
| C library       | musl   | glibc     |

**Use Alpine when** resource usage matters most or you're running a simple, dedicated container host.

**Use Debian when** you need glibc compatibility, systemd features, or prefer the apt ecosystem.

## See also

- [Alpine Docker gotchas](/til/docker/host-setup/alpine-docker-gotchas) — diskless mode, ash shell, group changes
- [Docker in a Proxmox LXC](/til/docker/host-setup/docker-in-proxmox-lxc) — run Docker inside an LXC container
- [Docker on Debian/Ubuntu](/til/docker/host-setup/setup-debian) — Debian install path
