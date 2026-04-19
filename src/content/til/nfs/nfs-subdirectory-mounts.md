---
title: NFS subdirectory mounts cause stale file handle errors
pubDate: 2025-01-01
tags: [nfs, nas, linux]
---

If you mount a subdirectory of an NFS export rather than the root of the share, you'll get **stale file handle** errors when the NFS server restarts or the share is unmounted and remounted on the server side.

**Don't do this:**
```
192.168.1.10:/volume1/data/appdata  /mnt/appdata  nfs  defaults  0 0
```

**Do this instead — mount the root share and use a subdirectory locally:**
```
192.168.1.10:/volume1/data  /mnt/nas  nfs  defaults  0 0
```

Then symlink or use `/mnt/nas/appdata` directly. The stale handle errors occur because the server's file handle for a subdirectory becomes invalid when the parent export changes state, even if the subdirectory itself is untouched.

## fstab options that matter

- `_netdev`: tells the OS this mount requires the network. Without it, the system tries to mount during early boot before networking is up and hangs.
- `nofail`: allows the system to boot even if the mount fails. Essential for anything you don't want causing a boot hang.
- `x-systemd.automount`: lazy mount — only actually mounts when something accesses the path. Useful for rarely-used shares.

## NFS failover with autofs

Autofs supports replicated server syntax for automatic failover between two NFS servers:

```
/mnt/nas  -fstype=nfs,soft,timeo=5  server1:/share  server2:/share
```

Autofs tries the first server and falls back to the second if it doesn't respond within `timeo`. Failover takes 5–30 seconds — fast enough for most homelab use cases without the complexity of a floating VIP.
