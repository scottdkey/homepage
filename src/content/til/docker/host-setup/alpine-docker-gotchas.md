---
title: Alpine Linux Docker host gotchas
pubDate: 2025-01-01
tags: [docker, alpine]
---

Alpine is an excellent lightweight Docker host but has a few differences from Debian-based systems worth knowing upfront.

**Package name**: the Docker service package is `docker-openrc`, not `docker.io` or `docker-ce`.

```sh
apk add docker-openrc
```

```sh
rc-update add docker default
```

```sh
service docker start
```

**Shell**: Alpine uses `ash`, not bash. Scripts that rely on bash-specific syntax (`[[`, arrays, `$RANDOM`, etc.) will fail silently or with confusing errors.

**Group changes**: Alpine has no `newgrp` by default. After adding a user to the `docker` group you must fully log out and back in — there is no shortcut.

**Resource profile**: Alpine idles at ~30MB RAM vs ~150MB for Debian. For a host running many containers, this is meaningful overhead savings.

## Service persistence on diskless Alpine

If using Alpine in diskless mode (common for Proxmox VMs booting from a small flash), changes to `/etc` don't persist across reboots. Commit changes with:

```sh
lbu commit -d
```

This syncs `/etc` to the boot media. Forgetting this after adding packages or editing configs leads to confusing "it worked yesterday" situations.
