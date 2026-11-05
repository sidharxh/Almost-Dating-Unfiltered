# Quiz content and search review

Updated 5 November 2026. This review covers the repository and a local production build, not production indexing or search rankings.

## Positioning and voice

Almost offers short, free dating quizzes that help adults notice their habits in connection, texting, and first dates. The value is a relatable reflection, a strength, and one practical thing to try. Google sign-in unlocks complete results and sharing.

Use playful, concrete situations and warm, plain language. Avoid clinical labels, certainty about someone's personality, shame, compatibility predictions, and promises of dating success. A result describes answers today, not a permanent identity. Preferences and habits can change.

Homepage, navigation, directory, quiz landings, questions, results, About, waitlist, sign-in, and supporting copy use this positioning. Existing styling and layout are retained. Privacy and terms remain factual, not keyword landing pages.

Editorial inspiration: [Gottman relationship quizzes](https://www.gottman.com/blog/well-connect-emotionally-partner/), [Greater Good's relationship trust quiz](https://greatergood.berkeley.edu/quizzes/take_quiz/relationship_trust), and [Truity relationship quizzes](https://www.truity.com/view/tests/love-relationships). These informed accessible framing, not copied questions or scales. Their traffic or commercial performance was not audited.

## Research and its limits

- [Patrick et al., 2007](https://pubmed.ncbi.nlm.nih.gov/17352602/): autonomy and relatedness in relationships. Informs dating-style themes, not the four outcome categories.
- [Kruger et al., 2005](https://pubmed.ncbi.nlm.nih.gov/16393025/): overconfidence about communicating tone in email. Used cautiously as a reflection prompt for texting; it does not validate texting types.
- [Aron et al., 2000](https://pubmed.ncbi.nlm.nih.gov/10707334/): shared novel activities in existing couples. Does not establish an ideal first date or predict compatibility.
- [Roberts and Mroczek, 2008](https://pubmed.ncbi.nlm.nih.gov/19756219/): personality change in adulthood. Supports leaving room for change, not predicting a particular person's trajectory.

Questions, outcome names, and scoring are original and unvalidated. Each choice adds one point to its corresponding outcome; the highest total wins. Ties use the first tied outcome in the content definition. This limitation is explained on About. No clinical or diagnostic claims are made.

## Keyword focus

| Page | Primary intent | Supporting language |
| --- | --- | --- |
| `/` | free dating quizzes | dating habits, texting, first dates, self-reflection |
| `/quizzes` | choose a dating quiz | quiz collection, quick dating quizzes |
| `/quizzes/dating-energy` | dating style quiz | what is my dating style, dating energy quiz |
| `/quizzes/texting-vibe` | texting style quiz | what kind of texter are you, dating communication |
| `/quizzes/first-date-style` | first date quiz | ideal first date, first date style |
| `/about` | quiz research and scoring | how Almost quizzes work, limitations |

These are relevant search intents, not measured search-volume or difficulty estimates. Keep existing quiz URLs to preserve links.

## Short, adaptive quizzes

Dating style has 5 questions, texting has 4, and first-date style has 5. Each has one follow-up whose wording and options depend on the first answer. No branch adds extra questions. Changing an earlier answer clears subsequent answers so a changed prompt cannot inherit an unrelated choice. Version 2 uses a new session-storage key.

## SEO and answer discovery

- Public landing content is rendered as HTML before client JavaScript.
- Distinct page titles, descriptions, canonical URLs, and share previews.
- Homepage and directory link directly to every quiz.
- Plain descriptions answer what each quiz explores, its length, whether it is free, sign-in requirements, and limits.
- Visible source links and scoring explanation provide context for users and answer engines.
- WebSite, Organization, CollectionPage/ItemList, and Quiz structured data describe actual content. No invented reviews, FAQ answers, or scientific credentials.
- Sitemap includes the six primary public pages. Robots permits crawlers.
- Quiz players, account callbacks, waitlist, and result pages use noindex. Individual result outcomes are not separate search-acquisition pages; each quiz landing is the entry point.
- Separate 1200×630 previews for each quiz; result downloads remain portrait 1080×1920.
- No special AI-only file is necessary. [Google says its normal SEO practices apply to AI features](https://developers.google.com/search/docs/appearance/ai-features).

## Verification

`npm run build` succeeds. `node --test tests/scoring.test.mjs tests/seo.test.mjs` passes 13 checks including all 2,304 answer combinations, every adaptive branch, all reachable results, HTML metadata, structured data, sitemap, and robots.

Local HTTP checks cover preview/card status and dimensions, nonexistent route 404s, and noindex on play/results. Browser checks confirmed that changing the first answer changes the follow-up and clears stale answers, and completing the texting quiz leads to the expected outcome with the Google sign-in gate intact. No CSS files or dependencies were changed.

## After deployment

Submit `https://almostunfiltereddating.com/sitemap.xml` in Search Console and inspect the homepage and three quiz landing URLs. Monitor indexing, impressions, and queries before changing positioning again. Hosting firewall/crawler access and actual Google indexing are not established by local checks. Useful external mentions and genuine links can help discovery, but rankings and recommendations from Google, ChatGPT, or Claude are not guaranteed.

Google OAuth Production status is separate from the Vercel deployment and from brand verification. The supplied logo is `next-app/public/brand/almost-google-logo.png` (120×120 PNG). The latest supplied Google screenshot reports unverified homepage ownership. Verify the website in Search Console using an account associated with the Cloud project, wait the requested 24 hours, and resubmit branding. Google approval and the signed-in Cloud configuration are outside these code checks.

## Adding another quiz

Add an entry in `next-app/content/quizzes.ts` with a unique ID and slug, four results, short question list, copy, sources, and SEO fields. Option positions must match the four result positions in every branch. A follow-up must reference an earlier question. Increment `version` when questions/scoring change. The directory, landing route, previews, next-quiz link, structured data, and sitemap read this registry. Extend the count assertion in `tests/scoring.test.mjs` and run the build and checks before publishing.
