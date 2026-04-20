import { writeFileSync } from 'node:fs';
import { PDFDocument, rgb, StandardFonts, PDFString } from 'pdf-lib';
import { jobs } from '../src/data/work.ts';

interface Reference {
  name: string;
  title: string;
  company: string;
  relationship?: string;
  email?: string;
  phone?: string;
}

const SKILLS = [
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
];

function sanitize(s: string): string {
  return s
    .replace(/→/g, '->')
    .replace(/←/g, '<-')
    .replace(/↓/g, 'v')
    .replace(/↑/g, '^')
    .replace(
      /[^\u0000-\u00FF\u0152\u0153\u0160\u0161\u0178\u017D\u017E\u0192\u02C6\u02DC\u2013\u2014\u2018\u2019\u201A\u201C\u201D\u201E\u2020\u2021\u2022\u2026\u2030\u2039\u203A\u20AC\u2122]/g,
      ''
    );
}

function stripHtml(html: string): string {
  return html.replace(/<strong>(.*?)<\/strong>/g, '$1').replace(/<[^>]+>/g, '');
}

function splitBullet(raw: string): [string, string] {
  const m = raw.match(/^<strong>(.*?)<\/strong>:?(.*)/s);
  if (m) return [m[1].replace(/:$/, '').trim(), (m[2] ?? '').replace(/^\s*:?\s*/, '').trim()];
  return ['', stripHtml(raw)];
}

