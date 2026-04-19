import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import cloudflare from '@astrojs/cloudflare';
import rehypeMermaid from 'rehype-mermaid';

export default defineConfig({
  output: 'static',
  adapter: cloudflare(),
  integrations: [mdx()],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  markdown: {
    rehypePlugins: [rehypeMermaid],
  },
});
