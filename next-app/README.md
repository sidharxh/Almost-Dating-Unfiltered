# Almost — Unfiltered Dating

The Next.js application is in this directory. Run `npm install` and `npm run dev` to work locally. For release checks, run `npm run build` then `node --test tests/scoring.test.mjs tests/seo.test.mjs` (the SEO checks inspect the built HTML). Quiz content and scoring are versioned in `content/quizzes.ts` and `lib/scoring.ts`; adaptive wording is resolved by `lib/quiz-flow.ts`.

See `../docs/quiz-content-and-search.md` for the current positioning, research sources, search topics, verification scope, and instructions for adding a quiz.

See `../docs/removal-manifest.md` and `../docs/rebuild-status.md` for the data boundary, verified deployment, and release blockers. Google sign-in and analytics require the setup and checks described in that document.
