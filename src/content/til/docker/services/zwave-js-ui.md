---
title: Z-Wave JS UI with Docker Compose
pubDate: 2026-04-13
tags: [docker, services, zwave, smart-home, zwave-js-ui]
description: Self-hosted Z-Wave controller that bridges a USB Z-Wave stick to MQTT. Pairs with Mosquitto and Home Assistant for local Z-Wave control.
---

Z-Wave JS UI manages a Z-Wave USB controller and publishes device state to [Mosquitto](/til/docker/services/mosquitto). [Home Assistant](/til/docker/services/home-assistant) auto-discovers Z-Wave devices via MQTT — the same pattern as [Zigbee2MQTT](/til/docker/services/zigbee2mqtt), just for Z-Wave devices (door locks, dimmers, smart switches).

## Prerequisites

- A Z-Wave USB controller (e.g., Zooz ZST10 700, Aeotec Z-Stick 7, UZB-7)
- A running [Mosquitto broker](/til/docker/services/mosquitto)

## Compose

```yaml
services:
  zwave-js-ui:
    image: zwavejs/zwave-js-ui:latest
    container_name: zwave-js-ui
    restart: unless-stopped
    ports:
      - '8091:8091' # web UI
      - '3000:3000' # WebSocket (only needed if HA connects directly, not via MQTT)
    volumes:
      - ./store:/usr/src/app/store
    devices:
      - /dev/ttyACM0:/dev/ttyACM0 # match your Z-Wave stick
    environment:
      - TZ=America/New_York
      - STORE_DIR=/usr/src/app/store
```

Find your stick's device path: `ls /dev/ttyACM* /dev/ttyUSB*`

## USB passthrough in a Proxmox LXC

If running inside an LXC, add to `/etc/pve/lxc/<VMID>.conf`:

```ini
# ttyACM* devices use major 166
lxc.cgroup2.devices.allow: c 166:* rwm
lxc.mount.entry: /dev/ttyACM0 dev/ttyACM0 none bind,optional,create=file
```

If your stick enumerates as `ttyUSB0` instead, use major `188`.

## Configuration

All configuration is done via the web UI at `http://<HOST>:8091`. Key settings:

**Settings → Z-Wave:**

- Serial port: `/dev/ttyACM0` (or your device path)

**Settings → MQTT:**

- Enable MQTT
- Server: `mqtt://<MOSQUITTO_IP>:1883`
- Topic prefix: `zwave`
- Client ID: `zwave-js-ui`
- Credentials: match your Mosquitto auth if enabled

**Settings → Home Assistant:**

- Discovery: enabled
- HASS Discovery Prefix: `homeassistant`

Use **MQTT mode** (not WebSocket mode) for the Home Assistant integration — MQTT is more resilient and doesn't require an HA restart when Z-Wave JS UI restarts.

## Home Assistant integration

With MQTT discovery enabled, Z-Wave devices appear in HA automatically under the MQTT integration. Use the **Z-Wave JS UI** integration in HA (via MQTT), not the built-in Z-Wave JS add-on.

## Backup

```bash
tar -czf zwave-backup-$(date +%Y%m%d).tar.gz ./store/
```

`store/settings.json` contains S2 security keys. Without them, S2-encrypted devices (door locks, garage openers) must be factory-reset and re-paired after a migration. Back up before any move.

## See also

- [Mosquitto](/til/docker/services/mosquitto) — MQTT broker Z-Wave JS UI publishes to
- [Zigbee2MQTT](/til/docker/services/zigbee2mqtt) — Zigbee equivalent of this stack
- [Home Assistant](/til/docker/services/home-assistant) — subscribes to device state
