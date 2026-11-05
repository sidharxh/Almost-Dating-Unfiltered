# Product reset and data boundary

The existing Git remote is `sidharxh/Almost-Dating-Unfiltered`, with Vercel hosting the Next.js app in `next-app`. The old static website and its GitHub Pages workflow were retired. The domain and `CNAME` remain unchanged.

On 5 November 2026 the owner explicitly requested removal of all prior site data. The legacy confession, guide lead, reaction, comment and interaction records were deleted and their tables and obsolete upload policies were removed. The `confession-images` bucket had no objects. The existing Supabase project remains; its new `simulator_waitlist` table uses row-level security and does not expose data to anonymous visitors. No historical email addresses were imported or subscribed.

The owner chose to retain historical Google Analytics data. The existing GA4 property remains. Old URLs without a relevant replacement return 404.
