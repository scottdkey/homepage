---
title: Installing Docker on Debian / Ubuntu
pubDate: 2026-03-07
tags: [docker, debian, ubuntu, linux]
description: Install Docker Engine on Debian 12 or Ubuntu 22.04+ using the official apt repository.
---

Covers Debian 12 (Bookworm) and Ubuntu 22.04+. Installs Docker Engine, the Compose plugin, and the Buildx plugin from Docker's official repository — not the older `docker.io` package in distro repos.

## Install

```bash
sudo apt-get update && sudo apt-get upgrade -y

sudo apt-get install -y \
  curl gnupg ca-certificates \
  apt-transport-https software-properties-common

# Add Docker's GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | \
  sudo tee /etc/apt/keyrings/docker.asc > /dev/null
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
  https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y \
  docker-ce docker-ce-cli containerd.io \
  docker-buildx-plugin docker-compose-plugin
```

For Ubuntu, replace `debian` with `ubuntu` in the two repository URLs.

## Post-install

```bash
# Run Docker without sudo
sudo usermod -aG docker $USER
newgrp docker

# Enable on boot
sudo systemctl enable docker containerd

# Verify
docker run --rm hello-world
docker compose version
```

## Daemon configuration

`/etc/docker/daemon.json` — sensible defaults for a container host:

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2"
}
```

```bash
sudo systemctl restart docker
```

## Firewall (UFW)

UFW and Docker both manipulate iptables. By default, Docker bypasses UFW rules for published ports — containers are reachable even if UFW would block the port. This is intentional Docker behavior.

```bash
# Allow SSH if UFW is enabled
sudo ufw allow 22/tcp
sudo ufw reload
```

Only expose the Docker API socket (`2376`) if you need remote access, and always use TLS when doing so.

## Troubleshooting

```bash
# Service won't start
sudo journalctl -u docker -f
sudo dockerd --validate   # check daemon.json for errors

# Permission denied
groups $USER              # confirm 'docker' appears
sudo usermod -aG docker $USER && newgrp docker

# DNS broken inside containers
# Add to daemon.json:
# "dns": ["1.1.1.1", "8.8.8.8"]
sudo systemctl restart docker
```

## See also

- [Docker in a Proxmox LXC](/til/docker/host-setup/docker-in-proxmox-lxc) — run Docker inside an LXC container instead of a VM
- [Alpine Docker gotchas](/til/docker/host-setup/alpine-docker-gotchas) — differences when using Alpine as the host
