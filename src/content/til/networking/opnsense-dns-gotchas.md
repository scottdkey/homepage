---
title: OPNsense Unbound DNS gotchas
pubDate: 2025-01-01
tags: [opnsense, dns, unbound]
---

A few non-obvious behaviors in OPNsense's Unbound DNS resolver that have bitten me.

## Wildcard host overrides crash Unbound

Unbound's built-in "Host Overrides" UI doesn't support wildcards — entering `*.domain.local` causes Unbound to fail on startup with a config parse error. Use AdGuard Home (or a similar upstream) for wildcard DNS rewrites instead. AdGuard handles `*.domain → IP` correctly and forwards everything else to Unbound.

## DNSSEC + private addresses

If you have a DNSSEC-signed domain that resolves to a private (RFC1918) address, Unbound will reject the response by default because DNSSEC validation sees a public domain returning a private IP as suspicious.

Fix in **Services → Unbound DNS → Advanced**:

- Add the domain to **Private Domains** (`private-domain`)
- Add it to **Insecure Domains** (`domain-insecure`)

Both are needed: `private-domain` allows RFC1918 responses, `domain-insecure` skips DNSSEC validation for that domain.

## Don't add Cloudflare as a second forwarder

Adding `1.1.1.1` as a second Unbound forwarder alongside a local DNS (like AdGuard) causes Cloudflare to win the race most of the time — it responds faster than a local service. This bypasses ad-blocking entirely. Use one forwarder, and make it the local one.

## Kea vs ISC DHCP

OPNsense ships both Kea and the legacy ISC DHCP server. Key difference: **Kea persists leases across restarts**, ISC does not. If you restart ISC DHCP, all current leases are gone from its table (clients keep their IPs until lease expiry, but the server's view resets). Switch to Kea.
