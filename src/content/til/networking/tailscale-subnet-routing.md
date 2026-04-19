---
title: Tailscale subnet routing
pubDate: 2026-04-18
tags: [tailscale, networking, vpn]
---

Tailscale subnet routing lets devices on your tailnet reach a private network without installing Tailscale on every device on that network.

## Set up the subnet router

Install Tailscale on the machine that will act as the router (a server or dedicated VM on your LAN):

```sh
curl -fsSL https://tailscale.com/install.sh | sh
```

Enable IP forwarding:

```sh
echo 'net.ipv4.ip_forward = 1' | tee -a /etc/sysctl.conf
echo 'net.ipv6.conf.all.forwarding = 1' | tee -a /etc/sysctl.conf
```

```sh
sysctl -p
```

Advertise your LAN subnet:

```sh
tailscale up --advertise-routes=192.168.1.0/24
```

## Approve the route in the admin console

Advertised routes are not active until approved. Go to **admin.tailscale.com → Machines → [your router] → Edit route settings** and enable the subnet.

## Accept routes on client devices

On devices that should use the route:

```sh
tailscale up --accept-routes
```

Without `--accept-routes`, clients ignore advertised subnets even after approval.

## Disable key expiry on servers

By default, Tailscale keys expire after 180 days. For always-on subnet routers, disable expiry in the admin console: **Machines → [machine] → Disable key expiry**.

## Exit node vs subnet router

|          | Subnet router            | Exit node                       |
| -------- | ------------------------ | ------------------------------- |
| Routes   | specific subnets only    | all traffic                     |
| Use case | access home LAN remotely | route all internet through home |

Advertise as an exit node:

```sh
tailscale up --advertise-exit-node
```

Use it from a client:

```sh
tailscale up --exit-node=<hostname>
```

## MagicDNS

With MagicDNS enabled, Tailscale machines are reachable by hostname within the tailnet — no manual `/etc/hosts` entries needed.
