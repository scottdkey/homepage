---
title: Volume mount UID/GID permission mismatches
pubDate: 2026-04-18
tags: [docker, volumes, linux]
---

When a container writes to a bind mount, it writes as the UID inside the container. If that UID doesn't match the owner of the host directory, you get permission denied errors — or worse, files owned by root on the host.

## The problem

A container running as `UID 1000` writes to `/data`. On the host, `/data` is owned by your user (also UID 1000) — no problem. But many service images run as a custom UID (e.g., `UID 999` for postgres, `UID 568` for some linuxserver.io images). The container writes fine, but the host sees files owned by an unknown UID.

## linuxserver.io PUID/PGID

Most linuxserver images accept `PUID` and `PGID` environment variables that remap the internal service user to a UID/GID you control:

```yaml
environment:
  - PUID=1000
  - PGID=1000
```

Set these to match your host user (`id -u` / `id -g`).

## Fixing ownership manually

```sh
# Find your UID
id -u   # e.g. 1000

# Fix existing files
sudo chown -R 1000:1000 /path/to/volume

# Or fix from inside the container
docker run --rm -v /path/to/volume:/data alpine chown -R 1000:1000 /data
```

## Named volumes

Named volumes (managed by Docker) don't have this problem when accessed only from containers — Docker manages the path. It surfaces when you try to access a named volume from the host directly (`/var/lib/docker/volumes/...`), which you generally shouldn't do.

## The USER directive

If you control the Dockerfile, set the runtime user explicitly:

```dockerfile
RUN addgroup -S app && adduser -S app -G app
USER app
```

This prevents the container from running as root and makes volume ownership predictable.
