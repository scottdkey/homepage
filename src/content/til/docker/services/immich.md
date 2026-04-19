---
title: Immich with Docker Compose
pubDate: 2026-04-18
tags: [docker, services, immich, photos]
---

Immich is a self-hosted photo and video backup app — a Google Photos replacement. It uses multiple containers and requires a compose file pulled from the official repo rather than written from scratch.

## Setup

```sh
mkdir immich && cd immich
wget https://github.com/immich-app/immich/releases/latest/download/docker-compose.yml
wget https://github.com/immich-app/immich/releases/latest/download/example.env -O .env
```

Edit `.env`:

```sh
# Required: path where photos are stored on the host
UPLOAD_LOCATION=/mnt/nas/photos/immich

# Optional: separate path for external library (existing photo collection)
EXTERNAL_PATH=/mnt/nas/photos/library

# DB password — change before first start
DB_PASSWORD=changeme
```

```sh
docker compose up -d
```

Access at `http://<host>:2283`. First user to register becomes admin.

## Containers

| Service | Role |
|---|---|
| `immich-server` | Main API and web UI |
| `immich-machine-learning` | Face recognition, CLIP search |
| `postgres` | Database |
| `redis` | Job queue |

## External library

Immich can index an existing photo directory without moving files. In the web UI: **Administration → External Libraries → Add**. Point it at the path you set in `EXTERNAL_PATH`.

## Backups

Back up the Postgres database, not just the upload directory:

```sh
docker exec immich_postgres pg_dumpall -U postgres > immich-db-$(date +%Y%m%d).sql
```

The upload directory (`UPLOAD_LOCATION`) should also be in your backup rotation.

## Updates

```sh
docker compose pull
docker compose up -d
```

Immich releases frequently. Check the [release notes](https://github.com/immich-app/immich/releases) before upgrading — breaking changes are documented.
