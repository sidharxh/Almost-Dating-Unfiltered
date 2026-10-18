ALMOST HINGE GUIDE EMAIL GATE PATCH

Upload/replace confessions.html and every HTML file inside confessions/ with the matching files in this patch. Keep all other site files.

Before testing, open Supabase Dashboard > SQL Editor and run supabase/guide_leads.sql. This creates the new guide_leads table.

The guide form requires a valid email, saves it to guide_leads with the page path, and only then triggers the PDF download. The public key is a publishable key; RLS grants insert-only access and does not allow public reads of the email list.

The patch does not include the PDF because the existing site already has assets/hinge-glow-up-guide.pdf. Keep that existing file in the repository.
