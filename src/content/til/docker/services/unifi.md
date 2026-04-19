---
title: UniFi Network Application with Docker Compose
pubDate: 2026-03-28
tags: [docker, services, unifi, networking]
description: Self-hosted Ubiquiti UniFi controller for managing WiFi access points and switches. Requires a separate MongoDB instance.
---

The UniFi Network Application is the software controller for Ubiquiti access points, switches, and gateways. Running it self-hosted (instead of UniFi Cloud) keeps all network data local and removes the account dependency for AP management.

## Compose

The linuxserver image requires a separate MongoDB container:

```yaml
services:
  unifi-network-application:
    image: lscr.io/linuxserver/unifi-network-application:latest
    container_name: unifi-network-application
    restart: unless-stopped
    depends_on:
      - unifi-db
    ports:
      - '8443:8443' # Web UI (HTTPS)
      - '8080:8080' # AP inform/adoption (must be reachable by APs)
      - '3478:3478/udp' # STUN
      - '10001:10001/udp' # AP discovery (optional)
    volumes:
      - ./config:/config
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/New_York
      - MONGO_USER=unifi
      - MONGO_PASS=<your_mongo_password>
      - MONGO_HOST=unifi-db
      - MONGO_PORT=27017
      - MONGO_DBNAME=unifi

  unifi-db:
    image: mongo:7
    container_name: unifi-db
    restart: unless-stopped
    volumes:
      - ./mongodb:/data/db
      - ./init-mongo.js:/docker-entrypoint-initdb.d/init-mongo.js:ro
    environment:
      - MONGO_INITDB_ROOT_USERNAME=root
      - MONGO_INITDB_ROOT_PASSWORD=<your_root_password>
```

## MongoDB init script

Create `init-mongo.js` alongside the compose file. MongoDB runs it once on first start to create the UniFi database user:

```javascript
db.getSiblingDB('unifi').createUser({
  user: 'unifi',
  pwd: '<your_mongo_password>', // must match MONGO_PASS above
  roles: [{ role: 'dbOwner', db: 'unifi' }],
});
db.getSiblingDB('unifi_stat').createUser({
  user: 'unifi',
  pwd: '<your_mongo_password>',
  roles: [{ role: 'dbOwner', db: 'unifi_stat' }],
});
```

## First run

```bash
docker compose up -d
```

Access the UI at `https://<HOST>:8443` (self-signed cert on first access — accept the warning). Complete the setup wizard. Do **not** create a Ubiquiti account if you want fully local operation — choose "Advanced Setup" to skip cloud login.

## Adopting access points

APs must reach the controller on port `8080`. When adopting an unconfigured AP:

1. The AP should appear under **Devices** if it's on the same subnet
2. If it doesn't auto-discover, SSH into the AP and run:
   ```bash
   set-inform http://<CONTROLLER_IP>:8080/inform
   ```
3. Click **Adopt** in the UI

## Network architecture

UniFi manages WiFi configuration — SSIDs, radio settings, VLAN tagging on wireless networks. The router (OPNsense, pfSense, etc.) handles DHCP, firewall rules, and VLANs on the wired side.

Key gotcha: switch trunk ports must carry tagged VLAN traffic to AP ports **before** adding VLAN-tagged SSIDs in UniFi. If the switch port only passes untagged traffic, clients on VLAN SSIDs will associate but won't get an IP.

In UniFi, each WiFi network maps to a Network object with a VLAN ID. Leave DHCP **off** in the UniFi network object — let your router handle it.

## Ports

| Port    | Protocol | Purpose                                |
| ------- | -------- | -------------------------------------- |
| `8443`  | TCP      | Web UI (HTTPS)                         |
| `8080`  | TCP      | AP inform — APs call home on this port |
| `3478`  | UDP      | STUN                                   |
| `10001` | UDP      | AP discovery (L2, same subnet only)    |

Port `8080` must be reachable from all managed APs. If APs are on a different VLAN than the controller, ensure your firewall allows this.

## Backup

Settings → System → Backup → Download backup (`.unf` file). Schedule auto-backups to a local path or network share. Restore: Settings → System → Backup → Restore.

## Volumes

| Path        | Contents                                                 |
| ----------- | -------------------------------------------------------- |
| `./config`  | UniFi application data, site configs, provisioning state |
| `./mongodb` | MongoDB data directory                                   |

Back up both. Losing `./config` means re-adopting all devices. Losing `./mongodb` corrupts the database.
