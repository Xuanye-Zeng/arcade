import adapter from '@sveltejs/adapter-static';

// Every page is static, so the whole site is prerendered to plain HTML.
// BASE_PATH lets the same build work at a domain root (Netlify, Vercel) and
// under a repository subpath (GitHub Pages sets it to /arcade).
const base = process.env.BASE_PATH ?? '';

/** @type {import('@sveltejs/kit').Config} */
export default {
  kit: {
    adapter: adapter({ fallback: '404.html' }),
    paths: { base },
    alias: {
      $components: 'src/lib/components',
      $data: 'src/lib/data',
      $state: 'src/lib/state'
    }
  }
};
