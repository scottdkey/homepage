---
title: Uptime Kuma with Docker Compose
pubDate: 2026-04-18
tags: [docker, services, monitoring]
---

Uptime Kuma is a self-hosted uptime monitor with a clean UI. It supports HTTP, TCP, DNS, ping, and more — with notifications via Slack, Discord, email, Telegram, and others.

## Compose

```yaml
services:
  uptime-kuma:
    image: louislam/uptime-kuma:latest
    container_name: uptime-kuma
    restart: unless-stopped
    volumes:
      - ./data:/app/data
    ports:
      - "3001:3001"
```

Access at `http://<host>:3001`. Create an admin account on first visit.

## What to monitor

Beyond external URLs, Uptime Kuma is useful for internal services:

- **HTTP**: your self-hosted apps, OPNsense web UI
- **TCP**: databases, SSH, any open port
- **Ping**: network devices, servers
- **DNS**: verify your DNS resolvers return expected records
- **Docker container**: if running on the same host, monitor containers by name

## Notifications

Set up a notification channel first (Settings → Notifications) before adding monitors so you don't miss the first alert. Telegram and Discord webhooks are the easiest to set up quickly.

## Status page

Kuma has a public status page feature (Settings → Status Pages) — useful for sharing service status with others without exposing the full admin UI.

## Backups

All data is in `./data`. Back up that directory. The SQLite database is at `./data/kuma.db`.
