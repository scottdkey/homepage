# scottkey.dev

Personal site and portfolio at [scottkey.dev](https://scottkey.dev). Built with Astro, deployed to Cloudflare Workers.

## Stack

- **[Astro v6](https://astro.build)** — static site generator with islands architecture. Most pages pre-render at build time; API routes run as Cloudflare Workers.
- **[Cloudflare Workers](https://workers.cloudflare.com)** — SSR adapter for dynamic routes (`/api/contact`, `/api/resume.pdf`).
- **[MDX](https://mdxjs.com)** — markdown with components, used for the TIL section.
- **pdf-lib** — PDF generation, used for the resume endpoint and the local generation script.
- **Resend** — transactional email for the contact form.

## Site structure

```
src/
├── pages/
│   ├── index.astro          # Home / hero
│   ├── projects/            # Work history — index + detail pages per job
│   ├── til/                 # Today I Learned — markdown articles
│   ├── notes/               # Notes section
│   └── api/
│       ├── contact.ts       # POST → Resend email (SSR, Cloudflare Worker)
│       └── resume.pdf.ts    # GET → live PDF resume (SSR, Cloudflare Worker)
├── content/
│   └── til/                 # MDX source files, organized by topic
├── data/
│   ├── work.ts              # Source of truth for all job history, bullets, and case studies
│   ├── config.ts            # Site-wide flags (activelyLooking, etc.)
│   ├── references.ts        # References for the live resume endpoint
│   └── nav.ts               # Navigation items
├── components/              # Astro components
├── layouts/                 # Page shell layouts
└── styles/                  # CSS tokens, global styles, fonts
scripts/
└── generate-resume.ts       # Local PDF generator (reads from .env)
```

## How content works

**Work history** lives in `src/data/work.ts` as a typed array of jobs. Each job has `bullets` (for the web resume view), `printBullets` (tighter copy for the PDF), and `sections` (expanded case study content for the project detail page). Editing that file updates the projects page, the resume view, and both PDF renderers simultaneously.

**TIL articles** are MDX files under `src/content/til/`, organized into topic subdirectories. The slug is derived from the file path.

**The resume** is available two ways:

- `/projects?view=resume` — web view, rendered from `work.ts`
- `/api/resume.pdf` — server-rendered PDF via Cloudflare Worker, generated on request

## Local development

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:4321`. Use `--force` to bypass Astro's cache if content changes aren't reflecting:

```bash
npm run dev -- --force
```

## Generating a PDF resume locally

The script reads from `.env` in the project root. Set these variables:

```
PHONE_NUMBER=+1 (555) 000-0000
RESUME_REFERENCES='[{"name":"...","title":"...","company":"...","relationship":"...","email":"...","phone":"..."}]'
```

Then run:

```bash
npm run generate:resume
```

Outputs `scott-key-resume.pdf` in the project root.

## Building and deploying

Build:

```bash
npm run build
```

Deploy to Cloudflare Workers:

```bash
npx wrangler deploy --config dist/server/wrangler.json
```

## Environment variables

| Variable            | Where used                   | Notes                                                              |
| ------------------- | ---------------------------- | ------------------------------------------------------------------ |
| `RESEND_API_KEY`    | `src/pages/api/contact.ts`   | Required for contact form                                          |
| `PHONE_NUMBER`      | `scripts/generate-resume.ts` | Local PDF only — not exposed to the live endpoint                  |
| `RESUME_REFERENCES` | `scripts/generate-resume.ts` | Local PDF only — live endpoint reads from `src/data/references.ts` |

## Config flags

`src/data/config.ts` controls site-wide behavior:

```ts
export const siteConfig = {
  activelyLooking: true, // shows/hides job-search language across the site
};
```

Flip `activelyLooking` to `false` once landed — removes all hiring signals from the public site without touching copy.
