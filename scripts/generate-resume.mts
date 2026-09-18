import { writeFileSync, readFileSync } from 'node:fs';
import { generateResume } from '../src/lib/generateResume.ts';
import type { Reference } from '../src/types/resume.js';

// Load .env for local CLI use
try {
  for (const line of readFileSync('.env', 'utf8').split('\n')) {
    const eq = line.indexOf('=');
    if (eq < 1 || line.startsWith('#')) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    val = val.replace(/^['"'\u2018\u2019\u201C\u201D]|['"'\u2018\u2019\u201C\u201D]$/g, '');
    if (key && !(key in process.env)) process.env[key] = val;
  }
} catch {}

const raw = process.env.RESUME_REFERENCES;
const references: Reference[] = raw
  ? JSON.parse(raw.replace(/^['\u2018\u2019\u201C\u201D]|['\u2018\u2019\u201C\u201D]$/g, ''))
  : [];
const phone = process.env.PHONE_NUMBER;

const bytes = await generateResume({ references, phone });
writeFileSync('scott-key-resume.pdf', bytes);
console.log('Generated: scott-key-resume.pdf');
