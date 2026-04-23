import type { CaseSection, Job, Project, Reference, SocialLink } from '../types/resume';

// ── Identity ──────────────────────────────────────────────────────────────────

export const resumeIdentity = {
  name: 'Scott Key',
  title: 'Senior Software Engineer',
  defaultDescription:
    'Scott Key — Senior Software Engineer. TypeScript, React, Node.js, Kubernetes. Remote.',
} as const;

// ── Social links ──────────────────────────────────────────────────────────────
// SVGs live here so icon, href, and label are always in sync.
// Access by key: resumeSocialLinks.github.href
// Access as array: Object.values(resumeSocialLinks)

export const resumeSocialLinks: Record<string, SocialLink> = {
  email: {
    key: 'email',
    label: 'me@scottkey.dev',
    href: 'mailto:me@scottkey.dev',
    ariaLabel: 'Email',
    svgPath:
      'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z',
  },
  linkedin: {
    key: 'linkedin',
    label: 'linkedin.com/in/scottdkey',
    href: 'https://linkedin.com/in/scottdkey',
    ariaLabel: 'LinkedIn',
    svgPath:
      'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  github: {
    key: 'github',
    label: 'github.com/scottdkey',
    href: 'https://github.com/scottdkey',
    ariaLabel: 'GitHub',
    svgPath:
      'M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z',
  },
  site: {
    key: 'site',
    label: 'scottkey.dev',
    href: 'https://scottkey.dev',
    ariaLabel: 'Website',
    svgPath:
      'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 0v20M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
  },
};

// ── Skills ────────────────────────────────────────────────────────────────────

export const resumeSkills = [
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'Fastify',
  'PostgreSQL',
  'Redis',
  'Kafka',
  'RabbitMQ',
  'Kubernetes',
  'GCP (GKE, Cloud SQL, GCS, Artifact Registry)',
  'AWS',
  'Docker',
  'Stripe',
  'Shopify',
] as const;

// ── Experience ────────────────────────────────────────────────────────────────

export type { CaseSection, Job, Project, Reference } from '../types/resume';

