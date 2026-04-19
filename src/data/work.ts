export interface CaseSection {
  id: string;
  heading: string;
  paragraphs: string[];
}

export interface Job {
  slug: string;
  company: string;
  title: string;
  dates: string;
  intro: string;
  stack: string[];
  bullets: string[];
  printBullets: string[];
  sections: CaseSection[];
  site?: string;
}

export const jobs: Job[] = [
  {
    slug: "rebuy",
    company: "Rebuy",
    title: "Senior Software Engineer",
    dates: "May 2024–present",
    site: "https://rebuy.app",
    intro:
      "One of two engineers who started Bulk-on-Demand (BOD), Rebuy's greenfield commerce platform. Primary engineer across every surface: merchant dashboard, customer checkout, the Fastify API, Payouts, and the tooling layer underneath.",
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Fastify",
      "Kysely",
      "PostgreSQL",
      "Tailwind",
      "Stripe",
      "Shopify",
      "Kubernetes",
      "GCP",
    ],
    bullets: [
      "One of two engineers who started Bulk-on-Demand (BOD), Rebuy's greenfield commerce platform. Primary engineer across every surface.",
      "<strong>Payouts (author):</strong> End-to-end financial feature — Stripe integration, idempotency keys, ledger reconciliation, exactly-once guarantees, append-only audit log.",
      "<strong>Carl (author):</strong> Unified dev CLI orchestrating ~18 containers across 5 Docker Compose stacks, 3 Node dev servers, Cloudflare Tunnel, live GKE contexts. 3-command onboarding. 10 command categories, ~25 scripts.",
      "<strong>@rebuy/tributary (author):</strong> OpenAPI → TypeScript code generator producing typed fetchers, Zod schemas, React Query hooks, and a Next.js-aware proxy. Eliminates API-client drift. Private npm (GCP Artifact Registry).",
      "<strong>Shopify-embeddable (author):</strong> React/Vite widget embedded in merchant Shopify themes via Liquid. Same-origin proxy, passthrough auth, semver versioning, GCS asset hosting.",
      "<strong>@rebuy/ice-age:</strong> Kysely migration framework — transaction guards, interactive schema visualizer (Preact, pan/zoom, drift detection, multi-service federation).",
      "Led BOD upgrade to Next.js 16 + React 19 in production. Running React Compiler in prod. Primary CI/CD author (Bitbucket Pipelines + GKE/Helm).",
    ],
    printBullets: [
      "One of two founding engineers on Bulk-on-Demand (BOD), Rebuy's greenfield B2B commerce platform. Primary engineer across every surface: merchant dashboard, customer checkout, Fastify API, Payouts system, and the internal tooling layer.",
      "<strong>Payouts (owner):</strong> Designed and built the end-to-end payout system from scratch — Stripe Connect integration, idempotency keys to prevent double-pays, ledger reconciliation against Stripe's API, exactly-once guarantees via pre-transfer invariant guards, and an append-only audit log. Architected for reuse across the wider Rebuy platform.",
      "<strong>Carl CLI (sole author):</strong> Unified developer CLI that orchestrates ~18 containers across 5 Docker Compose stacks, 3 bare-metal Node servers, a Cloudflare Tunnel, Caddy reverse proxy, Stripe listener, and live GKE kubectl contexts. New engineer onboarding: 3 commands. Also owns vulnerability scanning, Helm/GKE deploys, and the E2E test runner.",
      "<strong>@rebuy/tributary (sole author):</strong> Internal OpenAPI-to-TypeScript code generator. One command produces typed fetchers, Zod schemas, React Query hooks, and a Next.js server/client proxy across four services — eliminating API-contract drift entirely. Published as a private npm package on GCP Artifact Registry.",
      "<strong>@rebuy/ice-age (maintainer):</strong> Inherited and extended Rebuy's Kysely migration framework — added transaction isolation guards, Pino logging, and an interactive schema visualizer (Preact + esbuild) with pan/zoom, FK mapping, drift detection, and multi-service federation.",
      "<strong>Shopify embeddable (author):</strong> React/Vite widget embedded into merchant Shopify themes via Liquid. Same-origin proxy eliminates CORS; Shopify passthrough auth via bod-shopify-connector. Versioned artifacts deployed to GCS.",
      "Primary CI/CD author (Bitbucket Pipelines + GKE/Helm). Led production upgrade to Next.js 16 + React 19 with React Compiler enabled in prod.",
    ],
    sections: [
      {
        id: "payouts",
        heading: "Payouts",
        paragraphs: [
          "End-to-end financial feature I own completely at BOD. Spans the admin console, the merchant store UI, and the Stripe integration for actual money movement — plus a full financial safety layer: idempotency keys so retries don't double-pay, reconciliation against Stripe's own ledger to catch drift, exactly-once guarantees, pre-transfer guards that block a payout when invariants don't hold, and an append-only audit log of every action.",
          "Designed for cross-company use on the wider Rebuy platform, not just BOD.",
        ],
      },
      {
        id: "carl",
        heading: "Carl CLI",
        paragraphs: [
          "Carl is the unified development CLI I authored for the BOD platform. It started as individual scripts I didn't want to lose and grew into the tool every BOD engineer uses every day. `carl dev` orchestrates roughly 18 containers across 5 Docker Compose stacks — each service (bod-api, bod-shopify-connector, bod-accounts) has its own dedicated Postgres instance and migrator, plus workers, a Cloudflare Tunnel, a Caddy reverse proxy, a Stripe listener, a data seeder, and a test runner — plus three bare-metal Node dev servers and live kubectl contexts pointing at staging and prod.",
          "One command. Onboarding a new engineer is three commands: `git clone`, `carl init`, `carl dev`. Init handles Homebrew, direnv, 1Password CLI, version-manager detection, all five repo clones, and shell configuration. Beyond local dev, Carl owns vulnerability scanning, Helm-based GKE deploys, cluster access, integration and E2E test runners, and an OpenAPI validation pipeline. Ten command categories, ~25 scripts, one author.",
        ],
      },
      {
        id: "tributary",
        heading: "@rebuy/tributary",
        paragraphs: [
          "Tributary is an OpenAPI/GraphQL → TypeScript code generator I authored. It takes a spec and produces the entire consumer-side call stack — typed fetchers, Zod schemas, React Query hooks, and a Next.js-aware proxy that lets the same typed function run on either side of the server/client boundary without manual `use server`/`use client` plumbing.",
          "One change to the API, one command, and three separate client repos receive a fully-typed, runtime-validated update. It's the reason our four services don't drift. Private npm package on GCP Artifact Registry.",
        ],
      },
      {
        id: "shopify",
        heading: "Shopify-embeddable widget system",
        paragraphs: [
          "BOD ships the same customer checkout in two places: first-party on rebuy.app, and embedded inside merchants' own Shopify storefronts. I authored the embeddable side — a React/Vite app that installs into merchant themes via Liquid and interacts with bod-api as if it were hosted on Rebuy's own domain.",
          "Same-origin proxy eliminates CORS; Shopify passthrough auth flows through bod-shopify-connector. Updates ship as semver-versioned artifacts to a Google Cloud Storage bucket — merchants pin the version they want in their theme config and update on their own schedule.",
        ],
      },
      {
        id: "ice-age",
        heading: "@rebuy/ice-age — schema visualizer",
        paragraphs: [
          "I inherited ice-age, Rebuy's Kysely-based migration framework, and became its primary maintainer. I've added transaction guards, isolation-level support, Pino logging, and improved error handling.",
          "The piece I'm most proud of: an interactive schema visualizer authored end to end — a Preact client bundled with esbuild, invoked via `ice-age visualize`. It renders a pan/zoom diagram of the full DB schema with domain grouping, FK relationship mapping, drift detection, and multi-config federation so schemas from multiple services appear as tabs in one tool.",
        ],
      },
    ],
  },
  {
    slug: "pluralsight",
    company: "Pluralsight",
    title: "Software Engineer, FinTech Team",
    dates: "Nov 2021–Mar 2024",
    site: "https://pluralsight.com",
    intro:
      "Worked on the B2B provisioning pipeline and financial tooling at Pluralsight's FinTech team — the layer between Salesforce, billing systems, and the platform, processing ~$9M/month in provisioning at peak.",
    stack: [
      "TypeScript",
      "React",
      "Next.js",
      "NestJS",
      "PostgreSQL",
      "Redis",
      "Kafka",
      "RabbitMQ",
      "Salesforce",
      "Stripe",
      "AWS",
      "Kubernetes",
    ],
    bullets: [
      "B2B provisioning pipeline (Entitlements API — NestJS middleware in the Salesforce → MuleSoft → platform chain) processing ~$9M/month at peak.",
      "<strong>SHAFT (author):</strong> Internal Next.js tool integrating Kafka, RabbitMQ, and Salesforce to surface provisioning discrepancies in real time for non-technical stakeholders.",
      "A Cloud Guru migration — payment methods, bulk account creation (10k+ accounts), account settings, billing data for thousands of customers.",
      "Billing system migrations: Chargebee → Stripe + Salesforce; Zuora → Stripe.",
    ],
    printBullets: [
      "<strong>Entitlements API:</strong> NestJS middleware in the Salesforce → MuleSoft → platform provisioning chain. Processed ~$9M/month in B2B license provisioning at peak load.",
      "<strong>SHAFT (author):</strong> Internal Next.js tool connecting Kafka streams, RabbitMQ, and Salesforce to surface provisioning discrepancies in real time for ~20 non-technical stakeholders — replacing engineer-only manual investigations with a self-serve interface.",
      "<strong>A Cloud Guru migration:</strong> Full billing and account migration following acquisition — payment method portability, bulk account creation (10k+ accounts), subscription mapping, and billing history migration for thousands of customers.",
      "<strong>Billing migrations:</strong> Two major platform migrations — Chargebee to Stripe + Salesforce, and Zuora to Stripe. Batch-migrated payment methods, subscription records, and billing data at scale with zero revenue loss.",
    ],
    sections: [
      {
        id: "shaft",
        heading: "SHAFT — Self Help App FinTech",
        paragraphs: [
          "SHAFT is an internal Next.js tool I authored at Pluralsight. It integrates Kafka streams, RabbitMQ streams, and Salesforce to surface provisioning discrepancies in real time — data mismatches between billing systems and customer records that would otherwise require an engineer to investigate and manually correct.",
          "SHAFT put that capability in the hands of ~20 non-technical stakeholders with specific financial permissions. I was the primary author, built it solo, and handed it to the team to iterate on.",
        ],
      },
      {
        id: "acg",
        heading: "A Cloud Guru migration",
        paragraphs: [
          "Contributed to the A Cloud Guru (ACG) migration following Pluralsight's acquisition — capturing and moving thousands of customers from ACG's systems into Pluralsight's internal platform. This included payment method migration, bulk account creation (10k+ accounts), account settings, and billing data migration.",
        ],
      },
      {
        id: "billing",
        heading: "Billing system migrations",
        paragraphs: [
          "Contributed to two major billing migrations: all Chargebee customers to Stripe + Salesforce, and all Zuora customers to Stripe. Batch migrations of customer billing records, payment methods, and subscription data at scale.",
        ],
      },
      {
        id: "entitlements",
        heading: "Entitlements API",
        paragraphs: [
          "The Entitlements API was a NestJS service that sat as a middleware layer in the Salesforce → MuleSoft → Entitlements → platform chain for B2B provisioning. At peak it handled ~$9M/month in provisioning requests.",
        ],
      },
    ],
  },
  {
    slug: "skm",
    company: "SKM Engineering",
    title: "Software Engineer",
    dates: "Jan 2021–Nov 2021",
    site: "https://skmeng.com/",
    intro:
      "Built operational UIs for water and wastewater management systems using Ignition SCADA.",
    stack: ["Ignition SCADA"],
    bullets: [
      "Built operational UIs for water and wastewater management systems using Ignition SCADA.",
    ],
    printBullets: [
      "Built operational UIs for water and wastewater management systems using Ignition SCADA.",
    ],
    sections: [],
  },
];
