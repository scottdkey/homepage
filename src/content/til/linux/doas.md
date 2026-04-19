---
title: doas — a simpler sudo alternative
pubDate: 2026-04-18
tags: [linux, alpine, security]
---

`doas` is a privilege escalation tool from OpenBSD. It does what `sudo` does but with a much simpler config and a smaller attack surface. On Alpine it's the preferred choice over sudo.

## Install

```sh
# Alpine
apk add doas

# Debian/Ubuntu
apt install doas
```

## Config

`/etc/doas.conf` — one rule per line:

```
# Allow user 'scott' to run any command as root
permit scott

# Allow without password prompt
permit nopass scott

# Allow only specific commands without password
permit nopass scott cmd apk

# Allow a group
permit :wheel

# Require password even if recently authenticated (no ticket caching)
permit persist scott
```

Rules are evaluated top to bottom, first match wins.

## Common patterns

**Wheel group (like sudo):**
```
permit persist :wheel
```
Add your user: `adduser scott wheel`

**Single-user machine (no password prompt):**
```
permit nopass scott
```

**Passwordless for package management only:**
```
permit nopass scott cmd apk
permit nopass scott cmd rc-service
permit nopass scott cmd rc-update
permit persist scott
```

## Verify config before logging out

```sh
doas -C /etc/doas.conf && echo "config ok"
```

A syntax error in `doas.conf` with no fallback means you're locked out. Always verify, and keep a root session open until confirmed working.

## vs sudo

`doas` has no NOPASSWD per-command inline syntax, no `%group ALL=(ALL) ALL` sprawl, no `/etc/sudoers.d/` fragments. If you need per-command env preservation or complex impersonation rules, sudo has more knobs. For a homelab machine with one or two users, doas config fits in five lines.
