---
title: API token scoping vs user auth
pubDate: 2026-04-18
tags: [proxmox, api, security]
---

Proxmox supports two auth methods for the API: user sessions (username + password → ticket) and API tokens. For automation, always use tokens.

## Create a token

**Datacenter → Permissions → API Tokens → Add**

- User: create a dedicated user (e.g., `terraform@pve`) rather than using root
- Token ID: a label, e.g., `terraform`
- **Privilege Separation**: enabled by default — the token cannot exceed the user's permissions, and the user cannot exceed what ACLs allow

The secret is shown once — save it immediately.

## Assign permissions

Tokens inherit the user's role but are further scoped by ACL paths. Grant the minimum needed:

```sh
# Allow token to manage VMs on a specific node
pveum acl modify /nodes/pve1 -user terraform@pve -role PVEVMAdmin

# Allow token to manage storage
pveum acl modify /storage/local-lvm -user terraform@pve -role PVEDatastoreAdmin

# Full access (avoid for automation)
pveum acl modify / -user terraform@pve -role Administrator
```

## Using the token in API calls

```sh
curl -H "Authorization: PVEAPIToken=terraform@pve!terraform=<secret>" \
  https://pve:8006/api2/json/nodes
```

## Terraform / Ansible

The `bpg/proxmox` Terraform provider accepts `api_token` directly. The `community.general.proxmox` Ansible collection accepts `api_user`, `api_token_id`, `api_token_secret`.

Using a scoped token means a leaked credential can only affect what you explicitly granted — not the entire cluster.