export const jobs: Job[] = [
  {
    slug: 'rebuy',
    company: 'Rebuy',
    title: 'Senior Software Engineer',
    dates: 'May 2024–present',
    site: 'https://rebuy.app',
    intro:
      "One of two engineers who started Rebuy.app, Rebuy's greenfield commerce platform. Primary engineer across every surface: merchant dashboard, customer checkout, the Fastify API, Payouts, and the tooling layer underneath.",
    stack: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Fastify',
      'Kysely',
      'PostgreSQL',
      'Tailwind',
      'Stripe',
      'Shopify',
      'Kubernetes',
      'GCP',
    ],
    bullets: [
      "One of two engineers who started <a href='https://rebuy.app' target='_blank' rel='noopener noreferrer'>Rebuy.app</a>, Rebuy's greenfield commerce platform. Primary engineer across every surface.",
      '<strong>Payouts (author):</strong> End-to-end financial feature — Stripe integration, idempotency keys, ledger reconciliation, exactly-once guarantees, append-only audit log.',
      '<strong>Carl (author):</strong> Unified dev CLI orchestrating ~18 containers across 5 Docker Compose stacks, 3 Node dev servers, Cloudflare Tunnel, live GKE contexts. 3-command onboarding. 10 command categories, ~25 scripts.',
      '<strong>@rebuy/tributary (author):</strong> OpenAPI → TypeScript code generator producing typed fetchers, Zod schemas, React Query hooks, and a Next.js-aware proxy. Eliminates API-client drift. Private npm (GCP Artifact Registry).',
      '<strong>Shopify-embeddable (author):</strong> React/Vite widget embedded in merchant Shopify themes via Liquid. Same-origin proxy, passthrough auth, semver versioning, GCS asset hosting.',
      '<strong>@rebuy/ice-age:</strong> Kysely migration framework — transaction guards, interactive schema visualizer (Preact, pan/zoom, drift detection, multi-service federation).',
      "Led <a href='https://rebuy.app' target='_blank' rel='noopener noreferrer'>rebuy.app</a> upgrade to Next.js 16 + React 19 in production. Running React Compiler in prod. Primary CI/CD author (Bitbucket Pipelines + GKE/Helm).",
    ],
    printBullets: [
      "One of two founding engineers on Rebuy.app, Rebuy's greenfield B2B commerce platform. Primary engineer across every surface: merchant dashboard, customer checkout, Fastify API, Payouts system, and the internal tooling layer.",
      "<strong>Payouts (owner):</strong> Designed and built the end-to-end payout system from scratch — Stripe Connect integration, idempotency keys to prevent double-pays, ledger reconciliation against Stripe's API, exactly-once guarantees via pre-transfer invariant guards, and an append-only audit log. Architected for reuse across the wider Rebuy platform.",
      '<strong>Carl CLI (author):</strong> Unified developer CLI that orchestrates ~18 containers across 5 Docker Compose stacks, 3 bare-metal Node servers, a Cloudflare Tunnel, Caddy reverse proxy, Stripe listener, and live GKE kubectl contexts. New engineer onboarding: 3 commands. Also owns vulnerability scanning, Helm/GKE deploys, and the E2E test runner.',
      '<strong>@rebuy/tributary (author):</strong> Internal OpenAPI-to-TypeScript code generator. One command produces typed fetchers, Zod schemas, React Query hooks, and a Next.js server/client proxy across four services — eliminating API-contract drift entirely. Published as a private npm package on GCP Artifact Registry.',
      "<strong>@rebuy/ice-age (maintainer):</strong> Inherited and extended Rebuy's Kysely migration framework — added transaction isolation guards, Pino logging, and an interactive schema visualizer (Preact + esbuild) with pan/zoom, FK mapping, drift detection, and multi-service federation.",
      '<strong>Shopify embeddable (author):</strong> React/Vite widget embedded into merchant Shopify themes via Liquid. Same-origin proxy eliminates CORS; Shopify passthrough auth via bod-shopify-connector. Versioned artifacts deployed to GCS.',
      'Primary CI/CD author (Bitbucket Pipelines + GKE/Helm). Led production upgrade to Next.js 16 + React 19 with React Compiler enabled in prod.',
    ],
    sections: [
      {
        id: 'payouts',
        heading: 'Payouts',
        paragraphs: [
          "End-to-end financial feature I built at <a href='https://rebuy.app' target='_blank' rel='noopener noreferrer'>rebuy.app</a>. Spans the admin console, the merchant store UI, and the Stripe integration for actual money movement — plus a full financial safety layer: idempotency keys so retries don't double-pay, reconciliation against Stripe's own ledger to catch drift, exactly-once guarantees, pre-transfer guards that block a payout when invariants don't hold, and an append-only audit log of every action.",
          'Designed for cross-company use on the wider Rebuy platform.',
        ],
      },
      {
        id: 'carl',
        heading: 'Carl CLI',
        paragraphs: [
          "Carl is the unified development CLI I authored for rebuy.app. It started as individual scripts I didn't want to lose and grew into the tool every engineer on the platform uses every day. `carl dev` orchestrates roughly 18 containers across 5 Docker Compose stacks — each service (bod-api, bod-shopify-connector, bod-accounts) has its own dedicated Postgres instance and migrator, plus workers, a Cloudflare Tunnel, a Caddy reverse proxy, a Stripe listener, a data seeder, and a test runner — plus three bare-metal Node dev servers and live kubectl contexts pointing at staging and prod.",
          'One command. Onboarding a new engineer is three commands: `git clone`, `carl init`, `carl dev`. Init handles Homebrew, direnv, 1Password CLI, version-manager detection, all five repo clones, and shell configuration. Beyond local dev, Carl owns vulnerability scanning, Helm-based GKE deploys, cluster access, integration and E2E test runners, and an OpenAPI validation pipeline. Ten command categories, ~25 scripts.',
        ],
      },
      {
        id: 'tributary',
        heading: '@rebuy/tributary',
        paragraphs: [
          'Tributary is an OpenAPI/GraphQL → TypeScript code generator I authored. It takes a spec and produces the entire consumer-side call stack — typed fetchers, Zod schemas, React Query hooks, and a Next.js-aware proxy that lets the same typed function run on either side of the server/client boundary without manual `use server`/`use client` plumbing.',
          "One change to the API, one command, and three separate client repos receive a fully-typed, runtime-validated update. It's the reason our four services don't drift. Private npm package on GCP Artifact Registry.",
        ],
      },
      {
        id: 'shopify',
        heading: 'Shopify-embeddable widget system',
        paragraphs: [
          "<a href='https://rebuy.app' target='_blank' rel='noopener noreferrer'>rebuy.app</a> ships the same customer checkout in two places: first-party on <a href='https://rebuy.app' target='_blank' rel='noopener noreferrer'>rebuy.app</a>, and embedded inside merchants' own Shopify storefronts. I authored the embeddable side — a React/Vite app that installs into merchant themes via Liquid and interacts with the API as if it were hosted on Rebuy's own domain.",
          'Same-origin proxy eliminates CORS; Shopify passthrough auth flows through bod-shopify-connector. Updates ship as semver-versioned artifacts to a Google Cloud Storage bucket — merchants pin the version they want in their theme config and update on their own schedule.',
        ],
      },
      {
        id: 'ice-age',
        heading: '@rebuy/ice-age — schema visualizer',
        paragraphs: [
          "I inherited ice-age, Rebuy's Kysely-based migration framework, and became a maintainer. I've added transaction guards, isolation-level support, Pino logging, and improved error handling.",
          "The piece I'm most proud of: an interactive schema visualizer authored end to end — a Preact client bundled with esbuild, invoked via `ice-age visualize`. It renders a pan/zoom diagram of the full DB schema with domain grouping, FK relationship mapping, drift detection, and multi-config federation so schemas from multiple services appear as tabs in one tool.",
        ],
      },
    ],
  },
  {
    slug: 'pluralsight',
    company: 'Pluralsight',
    title: 'Software Engineer, FinTech Team',
    dates: 'Nov 2021–Mar 2024',
    site: 'https://pluralsight.com',
    intro:
      "Worked on the B2B provisioning pipeline and financial tooling at Pluralsight's FinTech team — the layer between Salesforce, billing systems, and the platform, processing ~$9M/month in provisioning at peak.",
    stack: [
      'TypeScript',
      'React',
      'Next.js',
      'NestJS',
      'PostgreSQL',
      'Redis',
      'Kafka',
      'RabbitMQ',
      'Salesforce',
      'Stripe',
      'AWS',
      'Kubernetes',
    ],
    bullets: [
      'B2B provisioning pipeline (Entitlements API — NestJS middleware in the Salesforce → MuleSoft → platform chain) processing ~$9M/month at peak.',
      '<strong>SHAFT (author):</strong> Internal Next.js tool integrating Kafka, RabbitMQ, and Salesforce to surface provisioning discrepancies in real time for non-technical stakeholders.',
      'A Cloud Guru migration — payment methods, bulk account creation (10k+ accounts), account settings, billing data for thousands of customers.',
      'Billing system migrations: Chargebee → Stripe + Salesforce; Zuora → Stripe.',
    ],
    printBullets: [
      '<strong>Entitlements API:</strong> NestJS middleware in the Salesforce → MuleSoft → platform provisioning chain. Processed ~$9M/month in B2B license provisioning at peak load.',
      '<strong>SHAFT (author):</strong> Internal Next.js tool connecting Kafka streams, RabbitMQ, and Salesforce to surface provisioning discrepancies in real time for ~20 non-technical stakeholders — replacing engineer-only manual investigations with a self-serve interface.',
      '<strong>A Cloud Guru migration:</strong> Full billing and account migration following acquisition — payment method portability, bulk account creation (10k+ accounts), subscription mapping, and billing history migration for thousands of customers.',
      '<strong>Billing migrations:</strong> Two major platform migrations — Chargebee to Stripe + Salesforce, and Zuora to Stripe. Batch-migrated payment methods, subscription records, and billing data at scale with zero revenue loss.',
    ],
    sections: [
      {
        id: 'shaft',
        heading: 'SHAFT — Self Help App FinTech',
        paragraphs: [
          'SHAFT is an internal Next.js tool I authored at Pluralsight. It integrates Kafka streams, RabbitMQ streams, and Salesforce to surface provisioning discrepancies in real time — data mismatches between billing systems and customer records that would otherwise require an engineer to investigate and manually correct.',
          'SHAFT put that capability in the hands of ~20 non-technical stakeholders with specific financial permissions. I was the primary author and handed it to the team to iterate on.',
        ],
      },
      {
        id: 'acg',
        heading: 'A Cloud Guru migration',
        paragraphs: [
          "Contributed to the A Cloud Guru (ACG) migration following Pluralsight's acquisition — capturing and moving thousands of customers from ACG's systems into Pluralsight's internal platform. This included payment method migration, bulk account creation (10k+ accounts), account settings, and billing data migration.",
        ],
      },
      {
        id: 'billing',
        heading: 'Billing system migrations',
        paragraphs: [
          'Contributed to two major billing migrations: all Chargebee customers to Stripe + Salesforce, and all Zuora customers to Stripe. Batch migrations of customer billing records, payment methods, and subscription data at scale.',
        ],
      },
      {
        id: 'entitlements',
        heading: 'Entitlements API',
        paragraphs: [
          'The Entitlements API was a NestJS service that sat as a middleware layer in the Salesforce → MuleSoft → Entitlements → platform chain for B2B provisioning. At peak it handled ~$9M/month in provisioning requests.',
        ],
      },
    ],
  },
  {
    slug: 'skm',
    company: 'SKM Engineering',
    title: 'Software Engineer',
    dates: 'Jan 2021–Nov 2021',
    site: 'https://skmeng.com/',
    intro:
      'Built React UIs for industrial SCADA systems — sensor dashboards, alerting, and automation controls for city-scale infrastructure including the Logan, Utah water treatment plant.',
    stack: ['React', 'Python', 'Kotlin', 'Ignition SCADA', 'Java'],
    bullets: [
      'Built React UIs for industrial SCADA systems serving city-scale infrastructure.',
      'Logan, Utah water treatment plant: ~1,000 screens, tens of thousands of live data points, operator controls for automation flows.',
      'Built Ignition plugins in Kotlin (SFTP module) and authored development tooling from scratch for a polyglot environment (Java/Python/HTML/React).',
    ],
    printBullets: [
      'Software engineer at an industrial engineering consultancy. Built React UIs on top of Ignition SCADA for city-scale infrastructure clients — sensor dashboards, live alerting, and automation controls.',
      'Logan, Utah water treatment plant (most involved): ~1,000 operator screens with tens of thousands of live sensor data points. Primary interface for plant monitoring and automation control.',
      'Built development tooling from scratch for a polyglot environment (JVM/Python/HTML/React). Authored a compiled Kotlin SFTP plugin installed into production Ignition systems.',
    ],
    sections: [
      {
        id: 'the-work',
        heading: 'React on top of industrial infrastructure',
        paragraphs: [
          'SKM Engineering is an industrial engineering consultancy. I built the software layer on top of the SCADA systems their engineers designed — working directly with multiple clients to understand what operators needed and translating that into working interfaces.',
          'The stack was polyglot by necessity: Ignition SCADA runs on the JVM, scripting is Python, and the frontend is HTML/CSS/JS with React components injected into the environment. Nothing was built for modern web tooling. Every development workflow I wanted required building it from scratch. I also built a compiled Kotlin SFTP plugin — installed directly into client Ignition systems — that became part of the standard deployment.',
        ],
      },
      {
        id: 'logan',
        heading: 'Logan Water Treatment Plant',
        paragraphs: [
          'The most involved project was the Logan, Utah water treatment plant — a full SCADA front-end serving as the primary operator interface for the facility. Roughly 1,000 screens backed by tens of thousands of individual data points. Operators used it for everything: live sensor readouts, plant-wide alerting, UI animations that reflected actual physical state, and controls for the automation flows managing the treatment process itself.',
          "At that scale, the display layer has real operational weight. The right data needs to be visible at a glance, alerts need to surface without noise, and controls need to be trustworthy. I implemented across the full stack — from individual sensor readout panels up through the automation control interfaces. Systems went live and were handed off to the city's own engineering teams for ongoing operations.",
        ],
      },
      {
        id: 'tooling',
        heading: 'Building tooling for an environment that had none',
        paragraphs: [
          "Ignition wasn't designed for component-based development. Getting React components into the stack required building the injection pipeline myself. Getting any kind of consistent build and deploy workflow required learning and extending the Ignition plugin system — a process that ended with me shipping a Kotlin plugin with its own build toolchain.",
          'Each client integration was a fresh challenge — different hardware, different PLC configurations, different operational requirements. The job was as much infrastructure and tooling work as it was UI development.',
        ],
      },
    ],
  },
];

