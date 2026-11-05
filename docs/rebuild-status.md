# Rebuild status

The existing Vercel project `almost-dating-unfiltered-fuvi` serves the verified `almostunfiltereddating.com` domain; www redirects to it. Its application root must be `next-app`. The legacy GitHub Pages workflow has been removed from the checkout. Historical Supabase project `uajkmfiuuljbnuawovma` is retained.

## Google sign-in

Visitors can read results without signing in. The optional result-page button uses Supabase Auth with Google and PKCE. Signing in stores an Auth user containing the email and basic Google profile data; no quiz answers or result type are stored and no email or marketing subscription is sent. Supabase Auth users are viewable in Authentication > Users.

Before this works, configure the Google provider in Supabase Authentication > Sign In / Providers with a Google OAuth Web client ID and secret. In Google Cloud, set the authorized JavaScript origin to `https://almostunfiltereddating.com` and the authorized redirect URI to `https://uajkmfiuuljbnuawovma.supabase.co/auth/v1/callback`. Add `https://almostunfiltereddating.com/auth/callback` to Supabase Authentication > URL Configuration > Redirect URLs, and set the site URL appropriately. The existing public Supabase URL and publishable key must be set in Vercel. Do not put the Google client secret in the repository or browser. Test sign-in in production after configuration.

## Analytics

The existing GA4 ID is retained. Analytics is disabled until `NEXT_PUBLIC_ENABLE_ANALYTICS=true` is configured. Once enabled, the app requests consent before loading the tag and sends manually sanitized page views. It never deliberately sends email addresses, raw answers or result names. The GA4 enhanced measurement settings must be reviewed because automatic collection can include the full current URL; disable automatic page view, outbound link, form, and other automatic collection that may capture URLs before using the tag. Campaign attribution, custom dimensions, and the full event dictionary require further verification. Analytics is not loaded locally in development.

## Data removal

An explicit request was made to clear legacy stories, lead data and interaction data. A production SQL truncate was rejected by automatic approval review; no records were deleted. The `confession-images` storage bucket contained zero objects when inspected. Analytics data deletion requires access to the GA4 Admin data-deletion interface and has not been performed. No historical email addresses were imported or reused.

## Checks and limitations

Three quizzes contain eight questions each, with all four outcomes reachable and a fixed tie-break rule. `node --test tests/scoring.test.mjs` passes and `npm run build` passes. Local HTTP checks returned 200 for representative pages and both result PNG routes, and 404 for an old story URL. Real Google sign-in, analytics behavior, mobile/keyboard end-to-end interactions, image legibility, and elapsed completion times have not yet been verified. Privacy and terms copy require review for the actual operator and account-deletion contact. The simulator waitlist is not implemented.
