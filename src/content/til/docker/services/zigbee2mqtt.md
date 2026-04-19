---
title: Zigbee2MQTT with Docker Compose
pubDate: 2026-03-14
tags: [docker, services, zigbee, smart-home, zigbee2mqtt]
description: Bridge a Zigbee USB coordinator to MQTT, eliminating cloud dependency. Pairs with Mosquitto and Home Assistant for full local smart home control.
---

Zigbee2MQTT bridges a USB Zigbee coordinator dongle to an MQTT broker. Zigbee devices (lights, sensors, switches) pair to the dongle and their state is published to [Mosquitto](/til/docker/services/mosquitto), which [Home Assistant](/til/docker/services/home-assistant) subscribes to. No Zigbee hub, no cloud.

## Prerequisites

- A Zigbee USB coordinator (e.g., Sonoff Zigbee 3.0 USB Dongle Plus, ConBee II, CC2652P)
- A running [Mosquitto broker](/til/docker/services/mosquitto)

## Compose

```yaml
services:
  zigbee2mqtt:
    image: koenkk/zigbee2mqtt:latest
    container_name: zigbee2mqtt
    restart: unless-stopped
    ports:
      - '8080:8080' # web UI — remove if not exposing
    volumes:
      - ./data:/app/data
      - /run/udev:/run/udev:ro
    devices:
      - /dev/ttyUSB0:/dev/ttyUSB0 # match your dongle's device path
    environment:
      - TZ=America/New_York
```

Find your dongle's device path: `ls /dev/ttyUSB* /dev/ttyACM*`

## Configuration

`data/configuration.yaml` (created on first run — edit before starting or after):

```yaml
homeassistant: true # enables MQTT discovery for Home Assistant
permit_join: false # set true temporarily when pairing new devices

mqtt:
  base_topic: zigbee2mqtt
  server: mqtt://<MOSQUITTO_IP>:1883
  # If auth is enabled on Mosquitto:
  # user: <mqtt_username>
  # password: <mqtt_password>

serial:
  port: /dev/ttyUSB0 # match your dongle
  adapter: auto # or: znp, ezsp, deconz, zstack — see adapter docs

frontend:
  port: 8080

advanced:
  log_level: info
  network_key: GENERATE # auto-generated on first run — back this up
```

## USB passthrough in a Proxmox LXC

If running inside an LXC (not a VM), add to `/etc/pve/lxc/<VMID>.conf`:

```ini
# For ttyUSB* devices (major 188)
lxc.cgroup2.devices.allow: c 188:* rwm
lxc.mount.entry: /dev/ttyUSB0 dev/ttyUSB0 none bind,optional,create=file
```

If your dongle enumerates as `ttyACM0` instead, use major `166`.

## First run

```bash
docker compose up -d
docker compose logs -f zigbee2mqtt
```

On first start, Zigbee2MQTT generates `data/coordinator_backup.json` and the network key. Back up the entire `data/` directory — losing the network key means re-pairing all devices.

## Pairing devices

```yaml
# In configuration.yaml, temporarily set:
permit_join: true
```

Restart, trigger the device's pairing mode (usually hold a button), wait for Zigbee2MQTT to log the join. Set `permit_join: false` again when done.

## Home Assistant integration

With `homeassistant: true` in the config, Zigbee2MQTT publishes MQTT discovery messages and Home Assistant creates entities automatically — no YAML entity configuration needed. Entities appear under the MQTT integration in HA.

## Backup

```bash
# Back up the data directory — contains network key, device list, config
tar -czf zigbee2mqtt-backup-$(date +%Y%m%d).tar.gz ./data/
```

The `coordinator_backup.json` file is especially critical. Without it, devices must be factory-reset and re-paired after a migration.

## See also

- [Mosquitto](/til/docker/services/mosquitto) — MQTT broker Zigbee2MQTT publishes to
- [Z-Wave JS UI](/til/docker/services/zwave-js-ui) — Z-Wave equivalent of this stack
- [Home Assistant](/til/docker/services/home-assistant) — subscribes to device state