// ── Notable projects ───────────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    name: 'Carl CLI',
    description:
      'Unified dev CLI for rebuy.app. Orchestrates ~18 containers, 5 stacks, 3 dev servers. One command to start everything.',
    tags: ['TypeScript', 'Docker', 'Kubernetes'],
  },
  {
    name: '@rebuy/tributary',
    description:
      'OpenAPI → TypeScript code generator. Typed fetchers, Zod schemas, React Query hooks, Next.js-aware proxy. Eliminates API drift across the service mesh.',
    tags: ['TypeScript', 'OpenAPI', 'Code gen'],
  },
  {
    name: 'Payouts',
    description:
      'End-to-end financial feature at rebuy.app. Stripe integration, idempotency keys, ledger reconciliation, exactly-once guarantees, append-only audit log.',
    tags: ['Stripe', 'Fastify', 'PostgreSQL'],
  },
  {
    name: 'Shopify Widget',
    description:
      'React/Vite checkout embedded in merchant Shopify themes via Liquid. Same-origin proxy, passthrough auth, semver versioning, GCS asset hosting.',
    tags: ['React', 'Shopify', 'GCS'],
  },
  {
    name: 'Entitlements',
    description:
      'B2B subscription entitlement engine at Pluralsight. Processed ~$9M/month in provisioning events across Kafka and RabbitMQ. Reconciled plan state against Salesforce and downstream billing systems with exactly-once guarantees.',
    tags: ['Node.js', 'Kafka', 'RabbitMQ', 'PostgreSQL', 'Salesforce'],
  },
  {
    name: 'SHAFT',
    description:
      'Internal Next.js tool at Pluralsight. Integrated Kafka, RabbitMQ, and Salesforce to surface provisioning discrepancies for non-technical stakeholders.',
    tags: ['Next.js', 'Kafka', 'RabbitMQ', 'Salesforce'],
  },
  {
    name: 'Bardbase',
    description:
      'Multi-edition Shakespeare reader with lexicon, cross-edition alignment, and reference works. Covers 37 plays across five editions (First Folio 1623, Globe 1864, Folger, Standard Ebooks, Moby) with side-by-side comparison and word-level reference hovers. Built on SQLite, Go, and SvelteKit. PWA with offline capability.',
    tags: ['Go', 'SvelteKit', 'SQLite', 'Railway', 'Cloudflare'],
    site: 'https://bardbase.scottkey.dev',
    github: 'https://github.com/scottdkey/bardbase',
  },
  {
    name: 'Halvor',
    description:
      'Home automation infrastructure project — a self-hosted platform for home automation built on Proxmox, OPNsense, and containerized services. Covers network segmentation, NAS configuration, LXC/VM provisioning, and service orchestration. Private repo; guides and writeups published at /til.',
    tags: ['Proxmox', 'OPNsense', 'Docker', 'Networking'],
  },
];

// ── References ────────────────────────────────────────────────────────────────
// Loaded from the RESUME_REFERENCES env var (JSON array).
// Set it in .env locally or as a Cloudflare secret in production.
// Schema: [{ name, title, company, relationship?, email?, phone? }]

export const references: Reference[] = (() => {
  const raw = import.meta.env.RESUME_REFERENCES;
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Reference[];
  } catch {
    console.warn('RESUME_REFERENCES is not valid JSON — skipping references section');
    return [];
  }
})();
