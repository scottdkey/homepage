---
title: Environment variable precedence in Docker Compose
pubDate: 2026-04-18
tags: [docker, compose]
---

When the same variable is defined in multiple places, Compose resolves it in this order (highest wins):

1. Shell environment (variables already set in your terminal session)
2. `environment:` block in `compose.yaml`
3. `env_file:` file referenced in `compose.yaml`
4. `ARG` / `ENV` in the Dockerfile

## The automatic .env file

Compose automatically loads `.env` from the same directory as `compose.yaml` for **variable substitution in the compose file itself** — not necessarily for the container environment. These two things are different:

```yaml
# .env contains: TAG=1.2.3
services:
  app:
    image: myapp:${TAG} # .env substitutes this
    env_file: .env # this passes .env vars INTO the container
```

Without `env_file:`, `TAG` is used to build the image reference but the container doesn't see it.

## Quoting in .env files

Values are not quoted — the quotes become part of the value:

```
# Wrong — container sees: SECRET="abc123"
SECRET="abc123"

# Right — container sees: abc123
SECRET=abc123
```

Multi-word values with spaces do not need quoting in `.env` files. `VAR=hello world` works fine.

## Multiple env_file entries

```yaml
env_file:
  - .env
  - .env.local
```

Files are merged in order. Later files win on conflicts. Useful for a shared `.env` plus a local override that's gitignored.

## Secrets that shouldn't be in env at all

For production, prefer Docker secrets or a secrets manager over environment variables — env vars are visible in `docker inspect` and in `/proc/<pid>/environ` inside the container.
