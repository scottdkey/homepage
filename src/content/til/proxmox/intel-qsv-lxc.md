---
title: Intel QSV hardware transcoding in a Proxmox LXC
pubDate: 2025-01-01
tags: [proxmox, lxc, jellyfin, intel]
---

Getting hardware transcoding working for Jellyfin (or Plex) in a Debian LXC requires a few specific steps.

## LXC config

Add device passthrough in `/etc/pve/lxc/<id>.conf`:

```
dev0: /dev/dri/card0,gid=44
dev1: /dev/dri/renderD128,gid=44
```

`gid=44` is the `render` group. The service user inside the container must also be in this group:

```sh
usermod -aG render jellyfin
```

## Driver

For 12th gen Intel (Alder Lake) and newer, the required driver is `intel-media-va-driver-non-free` (iHD), not the older `i965` driver:

```sh
apt install intel-media-va-driver-non-free
```

## Verify with vainfo

```sh
LIBVA_DRIVER_NAME=iHD vainfo
```

If this returns a list of supported profiles, QSV is working. If it returns `libva error: /usr/lib/x86_64-linux-gnu/dri/iHD_drv_video.so init failed`, the driver isn't installed or the device isn't accessible.

## SQLite WAL cleanup

After a Jellyfin crash, the database may be left in WAL (write-ahead log) mode with `.wal` and `.shm` files. If Jellyfin refuses to start after a crash, delete `jellyfin.db-wal` and `jellyfin.db-shm` alongside `jellyfin.db`. The data loss is minimal — usually just playback position for in-progress items.
