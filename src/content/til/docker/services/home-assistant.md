---
title: Home Assistant OS setup
pubDate: 2026-03-14
tags: [docker, services, home-assistant, smart-home]
description: Install Home Assistant OS as a VM for a fully local smart home hub. Integrates with Mosquitto, Zigbee2MQTT, and Z-Wave JS UI via MQTT.
---

Home Assistant is an open-source home automation platform. It runs best as a VM running **Home Assistant OS (HAOS)** — a purpose-built Linux distribution that manages its own container runtime. This is not a Docker Compose setup; HAOS handles that internally.

For a homelab, HAOS on Proxmox is the standard approach. The alternative — running Home Assistant Container in Docker — skips the supervisor and add-on ecosystem, which is a meaningful loss.

## Recommended specs

- 2 vCPU, 4 GB RAM, 32 GB disk minimum
- Machine type: q35 with UEFI (OVMF)
- Static IP via DHCP reservation (HA's integrations break if the IP changes)

## Install on Proxmox

1. Download the HAOS `.qcow2` image from [home-assistant.io/installation](https://www.home-assistant.io/installation/alternative)
2. Create a VM: q35, OVMF BIOS, 32 GB disk, 4 GB RAM
3. Import the disk:
   ```bash
   qm importdisk <VMID> haos_ova-<version>.qcow2 local-lvm
   ```
4. Attach the imported disk as the boot disk (SCSI 0), remove the default disk
5. Set boot order to the imported disk
6. Start the VM — HAOS boots, then access `http://<VM_IP>:8123`

## Smart home integrations

HAOS discovers most devices automatically. The MQTT stack integrates as follows:

| Service                                          | How HA connects                                         |
| ------------------------------------------------ | ------------------------------------------------------- |
| [Mosquitto](/til/docker/services/mosquitto)      | MQTT integration — Settings → Devices & Services → MQTT |
| [Zigbee2MQTT](/til/docker/services/zigbee2mqtt)  | Auto-discovered via MQTT after Mosquitto is configured  |
| [Z-Wave JS UI](/til/docker/services/zwave-js-ui) | Auto-discovered via MQTT after Mosquitto is configured  |
| UniFi                                            | UniFi integration — device presence tracking            |

After connecting Mosquitto, Zigbee and Z-Wave devices appear automatically — no YAML entity configuration needed.

## MQTT setup

Settings → Devices & Services → Add Integration → MQTT:

- Broker: `<MOSQUITTO_IP>`
- Port: `1883`
- Username / Password: if auth is enabled on Mosquitto

Enable discovery and set the discovery prefix to `homeassistant` (matches the default in Zigbee2MQTT and Z-Wave JS UI).

## Backup

Settings → System → Backups → Create backup.

HAOS backups include all configuration, automations, integrations, and history. Back up before any migration or major update. Backups can be stored on a network share: Settings → System → Backups → Configure backup location.

## Restore

1. Boot a fresh HAOS VM
2. Complete onboarding, then: Settings → System → Backups → Upload backup
3. Select the backup and restore — HA restarts and comes back as the original instance

## Port

`8123` — web UI and API. No reverse proxy required for local access; add one (e.g., [Nginx Proxy Manager](/til/docker/services/nginx-proxy-manager)) if you want external access via HTTPS.

## See also

- [Mosquitto](/til/docker/services/mosquitto) — MQTT broker for device communication
- [Zigbee2MQTT](/til/docker/services/zigbee2mqtt) — Zigbee device bridge
- [Z-Wave JS UI](/til/docker/services/zwave-js-ui) — Z-Wave device bridge
- [Nginx Proxy Manager](/til/docker/services/nginx-proxy-manager) — TLS reverse proxy for external access
