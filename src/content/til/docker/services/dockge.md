---
title: Dockge with Docker Compose
pubDate: 2026-03-30
tags: [docker, services, dockge, management]
description: Self-hosted Docker Compose stack manager with a clean web UI and multi-host agent support.
---

Dockge is a web UI for managing Docker Compose stacks. It watches a directory for `docker-compose.yml` files, lets you start/stop/edit stacks from the browser, and supports multi-host management — deploy one instance per Docker host, then add remote hosts as agents from the primary UI.

## Compose

```yaml
services:
  dockge:
    image: louislam/dockge:1
    container_name: dockge
    restart: unless-stopped
    ports:
      - '5001:5001'
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /opt/dockge/data:/app/data
      - /opt/stacks:/opt/stacks
    environment:
      - DOCKGE_STACKS_DIR=/opt/stacks
      - TZ=America/New_York
```

## Stacks directory

Dockge watches `DOCKGE_STACKS_DIR` for subdirectories containing `docker-compose.yml` files:

```
/opt/stacks/
  vaultwarden/
    docker-compose.yml
    .env
  uptime-kuma/
    docker-compose.yml
```

Each subdirectory is one stack. Dockge treats the directory name as the stack name.

The host path (`/opt/stacks`) and the container path (`DOCKGE_STACKS_DIR`) must match so Dockge can write compose files correctly.

## Multi-host setup

Every Dockge instance uses the same image — there's no separate agent binary. To manage multiple hosts:

1. Deploy Dockge on each Docker host using the compose above
2. On the primary instance: **Agents → Add Agent** → enter the URL and credentials of the remote instance
3. All hosts appear in the sidebar; switch between them without leaving the UI

## Volumes

| Path                   | Purpose                               |
| ---------------------- | ------------------------------------- |
| `/var/run/docker.sock` | Docker engine control — required      |
| `/app/data`            | Dockge's SQLite DB and internal state |
| `/opt/stacks`          | Your compose stack directories        |

If your stacks directory is elsewhere, update both the host bind mount and `DOCKGE_STACKS_DIR` to match.

## Symlinks to a git repo (optional)

If you manage compose files in a git repo, symlink stacks into `/opt/stacks` instead of storing them directly:

```bash
ln -s /opt/myrepo/compose/vaultwarden /opt/stacks/vaultwarden
```

Dockge must be able to resolve the symlink target inside the container, so mount the repo directory too:

```yaml
volumes:
  - /opt/myrepo:/opt/myrepo:ro
  - /opt/stacks:/opt/stacks
```

Dockge doesn't pull git changes — sync the repo externally (cron, webhook, Watchtower, etc.).

## Port

`5001` — web UI. Restrict firewall access; the Docker socket gives Dockge full control over the host's containers.

## See also

- [Portainer](/til/docker/services/portainer) — alternative with more features and an agent model
