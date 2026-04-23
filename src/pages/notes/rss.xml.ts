import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { resumeIdentity, resumeSocialLinks } from '../../data/resume';

const SITE = resumeSocialLinks.site.href;

export async function GET(_ctx: APIContext) {
  const posts = await getCollection('notes', ({ data }) => !data.draft);
  posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  const items = posts
    .map((post) => {
      const url = `${SITE}/notes/${post.id}`;
      const date = post.data.pubDate.toUTCString();
      const desc = post.data.description
        ? `<description>${esc(post.data.description)}</description>`
        : '';
      const cats = (post.data.tags ?? []).map((t) => `<category>${esc(t)}</category>`).join('');
      return `<item><title>${esc(post.data.title)}</title><link>${url}</link><guid>${url}</guid><pubDate>${date}</pubDate>${desc}${cats}</item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(resumeIdentity.name)} — Notes</title>
    <link>${SITE}/notes</link>
    <description>Writing on software, systems, and whatever else.</description>
    <language>en-us</language>
    <atom:link href="${SITE}/notes/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}

function esc(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
