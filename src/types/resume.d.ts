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

export interface Project {
  name: string;
  description: string;
  tags: string[];
  site?: string;
  github?: string;
}

export interface Reference {
  name: string;
  title: string;
  company: string;
  relationship?: string;
  email?: string;
  phone?: string;
}

export interface HomeEntry {
  label: string;
  /** HTML string (may contain <a>/<strong>); rendered via set:html. */
  bodyHtml: string;
}

export interface HomeContent {
  heroHeadline: string;
  /** HTML — narrative hero paragraph, may contain links. */
  heroSubHtml: string;
  /** Monospace meta line under the CTAs. */
  heroMeta: string;
  /** HTML paragraphs for the About section. */
  aboutParagraphsHtml: string[];
  /** Entry rows below About (Currently, Stack, Side, …). */
  entries: HomeEntry[];
}

export interface SocialLink {
  key: string;
  label: string;
  href: string;
  ariaLabel: string;
  svgPath: string;
}
