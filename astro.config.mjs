import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://natemodi.com',
  integrations: [mdx()],
  output: 'static',
  server: {
    host: '0.0.0.0',
  },
});
