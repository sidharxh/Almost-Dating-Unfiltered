# Almost — Unfiltered Dating

The Next.js site is in this directory. Approved confessions, reader interactions, story submissions, and guide requests use the existing Supabase project.

## Local development

1. Copy `.env.example` to `.env.local`.
2. Add the Supabase project URL and publishable key.
3. Run `npm install` and `npm run dev`.

The production deployment should use `next-app` as its project root and have the same two public Supabase variables configured for the production environment.

## Story cover images

Story submissions support one optional cover image stored in the public Supabase Storage bucket `confession-images`. The image is placed under a path containing the confession UUID and that path is saved on the matching confession row. Supported formats are JPEG, PNG, WebP, and AVIF, up to 5 MB. Apply `supabase/story_images.sql` to the Supabase project before deploying code that accepts image uploads.

Images keep their original file in Storage. Story cards and article pages fit the image to the available width, and selecting it opens the original image in a full-screen viewer.

## Routes

- `/` — homepage and guide download form
- `/confessions` — published story list
- `/confessions/[slug].html` — individual confession page
- `/categories` — category directory
- `/categories/[category]` — category story list
- `/submit-story` — anonymous story submission form
- `/sitemap.xml` and `/robots.txt` — search discovery
