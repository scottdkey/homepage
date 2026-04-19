---
title: Mosquitto MQTT broker with Docker Compose
pubDate: 2026-03-14
tags: [docker, services, mqtt, smart-home, mosquitto]
description: Self-hosted MQTT message broker for smart home device communication. The hub connecting Zigbee2MQTT, Z-Wave JS UI, and Home Assistant.
---

Mosquitto is a lightweight MQTT message broker. In a self-hosted smart home stack it sits at the center — Zigbee2MQTT and Z-Wave JS UI publish device state to it, and Home Assistant subscribes to receive updates.

```
Zigbee2MQTT ─┐
              ├─► Mosquitto (1883) ─► Home Assistant
Z-Wave JS UI ─┘
```

Mosquitto holds no device state itself. All three clients connect independently. Retained messages (`retain: true`) allow clients to re-sync immediately after a Mosquitto restart.

## Compose

```yaml
services:
  mosquitto:
    image: eclipse-mosquitto:latest
    container_name: mosquitto
    restart: unless-stopped
    ports:
      - '1883:1883'
      - '9001:9001' # WebSocket — remove if not needed
    volumes:
      - ./config:/mosquitto/config
      - ./data:/mosquitto/data
      - ./log:/mosquitto/log
```

## Configuration

Create `config/mosquitto.conf`:

```conf
listener 1883
listener 9001
protocol websockets

persistence true
persistence_location /mosquitto/data/

log_dest file /mosquitto/log/mosquitto.log
log_type error
log_type warning
log_type notice
log_type information

# Anonymous access — fine for a local-only broker
allow_anonymous true

# To require credentials instead:
# allow_anonymous false
# password_file /mosquitto/config/passwd
```

## Authentication (optional but recommended)

```bash
# Create the password file (use -c only on the first user)
docker exec -it mosquitto \
  mosquitto_passwd -c /mosquitto/config/passwd <username>

# Add additional users
docker exec -it mosquitto \
  mosquitto_passwd /mosquitto/config/passwd <username2>
```

Update `mosquitto.conf`:

```conf
allow_anonymous false
password_file /mosquitto/config/passwd
```

Restart: `docker compose restart mosquitto`

Configure the same credentials in [Zigbee2MQTT](/til/docker/services/zigbee2mqtt) and [Z-Wave JS UI](/til/docker/services/zwave-js-ui).

## Verify the broker

```bash
# Subscribe in one terminal
docker exec -it mosquitto \
  mosquitto_sub -h localhost -t "test/#" -v

# Publish from another
docker exec -it mosquitto \
  mosquitto_pub -h localhost -t "test/hello" -m "world"
```

## Ports

| Port   | Protocol | Purpose                              |
| ------ | -------- | ------------------------------------ |
| `1883` | TCP      | MQTT (plaintext)                     |
| `8883` | TCP      | MQTT over TLS (not configured above) |
| `9001` | TCP      | MQTT over WebSocket                  |

## See also

- [Zigbee2MQTT](/til/docker/services/zigbee2mqtt) — Zigbee coordinator that publishes to this broker
- [Z-Wave JS UI](/til/docker/services/zwave-js-ui) — Z-Wave controller that publishes to this broker
- [Home Assistant](/til/docker/services/home-assistant) — subscribes to device state via this broker
