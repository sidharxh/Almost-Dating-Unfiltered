ALMOST WEBSITE PACKAGE

This package preserves the existing dark-purple Almost site, homepage, six fictional stories, category filters, SEO metadata, GA4 ID, favicon, sitemap, robots.txt, and Hinge Glow-Up Guide PDF. It adds a confession submission form, public pending-approval queue at admin.html, public approval, and categorical reactions.

BEFORE DEPLOYING
1. In Supabase, open SQL Editor and run supabase/setup.sql.
2. Confirm the project URL and publishable key in confessions.html and admin.html match your project. These are public browser values; never put a Supabase secret/service-role key in either file.
3. Upload the CONTENTS of this folder to the root of your GitHub Pages repository. Keep confessions/, assets/, and supabase/ folders intact.
4. Visit https://sidharxh.github.io/Almost-Dating-Unfiltered/confessions.html to submit a test confession, then visit /admin.html to approve it. Approved community stories appear in the archive dynamically; the original six story pages remain unchanged.

IMPORTANT SECURITY / PRODUCT NOTES
- The approval page is intentionally public: anyone who reaches it can approve a pending confession. This is exactly the selected policy and means it is not a private admin panel.
- No delete or reject controls are provided. The SQL revokes client DELETE access and grants only status-column updates, with the policy permitting pending -> approved. Database owners can still manage data from Supabase Dashboard.
- Public visitors can read pending submission content because the approval list is public. Tell submitters not to include names, contact information, or identifying details. Do not use this setup for sensitive or confidential submissions.
- Anonymous reactions are not strong anti-abuse verified votes. Browser localStorage reduces accidental repeat clicks, but can be bypassed. Add rate limiting / CAPTCHA through an Edge Function if abuse becomes an issue.
- This package uses the Supabase REST API directly and requires no build step or third-party JS library.
- GitHub Pages is static hosting. Supabase stores submissions; community-approved stories appear in the archive dynamically rather than creating a separate committed HTML page for each new story.
- After upload, wait for GitHub Pages deployment to complete. The archive requires the SQL setup to have run successfully before submission/approval works.

EXISTING CATEGORY SET (preserved)
First dates, Ghosting, Situationships, Dating disasters, Green flags, Breakups & exes, Secret crushes, LGBTQ+ dating, Intimacy & 18+.

All supplied archive stories are fictional/dramatized. The original Hinge PDF is at assets/hinge-glow-up-guide.pdf.
