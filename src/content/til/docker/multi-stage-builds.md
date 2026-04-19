---
title: Multi-stage builds for smaller images
pubDate: 2026-04-18
tags: [docker, build]
---

A multi-stage build uses multiple `FROM` statements in one Dockerfile. Only the final stage ships — earlier stages are discarded.

```dockerfile
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:24-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/index.js"]
```

The `builder` stage has all dev dependencies and source files. The final stage gets only the compiled output. A typical Node app goes from 1.2GB to under 200MB.

## Rules of thumb

**Only copy what runs.** Don't `COPY . .` in the final stage — enumerate exactly what the app needs.

**Pin your base images.** `node:24-alpine` can change. Use digest pins for production: `node:20-alpine@sha256:...`.

**Build args in the right stage.** A `--build-arg` passed at build time is only visible in the stage where `ARG` is declared. Declare it in each stage that needs it.

## Inspecting layer size

```sh
docker history <image> --no-trunc
docker image inspect <image> --format='{{.Size}}'
```

`dive` is the most useful third-party tool for auditing what's in each layer.
