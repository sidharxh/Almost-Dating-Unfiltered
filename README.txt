ALMOST WEBSITE UPDATE — FULL ZIP

Contents: full static website, homepage, confessions archive, 15 story pages, admin moderation page, PDF guide, sitemap/robots/favicon, and Supabase SQL.

DESIGN / FLOW
- Preserves the existing Almost site structure and content. Purple remains the primary color; pink is a restrained accent.
- The free guide CTA opens an email popup. The PDF download is triggered only after Supabase confirms the email lead was saved. If the insert fails, the download does not happen and an error is shown.
- All buttons and links are tracked by GA4 event `ui_click` with element_text, element_id, element_class, element_type, page_path, and link_url. Form fields themselves are not tracked.

DEPLOY
1. Unzip this folder and upload/commit its contents to the root of the existing GitHub Pages repository, replacing files with matching paths. Do not upload the ZIP itself.
2. In Supabase SQL Editor, run `supabase/setup.sql` once. It includes confession workflow tables/policies and the guide_leads email table/policies.
3. Check the Supabase Table Editor for `guide_leads` after submitting a test email.
4. Test the popup with a valid email. Confirm the email row is created before the PDF downloads. Try a deliberately invalid email and verify no download.
5. In GA4 > Admin > Data display > Events (labels may vary), `ui_click` should appear after traffic arrives. Use Realtime and Tag Assistant while testing. Standard reports may take 24–48 hours.

GA4
Measurement ID: G-WWJH2R0QS6. Do not add a second Google tag. `ui_click` is a custom event; it can take time to appear in reports. To make it a key event, mark it as a key event in GA4 only if you actually want every click counted as a conversion. Usually track high-value actions separately instead (e.g. `hinge_guide_download`, `confession_submit`, `confession_open`).

SECURITY / PRIVACY NOTES
- Only the Supabase publishable key belongs in browser code. Never use a service-role/secret key in this static site.
- A public email lead form needs spam protection and a privacy notice before production use. The current RLS is designed for anonymous inserts; it does not validate email ownership.
- The admin moderation page is a public prototype if no authentication is configured. Do not treat it as secure private moderation until access is protected.

The ZIP was assembled and structurally checked locally. Live Supabase insert, browser download, and GA4 reporting require testing in your deployed site/account.
