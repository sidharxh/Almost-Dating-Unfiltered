# Almost quiz site: operations

The production Vercel project is `almost-dating-unfiltered-fuvi`, using `next-app` as its root. The domain is `almostunfiltereddating.com`. The previous public confession tables and their upload policies were removed at the owner's request. The old `confession-images` bucket was empty; no historical addresses were reused. The existing Supabase project remains `uajkmfiuuljbnuawovma`.

## Google sign-in

A visitor must sign in with Google to see a full result and share controls. Supabase Auth stores their email and basic Google profile information. No quiz answers or result traits are stored in the database. No emails are sent. A signed-in visitor can separately join the simulator waitlist; that table contains only their Auth user ID and timestamp and has own-user RLS policies.

Google sign-in is enabled in Supabase. Email authentication is disabled, so Google is the only sign-in method exposed by the project. The production site URL is `https://almostunfiltereddating.com`, and `https://almostunfiltereddating.com/auth/callback` is in the Supabase redirect allowlist. The Google OAuth Web client uses `https://almostunfiltereddating.com` as its authorized JavaScript origin and `https://uajkmfiuuljbnuawovma.supabase.co/auth/v1/callback` as its redirect URI. The Google client secret exists only in the Supabase provider configuration.

## Analytics

GA4 measurement ID `G-WWJH2R0QS6` is retained. The app loads the tag only after analytics consent and sends sanitized page URLs with no result slug, query parameters, email, or answer text. Google signals and advertising personalization are disabled. Google Analytics enhanced measurement was turned off in the Almost web stream on 5 November 2026 to prevent its automatic events capturing full sensitive paths. The app records quiz events directly. YouTube campaign fields use alphanumeric, hyphen, and underscore characters only; do not include personal information in UTM tags. Historical Analytics data was retained at the owner's request. Confirm events in GA4 Realtime after deployment and consent.

## Checks and remaining work

All three quizzes have eight questions and four reachable results. Scoring tests and the production build pass. A local browser run completed one mobile quiz and reached the Google sign-in gate; keyboard selection and next navigation were checked. The production Google OAuth redirect, authenticated result, waitlist insert, and mobile share controls still need a signed-in device check after deployment. Privacy and terms copy require the actual operator's contact and account deletion details.
