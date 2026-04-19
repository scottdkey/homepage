---
title: Nginx Proxy Manager with Docker Compose
pubDate: 2026-03-14
tags: [docker, services, nginx, reverse-proxy, tls]
description: GUI-driven reverse proxy with automatic TLS via Let's Encrypt. Route external traffic to internal services with HTTPS using DNS-01 challenge for wildcard certs.
---

Nginx Proxy Manager (NPM) provides a web UI for managing Nginx proxy hosts and TLS certificates. It handles Let's Encrypt cert issuance and renewal automatically. No Nginx config files to edit.

## Compose

```yaml
services:
  npm:
    image: jc21/nginx-proxy-manager:latest
    container_name: nginx-proxy-manager
    restart: unless-stopped
    ports:
      - '80:80' # HTTP (redirect to HTTPS)
      - '443:443' # HTTPS
      - '81:81' # Admin UI
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
    environment:
      - TZ=America/New_York
```

## First run

Access the admin UI at `http://<HOST>:81`.

Default credentials: `admin@example.com` / `changeme` — change these immediately.

## Adding a proxy host

1. **Proxy Hosts → Add Proxy Host**
2. Domain: `service.yourdomain.com`
3. Scheme: `http`, Forward Hostname: `<internal-ip-or-container-name>`, Port: `<service-port>`
4. **SSL tab** → Request a new SSL Certificate (or select existing), enable Force SSL and HTTP/2

## TLS certificates — HTTP-01 vs DNS-01

**HTTP-01** (default): Let's Encrypt sends a request to `yourdomain.com:80`. Works if port 80 is open from the internet. Issues per-hostname certs only — no wildcards.

**DNS-01** (recommended for homelabs): Let's Encrypt verifies ownership via a DNS TXT record. Advantages:

- Port 80/443 doesn't need to be open
- Supports wildcard certs (`*.yourdomain.com`) — one cert covers all subdomains
- Works for fully internal services with no internet exposure

## Wildcard cert via Cloudflare DNS-01

1. SSL Certificates → Add SSL Certificate → Let's Encrypt
2. Enable **Use DNS Challenge**
3. Provider: Cloudflare
4. Cloudflare API Token: create a token with `Zone:DNS:Edit` permission scoped to your zone
5. Domains: `*.yourdomain.com`, `yourdomain.com`
6. Agree to ToS → Save

The cert covers all subdomains. Assign it to proxy hosts in the SSL tab.

## Internal DNS requirement

For internal access to work, your local DNS resolver (AdGuard Home, Pi-hole, Unbound, etc.) needs a wildcard record:

```
*.yourdomain.com → <NPM-IP>
```

External DNS points at your WAN IP (if exposing services) or nothing (if fully internal).

## Volumes

| Path               | Contents                                             |
| ------------------ | ---------------------------------------------------- |
| `/data`            | SQLite DB, proxy configs, access lists, issued certs |
| `/etc/letsencrypt` | Let's Encrypt account keys                           |

Back up both volumes — losing `/data` means reconfiguring all proxy hosts.

## Ports

| Port  | Purpose                                     |
| ----- | ------------------------------------------- |
| `80`  | HTTP — redirects to HTTPS                   |
| `443` | HTTPS — proxied traffic                     |
| `81`  | Admin UI — restrict firewall access to this |

Don't expose port `81` to the internet.

## See also

- [Vaultwarden](/til/docker/services/vaultwarden) — example service behind NPM (requires HTTPS)
- [Home Assistant](/til/docker/services/home-assistant) — common service to expose via NPM
- [AdGuard Home](/til/docker/services/adguard-home) — local DNS resolver for wildcard records
