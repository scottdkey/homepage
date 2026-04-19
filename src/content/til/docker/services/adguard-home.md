---
title: AdGuard Home with Docker Compose
pubDate: 2026-04-18
tags: [docker, services, dns, adblocking]
---

AdGuard Home is a self-hosted DNS server with ad and tracker blocking. It integrates well with OPNsense — run it as a container and point OPNsense's Unbound upstream to it.

## Compose

```yaml
services:
  adguardhome:
    image: adguard/adguardhome:latest
    container_name: adguardhome
    restart: unless-stopped
    volumes:
      - ./workdir:/opt/adguardhome/work
      - ./confdir:/opt/adguardhome/conf
    ports:
      - '53:53/tcp'
      - '53:53/udp'
      - '3000:3000/tcp' # setup UI (first run only)
      - '80:80/tcp' # web UI after setup
```

Port 53 must be free on the host. If `systemd-resolved` is running and binding to 53, disable it:

```sh
systemctl disable --now systemd-resolved
# Set a fallback DNS so the host still resolves
echo "nameserver 1.1.1.1" | tee /etc/resolv.conf
```

## First run

Access `http://<host>:3000` for setup. After setup, the UI moves to port 80 (or whatever you configure).

## Integration with OPNsense Unbound

In OPNsense: **Services → Unbound DNS → General → Use Custom Forwarding**. Add AdGuard's IP as the forwarder. Now Unbound forwards to AdGuard, which blocks ads and forwards clean queries to its upstream (Cloudflare, quad9, etc.).

See the [Unbound DNS gotchas entry](/til/networking/opnsense-dns-gotchas) — specifically the note about not adding Cloudflare as a second forwarder alongside a local service.

## Blocklists

In **Filters → DNS blocklists**, the defaults are good. Commonly added extras:

- OISD (full or basic)
- HaGeZi Multi Pro

Don't add too many lists — duplicates waste memory and slow resolution.

## Wildcard rewrites

AdGuard handles wildcard DNS rewrites that Unbound can't: **Filters → DNS rewrites → Add**. Enter `*.home.lan` → `192.168.10.50` and all subdomains resolve to your reverse proxy.
