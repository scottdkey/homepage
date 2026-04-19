---
title: Compose healthchecks and dependency ordering
pubDate: 2026-04-18
tags: [docker, compose]
---

`depends_on` by itself only controls start order — it does not wait for a service to be ready. A database container that started 200ms ago is not ready to accept connections.

## Correct pattern

Define a `healthcheck` on the dependency, then use `condition: service_healthy` in the dependent service:

```yaml
services:
  db:
    image: postgres:16-alpine
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $POSTGRES_USER -d $POSTGRES_DB"]
      interval: 5s
      timeout: 5s
      retries: 10
      start_period: 10s

  api:
    build: .
    depends_on:
      db:
        condition: service_healthy
```

`start_period` gives the container time to boot before failures count against `retries`. Without it, slow-starting containers fail health checks immediately.

## Other conditions

| condition | means |
|---|---|
| `service_started` | default — container exists, not necessarily healthy |
| `service_healthy` | healthcheck passing |
| `service_completed_successfully` | for one-shot init containers (migrations, seed scripts) |

## Useful healthchecks by service

**Redis**: `redis-cli ping`

**MySQL/MariaDB**: `mysqladmin ping -h localhost -u root -p$$MYSQL_ROOT_PASSWORD`

**HTTP service**: `curl -f http://localhost:8080/health || exit 1`

**Generic TCP**: `nc -z localhost 5432`
