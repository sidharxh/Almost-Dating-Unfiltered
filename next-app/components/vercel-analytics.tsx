"use client";

import { Analytics } from "@vercel/analytics/next";

export default function VercelAnalytics() {
  return (
    <Analytics beforeSend={(event) => (event.url.includes("/admin") ? null : event)} />
  );
}
