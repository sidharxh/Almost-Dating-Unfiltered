# Almost Next.js app

This app lives beside the current static site in the same Git repository. The existing site remains untouched while the new experience is developed.

## Local development

```sh
cd next-app
npm install
npm run dev
```

## Current direction

- A single reusable confession story page, designed from scratch.
- The page centers on text-only, story-specific AI roleplay for adults.
- Story submitters provide only a title and description. Readers choose their roleplay gender/perspective when they start; the AI uses the story to play the other role.
- Story discovery uses one primary category per story plus narrower topic tags. The current category taxonomy is in `lib/categories.ts`.
- Roleplay boundaries: adult and non-explicit.
- The submission form prototype asks writers only for a title and description; readers choose their roleplay perspective later.
- The roleplay interest button stores a privacy-minimal row in `story_roleplay_interest_clicks`: story slug, story category, selected perspective, and click timestamp. It does not collect a name or email.
- AI credentials belong in server-side Vercel environment variables. Never put a provider key in a `NEXT_PUBLIC_` variable or commit it.

## Progress

- [x] Create a separate Next.js app inside this repository.
- [x] Add the first reusable story-page experience prototype using temporary sample content.
- [x] Route story pages through one data-driven template and generate story-specific metadata.
- [x] Make a first refinement pass on roleplay-first flow and adult confirmation.
- [x] Show a coming-soon dialog when readers request roleplay and record their interest in Supabase.
- [x] Ask readers which gender perspective they want to roleplay; story writers do not configure roles.
- [ ] Review the visual direction and copy together before treating the design as final.
- [x] Simplify story submission to only a title and description; roleplay details are not requested from writers.
- [ ] Connect the submission form to secure storage and moderation after its design is reviewed.
- [ ] Connect published story content without restoring the legacy story pages.
- [ ] Build the roleplay chat API, moderation, abuse limits, and persistent session model.
- [ ] Choose an AI provider and configure its key only in Vercel server-side environment variables.
- [ ] Migrate remaining site pages and preserve required URLs and SEO.
- [ ] Deploy to Vercel and switch the domain only after review.

The scaffold does not replace the live GitHub Pages site. When the app is ready, configure Vercel's project root as `next-app` and switch the domain only after reviewing the production deployment.
