---
title: Portainer with Docker Compose
pubDate: 2026-04-18
tags: [docker, services, portainer]
---

Portainer is a web UI for managing Docker environments. Useful for browsing containers, logs, volumes, and networks without reaching for the CLI each time.

## Compose

```yaml
services:
  portainer:
    image: portainer/portainer-ce:latest
    container_name: portainer
    restart: unless-stopped
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./data:/data
    ports:
      - "9000:9000"
      - "9443:9443"
```

Access at `http://<host>:9000` or `https://<host>:9443`. Create an admin account on first visit — you have a short window before it locks you out and you need to restart the container.

## Docker socket security

Mounting `/var/run/docker.sock` gives the container (and anyone with Portainer access) full control over the Docker host. Treat Portainer access as root-equivalent. Keep it on an internal VLAN, behind auth, and not exposed to the internet.

## Managing remote hosts

Portainer can manage Docker on other hosts via the Portainer Agent:

```yaml
# On the remote host
services:
  portainer-agent:
    image: portainer/agent:latest
    restart: unless-stopped
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /var/lib/docker/volumes:/var/lib/docker/volumes
    ports:
      - "9001:9001"
```

In Portainer: **Environments → Add Environment → Agent**. Enter the remote host IP and port 9001.

## Stacks

Portainer "Stacks" are compose files managed through the UI — paste a compose file, set env vars, deploy. Useful for services you want to manage without SSH access.

## CE vs Business Edition

The Community Edition (CE) is free and covers all homelab needs. Business Edition adds SSO, RBAC, and support — not needed for personal use.
