---
title: MikroTik VLAN bridge configuration sequencing
pubDate: 2025-01-01
tags: [mikrotik, vlan, networking]
---

MikroTik RouterOS VLAN bridge config has one critical sequencing rule: **set `vlan-filtering=yes` last**.

Enabling VLAN filtering before the bridge VLAN table is fully configured will drop management traffic — you'll lose access to the switch and need a physical console to recover.

## Safe order

1. Add the bridge
2. Add all ports to the bridge with correct `frame-types` (trunk vs access)
3. Add all VLAN entries to the bridge VLAN table
4. **Then** set `bridge vlan-filtering=yes`

## Trunk vs access ports

Trunk ports carry multiple VLANs tagged:

```
/interface bridge port set [find interface=ether1] frame-types=admit-all
```

Access ports carry one VLAN untagged:

```
/interface bridge port set [find interface=ether2] pvid=20 frame-types=admit-only-untagged-and-priority-tagged
```

## SwOS vs RouterOS

MikroTik sells switches running either SwOS (simpler, web-only, no scripting) or RouterOS (full feature set). SwOS switches can't run the bridge VLAN configuration above — they have their own VLAN tab in the web UI. Don't confuse documentation between the two.

## UniFi APs on a MikroTik trunk

Configure the MikroTik trunk port before creating VLAN-tagged SSIDs in the UniFi controller. The switch must be passing tagged frames before clients try to get DHCP from the router — otherwise the APs come up but clients get no IP.
