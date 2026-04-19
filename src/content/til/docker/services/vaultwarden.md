---
title: Vaultwarden with Docker Compose
pubDate: 2026-04-18
tags: [docker, services, vaultwarden, security]
---

Vaultwarden is an unofficial Bitwarden-compatible server. All Bitwarden clients (mobile, browser extension, desktop) work against it. Much lighter than the official Bitwarden server.

## Compose

```yaml
services:
  vaultwarden:
    image: vaultwarden/server:latest
    container_name: vaultwarden
    restart: unless-stopped
    volumes:
      - ./data:/data
    environment:
      DOMAIN: "https://vault.yourdomain.com"
      SIGNUPS_ALLOWED: "false"      # disable after creating your account
      ADMIN_TOKEN: ""               # set to enable /admin panel
    ports:
      - "3011:80"
```

Vaultwarden serves plain HTTP — put a reverse proxy (Caddy, Nginx) in front for TLS. Bitwarden clients require HTTPS.

## First run

1. Start with `SIGNUPS_ALLOWED: "true"` and no `ADMIN_TOKEN`
2. Create your account via the web vault
3. Set `SIGNUPS_ALLOWED: "false"` and restart
4. Set `ADMIN_TOKEN` to a strong random string if you want the admin panel

Generate a token:
```sh
openssl rand -base64 48
```

## Caddy reverse proxy

```
vault.yourdomain.com {
    reverse_proxy vaultwarden:80
}
```

## Backups

The entire state is in `./data`. Back up that directory. For zero-downtime backup:

```sh
docker exec vaultwarden sqlite3 /data/db.sqlite3 ".backup /data/db-backup.sqlite3"
cp ./data/db-backup.sqlite3 /your/backup/destination/
```

## Mobile apps

Use the official Bitwarden iOS/Android apps. In **Settings → Account → Self-hosted environment**, set the server URL to your Vaultwarden domain.
