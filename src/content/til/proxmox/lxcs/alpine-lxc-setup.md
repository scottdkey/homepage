---
title: Alpine LXC
pubDate: 2026-04-18
tags: [proxmox, alpine, lxc]
---

Alpine LXCs are the lightest option in Proxmox — containers that idle under 10MB RAM. Use them for simple services where VM isolation isn't needed.

## Create from template

In Proxmox UI: **node → Create CT**. Download the Alpine template from the template list if not already cached (**local → CT Templates → Templates**).

Or from CLI:

```sh
pveam update
pveam download local alpine-3.19-default_20231219_amd64.tar.xz
pct create 200 local:vztmpl/alpine-3.19-default_20231219_amd64.tar.xz \
  --hostname alpine-ct \
  --memory 256 \
  --rootfs local-lvm:4 \
  --net0 name=eth0,bridge=vmbr0,ip=dhcp \
  --unprivileged 1 \
  --start 1
```

## OpenRC, not systemd

Alpine uses OpenRC. Common commands:

```sh
# Enable and start a service
rc-update add <service> default
service <service> start

# Check status
rc-status

# List all services
rc-service --list
```

## Package management

```sh
apk update
apk add <package>
apk del <package>
apk upgrade
```

## No bash by default

Scripts expecting bash will fail with `ash`. Install bash if needed:

```sh
apk add bash
```

## Persistence with LBU (diskless only)

Standard LXCs persist changes normally. If you're running Alpine in diskless mode (rare in LXC context), remember `lbu commit -d` after config changes.

## When to use Alpine vs Debian LXC

Use Alpine when: low memory, simple service, no complex init dependencies.
Use Debian when: the service has Debian-specific packages, needs systemd, or you want `apt` for familiarity.
