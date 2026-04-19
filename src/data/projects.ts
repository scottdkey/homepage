export interface Project {
  name: string;
  description: string;
  tags: string[];
  site?: string;
  github?: string;
}

export const projects: Project[] = [
  {
    name: "Carl CLI",
    description:
      "Unified dev CLI for the BOD platform. Orchestrates ~18 containers, 5 stacks, 3 dev servers. One command to start everything.",
    tags: ["TypeScript", "Docker", "Kubernetes"],
  },
  {
    name: "@rebuy/tributary",
    description:
      "OpenAPI → TypeScript code generator. Typed fetchers, Zod schemas, React Query hooks, Next.js-aware proxy. Eliminates API drift across the service mesh.",
    tags: ["TypeScript", "OpenAPI", "Code gen"],
  },
  {
    name: "Payouts",
    description:
      "End-to-end financial feature at BOD. Stripe integration, idempotency keys, ledger reconciliation, exactly-once guarantees, append-only audit log.",
    tags: ["Stripe", "Fastify", "PostgreSQL"],
  },
  {
    name: "Shopify Widget",
    description:
      "React/Vite checkout embedded in merchant Shopify themes via Liquid. Same-origin proxy, passthrough auth, semver versioning, GCS asset hosting.",
    tags: ["React", "Shopify", "GCS"],
  },
  {
    name: "Entitlements",
    description:
      "B2B subscription entitlement engine at Pluralsight. Processed ~$9M/month in provisioning events across Kafka and RabbitMQ. Reconciled plan state against Salesforce and downstream billing systems with exactly-once guarantees.",
    tags: ["Node.js", "Kafka", "RabbitMQ", "PostgreSQL", "Salesforce"],
  },
  {
    name: "SHAFT",
    description:
      "Internal Next.js tool at Pluralsight. Integrated Kafka, RabbitMQ, and Salesforce to surface provisioning discrepancies for non-technical stakeholders.",
    tags: ["Next.js", "Kafka", "RabbitMQ", "Salesforce"],
  },
  {
    name: "Bardbase",
    description:
      "Multi-edition Shakespeare reader with lexicon, cross-edition alignment, and reference works. Covers 37 plays across five editions (First Folio 1623, Globe 1864, Folger, Standard Ebooks, Moby) with side-by-side comparison and word-level reference hovers. Built on SQLite, Go, and SvelteKit. PWA with offline capability.",
    tags: ["Go", "SvelteKit", "SQLite", "Railway", "Cloudflare"],
    site: "https://bardbase.pages.dev",
    github: "https://github.com/scottdkey/bardbase",
  },
  {
    name: "Halvor",
    description:
      "Home automation infrastructure project — a self-hosted platform for home automation built on Proxmox, OPNsense, and containerized services. Covers network segmentation, NAS configuration, LXC/VM provisioning, and service orchestration. Private repo; guides and writeups published at /notes.",
    tags: ["Proxmox", "OPNsense", "Docker", "Networking"],
  },
];
