---
title: Container DNS resolution between services
pubDate: 2026-04-18
tags: [docker, networking, compose]
---

Containers on the same Docker network can reach each other by service name. This only works on user-defined networks — not the default `bridge` network.

## The default bridge problem

Docker's default `bridge` network (`docker0`) does not have automatic DNS. Containers on it can only reach each other by IP, which is dynamic. This is why `docker run` without a `--network` flag leads to connection failures when referencing other containers by name.

## Compose creates a network automatically

Any `compose.yaml` file creates a default network named `<project>_default`. All services in the file join it, so service name DNS resolution works out of the box:

```yaml
services:
  api:
    environment:
      DB_HOST: db # resolves to the db container's IP
  db:
    image: postgres:16
```

## Cross-compose communication

Services in different compose files don't share a network by default. Create an external network:

```sh
docker network create shared
```

```yaml
# compose.yaml for project A
networks:
  shared:
    external: true

services:
  api:
    networks: [default, shared]
```

```yaml
# compose.yaml for project B
networks:
  shared:
    external: true

services:
  db:
    networks: [shared]
```

Project B's `db` is now reachable from project A's `api` as `db`.

## Adding host entries

For containers that need to resolve a hostname that doesn't exist in DNS, use `extra_hosts`:

```yaml
services:
  app:
    extra_hosts:
      - 'nas.local:192.168.10.50'
```

This writes to `/etc/hosts` inside the container.
