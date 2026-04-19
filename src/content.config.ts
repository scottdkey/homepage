import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const sharedSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  pubDate: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

const til = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/til' }),
  schema: sharedSchema,
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: sharedSchema,
});

export const collections = { til, notes };
