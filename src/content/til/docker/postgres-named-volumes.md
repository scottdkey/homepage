---
title: Backing up Postgres in Docker named volumes
pubDate: 2025-01-01
tags: [docker, postgres, backup]
---

When a Postgres container uses a named volume instead of a bind mount, you can't just `tar` the volume path and call it a backup. The data directory isn't safe to copy while Postgres is running.

The correct approach is `pg_dumpall`:

```sh
docker exec <postgres-container> pg_dumpall -U postgres > backup.sql
```

This dumps all databases and roles in plain SQL. Restore with:

```sh
docker exec -i <postgres-container> psql -U postgres < backup.sql
```

## Why not snapshot the volume?

A filesystem snapshot of a running Postgres data directory can capture an inconsistent state — mid-write pages, un-flushed WAL. `pg_dumpall` always produces a consistent logical dump regardless of what the database is doing.

## Timing note for immich

For Immich specifically: the database password must match across the `server` and `postgres` containers **at first init**. If the volume already exists with a different password, Postgres won't accept new credentials — you have to wipe the volume and reinitialize. Back up with `pg_dumpall` before touching any credentials.
