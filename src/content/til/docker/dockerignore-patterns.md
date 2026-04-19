---
title: .dockerignore patterns that actually matter
pubDate: 2026-04-18
tags: [docker, build]
---

`.dockerignore` follows `.gitignore` syntax and affects what gets sent to the build context — not just image size, but build time and whether secrets leak into layers.

## Patterns worth having everywhere

```
# Dependencies (reinstalled in the build anyway)
node_modules
**/node_modules

# Version control
.git
.gitignore

# Secrets
.env
.env.*
!.env.example

# Build output (rebuilt inside container)
dist
build
.next
out

# Editor and OS noise
.DS_Store
*.swp
.idea
.vscode

# Test artifacts
coverage
.nyc_output

# Logs
*.log
npm-debug.log*
```

## Why it matters beyond size

Every file in the build context gets checksummed for cache invalidation. A `node_modules` folder with thousands of files blows up cache checking time. More importantly: if `.env` isn't in `.dockerignore` and you run `COPY . .`, your secrets end up in an image layer even if you `RUN rm .env` in a later step — layers are immutable and the secret is still in the history.

## Check what's being sent

```sh
# Temporarily add this to see context size
docker build --no-cache . 2>&1 | head -5
```

The first line reports "Sending build context to Docker daemon X.XXkB" — if that number is large, `.dockerignore` needs work.
