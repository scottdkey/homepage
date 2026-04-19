---
title: Two-node cluster quorum behavior
pubDate: 2026-04-18
tags: [proxmox, cluster, ha]
---

Proxmox uses Corosync for cluster state, which requires a quorum — a majority of nodes must agree for the cluster to function. With two nodes, losing one node loses quorum, and the cluster freezes (no VM starts, no migrations).

## Why two nodes is inherently fragile

With 2 nodes, you need both online to have quorum (2/2 = 100%). A network blip between nodes causes both to think the other is down. Neither can establish quorum. Both freeze. This is by design — split-brain (two nodes both thinking they're primary) is worse than a freeze.

## Fix: add a QDevice

A QDevice is a lightweight tiebreaker — a third "vote" without requiring a third full Proxmox node. Run it on any always-on Linux machine (a Raspberry Pi, a small VM, your NAS).

```sh
# On the QDevice machine
apt install corosync-qnetd

# On any PVE node in the cluster
pvecm qdevice setup <qdevice-ip>
```

After setup, the cluster has 3 votes. Losing one PVE node leaves 2/3 — still quorum. The cluster keeps running.

## What not to do

**Don't set `expected_votes: 1`** in corosync.conf. This makes a single node always think it has quorum regardless of the other's state, which enables split-brain and data corruption on shared storage.

## Confirming quorum state

```sh
pvecm status
```

Look for `Quorate: Yes` and `Expected votes` matching `Total votes`.
