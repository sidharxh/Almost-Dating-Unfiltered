ALMOST WEBSITE UPDATE — FULL ZIP

Contents: full static website, homepage, confessions archive, 15 story pages, moderation notice, PDF guide, sitemap/robots/favicon, and Supabase SQL.

DESIGN / FLOW
- Preserves the existing Almost site structure and content. Purple remains the primary color; pink is a restrained accent.
- The free guide CTA opens an email popup. The PDF download is triggered only after Supabase confirms the email lead was saved. If the insert fails, the download does not happen and an error is shown.
- Each static page load sends GA4's standard `page_view` with page_title, page_location, and page_path. All buttons and links are tracked by `ui_click` with element_text, element_id, element_class, element_type, page_title, page_path, and link_url. Form fields themselves are not tracked.
- Approved community submissions appear in the archive, but they do not have their own indexable URL. To publish a story for search, create an editorial static page with the helper below.

DEPLOY
1. Unzip this folder and upload/commit its contents to the root of the existing GitHub Pages repository, replacing files with matching paths. Do not upload the ZIP itself.
2. In Supabase SQL Editor, run `supabase/setup.sql`. It is safe to rerun and updates existing policies as well as setting up the confession workflow and `guide_leads` table.
3. Check the Supabase Table Editor for `guide_leads` after submitting a test email.
4. Test the popup with a valid email. Confirm the email row is created before the PDF downloads. Try a deliberately invalid email and verify no download.
5. In GA4 > Admin > Data display > Events (labels may vary), `ui_click` should appear after traffic arrives. Use Realtime and Tag Assistant while testing. Standard reports may take 24–48 hours.

PUBLISH A STATIC CONFESSION
1. Copy `scripts/confession.example.json` to a new JSON file and fill in the approved story's slug, title, category, accurate short description, publication date, and paragraphs.
2. Run `python3 scripts/publish_confession.py path/to/story.json` from the repository root.
3. Review the generated `confessions/<slug>.html`, archive card, and sitemap entry, then commit and push. GitHub Pages will serve the new static page after deployment.
4. Keep the title and description accurate and specific; a category is a reader-facing topic label, not a list of keywords. Every story gets its own canonical URL, description, Open Graph metadata, and Article structured data.

GA4
Measurement ID: G-WWJH2R0QS6. Do not add a second Google tag. Guide events are `guide_popup_open`, `guide_form_submit`, `generate_lead` (only after Supabase success), `guide_download`, and `form_error`. Story clicks use `story_open` with a slug and category; email addresses and story titles are not sent to GA4. Validate events in Tag Assistant and GA4 DebugView before relying on reports.

SECURITY / PRIVACY NOTES
- Only the Supabase publishable key belongs in browser code. Never use a service-role/secret key in this static site.
- Public visitors can submit, read, and approve confessions from `admin.html`. Pending stories are visible to anyone. Public clients can change only `status` from `pending` to `approved`; they cannot edit story text or delete rows. Review the queue before approving.
- Email requests can be inserted anonymously and cannot be read or modified through the public API. Add a full privacy policy and spam protection before collecting meaningful volumes of email addresses. The Hinge PDF remains publicly accessible by its static URL, so the email step is a UX gate, not file access control.

Google may choose its own search title or snippet and does not guarantee indexing or ranking. Submit the sitemap in Google Search Console after publishing. Live Supabase inserts, browser download behavior, and GA4 reporting require testing in your deployed site/account.
