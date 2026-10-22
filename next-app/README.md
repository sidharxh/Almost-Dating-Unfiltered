# Almost — Unfiltered Dating

The Next.js site is in this directory. Approved confessions, reader interactions, story submissions, and guide requests use the existing Supabase project.

## Local development

1. Copy `.env.example` to `.env.local`.
2. Add the Supabase project URL and publishable key.
3. Run `npm install` and `npm run dev`.

The production deployment should use `next-app` as its project root and have the same two public Supabase variables configured for the production environment.

## Routes

- `/` — homepage and guide download form
- `/confessions` — published story list
- `/confessions/[slug].html` — individual confession page
- `/categories` — category directory
- `/categories/[category]` — category story list
- `/submit-story` — anonymous story submission form
- `/sitemap.xml` and `/robots.txt` — search discovery
