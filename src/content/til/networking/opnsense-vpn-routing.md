---
title: OPNsense policy-based routing and VPN killswitch
pubDate: 2025-01-01
tags: [opnsense, wireguard, firewall]
---

Two things about OPNsense firewall rules that aren't obvious from the UI.

## Floating rule direction must be "in"

When using floating firewall rules for policy-based routing (e.g., routing a VLAN through a VPN gateway), the direction must be set to **"in"** — not "out", not "any". "In" means traffic entering the firewall from that interface. Rules set to "out" or "any" don't match in the way you expect for gateway selection and the traffic falls through to the default route.

## VPN killswitch: blackhole beats leak

A proper killswitch disables gateway monitoring on the VPN interface and sets it as the only allowed gateway for the affected traffic. When the tunnel drops, OPNsense won't fall back to the WAN — it just drops the traffic (blackhole). This is intentional: silent leak is worse than visible failure.

The consequence: if the VPN tunnel is down, affected hosts have no internet access at all. That's the point.

## Bypassing the VPN for specific destinations

Some services (GitHub, container registries) break or rate-limit through VPN exit nodes. Create a firewall alias with the IP ranges and add a rule above the VPN routing rule that sends matched traffic via the default WAN gateway. Rule order matters — first match wins in OPNsense.

## WireGuard session rotation (PIA)

PIA WireGuard sessions expire. A watchdog script that re-registers with the PIA API on a schedule prevents silent expiry from breaking connectivity. The tunnel stays up but stops passing traffic when the session token expires — `ping` to the VPN gateway succeeds but nothing beyond it works.