function wrapWords(
  text: string,
  font: Awaited<ReturnType<PDFDocument['embedFont']>>,
  size: number,
  maxW: number
): string[] {
  const words = sanitize(text).split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const candidate = cur ? `${cur} ${w}` : w;
    if (cur && font.widthOfTextAtSize(candidate, size) > maxW) {
      lines.push(cur);
      cur = w;
    } else {
      cur = candidate;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

const raw = process.env.RESUME_REFERENCES;
const references: Reference[] = raw ? JSON.parse(raw) : [];

const doc = await PDFDocument.create();
const page = doc.addPage([612, 792]);

const reg = await doc.embedFont(StandardFonts.Helvetica);
const bold = await doc.embedFont(StandardFonts.HelveticaBold);
const ital = await doc.embedFont(StandardFonts.HelveticaOblique);

const ML = 50;
const W = 512;
const BOTTOM = 45;
const BLACK = rgb(0.07, 0.07, 0.07);
const GRAY = rgb(0.38, 0.38, 0.38);
const MGRAY = rgb(0.55, 0.55, 0.55);
const LINK = rgb(0.1, 0.43, 0.63);

let y = 752;

function draw(text: string, x: number, yy: number, font: typeof reg, size: number, color = BLACK) {
  if (yy < BOTTOM) return;
  page.drawText(sanitize(text), { x, y: yy, size, font, color });
}

function hline(yy: number, thick = 0.6, color = MGRAY) {
  if (yy < BOTTOM) return;
  page.drawLine({ start: { x: ML, y: yy }, end: { x: ML + W, y: yy }, thickness: thick, color });
}

function rightDraw(
  text: string,
  rightX: number,
  yy: number,
  font: typeof reg,
  size: number,
  color = GRAY
): number {
  const w = font.widthOfTextAtSize(sanitize(text), size);
  draw(text, rightX - w, yy, font, size, color);
  return rightX - w;
}

function linkAnnot(url: string, x: number, yy: number, w: number, h: number) {
  const annot = doc.context.obj({
    Type: 'Annot',
    Subtype: 'Link',
    Rect: [x, yy - 2, x + w, yy + h + 1],
    Border: [0, 0, 0],
    A: doc.context.obj({ Type: 'Action', S: 'URI', URI: PDFString.of(url) }),
  });
  page.node.addAnnot(doc.context.register(annot));
}

function section(label: string) {
  y -= 14;
  draw(label, ML, y, bold, 7, MGRAY);
  y -= 5;
  hline(y, 0.5);
  y -= 10;
}

// Header
const headerTopY = y;
draw('Scott Key', ML, y, bold, 22, BLACK);
draw('Senior Software Engineer', ML, y - 18, reg, 9, GRAY);

const contactItems = [
  { label: 'me@scottkey.dev', url: 'mailto:me@scottkey.dev' },
  { label: 'linkedin.com/in/scottdkey', url: 'https://linkedin.com/in/scottdkey' },
  { label: 'github.com/scottdkey', url: 'https://github.com/scottdkey' },
  { label: 'scottkey.dev', url: 'https://scottkey.dev' },
];
const CONTACT_LINE_H = 12;
contactItems.forEach(({ label, url }, i) => {
  const cy = headerTopY - i * CONTACT_LINE_H;
  const x = rightDraw(label, ML + W, cy, reg, 8.5, LINK);
  linkAnnot(url, x, cy, reg.widthOfTextAtSize(sanitize(label), 8.5), 8.5);
});

const contactBottomY = headerTopY - (contactItems.length - 1) * CONTACT_LINE_H;
const leftBottomY = headerTopY - 18 - 9;
y = Math.min(leftBottomY, contactBottomY) - 10;
hline(y, 1.5, BLACK);
y -= 2;

// Skills
section('SKILLS');
const skillLines = wrapWords(SKILLS.join(' / '), reg, 8.5, W);
skillLines.forEach((sl) => {
  draw(sl, ML, y, reg, 8.5, GRAY);
  y -= 12;
});

// Experience
section('EXPERIENCE');
for (const job of jobs) {
  if (y < BOTTOM + 40) break;
  const companyW = bold.widthOfTextAtSize(sanitize(job.company), 10.5);
  draw(job.company, ML, y, bold, 10.5, LINK);
  linkAnnot(`https://scottkey.dev/projects/${job.slug}`, ML, y, companyW, 10.5);
  rightDraw(job.dates, ML + W, y, reg, 8.5, MGRAY);
  y -= 14;
  draw(job.title, ML, y, ital, 9, GRAY);
  y -= 13;
  for (const raw of job.printBullets) {
    if (y < BOTTOM + 12) break;
    const [label, rest] = splitBullet(raw);
    const INDENT = ML + 12;
    const WRAP_X = ML + 18;
    const WRAP_W = W - 18;
    const LINE_H = 11;
    draw('\u2022', ML + 3, y, reg, 8, MGRAY);
    if (label) {
      const labelStr = label + ': ';
      const labelW = bold.widthOfTextAtSize(sanitize(labelStr), 8.5);
      const avail = WRAP_W - (INDENT - ML) - labelW;
      const firstLines = wrapWords(rest, reg, 8.5, avail > 80 ? avail : WRAP_W);
      const firstLine = firstLines[0] ?? '';
      draw(labelStr, INDENT, y, bold, 8.5, BLACK);
      if (firstLine) draw(firstLine, INDENT + labelW, y, reg, 8.5, GRAY);
      y -= LINE_H;
      const used = firstLine.length;
      const leftover = sanitize(rest).slice(used).trim();
      if (leftover) {
        wrapWords(leftover, reg, 8.5, WRAP_W).forEach((l) => {
          if (y < BOTTOM) return;
          draw(l, WRAP_X, y, reg, 8.5, GRAY);
          y -= LINE_H;
        });
      }
    } else {
      const plain = stripHtml(raw);
      const lines = wrapWords(plain, reg, 8.5, WRAP_W);
      draw(lines[0] ?? '', INDENT, y, reg, 8.5, GRAY);
      y -= LINE_H;
      lines.slice(1).forEach((l) => {
        if (y < BOTTOM) return;
        draw(l, WRAP_X, y, reg, 8.5, GRAY);
        y -= LINE_H;
      });
    }
    y -= 2;
  }
  y -= 8;
}

// References
if (references.length > 0 && y > BOTTOM + 60) {
  section('REFERENCES');
  const PAIR_W = W / 2 - 8;
  const GAP = 16;
  const CONTACT_OFFSET = PAIR_W * 0.52 + 8;
  const ROW_H = 56;
  references.forEach((ref, i) => {
    if (y < BOTTOM + 50) return;
    const col = i % 2;
    const rx = ML + col * (PAIR_W + GAP);
    if (col === 0 && i > 0) y -= 10;
    draw(ref.name, rx, y, bold, 9, BLACK);
    draw(ref.title, rx, y - 13, ital, 8, GRAY);
    draw(ref.company, rx, y - 25, reg, 8, GRAY);
    const cx = rx + CONTACT_OFFSET;
    if (ref.relationship) draw(ref.relationship, cx, y, reg, 8, MGRAY);
    if (ref.email) {
      const ew = reg.widthOfTextAtSize(sanitize(ref.email), 8);
      draw(ref.email, cx, y - 13, reg, 8, LINK);
      linkAnnot(`mailto:${ref.email}`, cx, y - 13, ew, 8);
    }
    if (ref.phone) draw(ref.phone, cx, y - 25, reg, 8, MGRAY);
    if (col === 1 || i === references.length - 1) y -= ROW_H;
  });
}

const bytes = await doc.save();
writeFileSync('scott-key-resume.pdf', bytes);
console.log('Generated: scott-key-resume.pdf');
