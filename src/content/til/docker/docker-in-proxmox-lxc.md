---
title: Running Docker inside a Proxmox LXC
pubDate: 2025-01-01
tags: [docker, proxmox, lxc]
---

Running Docker in an LXC container is lighter than a full VM, but requires specific container flags to work correctly.

The LXC must be **privileged** and the following options set in its config (`/etc/pve/lxc/<id>.conf`):

```
lxc.apparmor.profile: unconfined
lxc.cgroup2.devices.allow: a
lxc.cap.drop:
lxc.mount.auto: proc:rw sys:rw
```

`lxc.cap.drop:` with an empty value means "drop nothing" — Docker needs capabilities like `NET_ADMIN` and `SYS_ADMIN` that are stripped by default.

`lxc.mount.auto: proc:rw sys:rw` mounts `/proc` and `/sys` read-write, which Docker requires for namespace operations.

## When to use LXC vs VM for Docker

- **LXC**: lightweight stateless services, no GPU, no USB passthrough needed
- **VM**: anything requiring GPU access (hardware transcoding, ML), USB device passthrough, or strict isolation

An LXC Docker host idles at ~30MB RAM (Alpine) vs ~150MB (Debian). For a homelab running 10–15 containers, that gap matters.
