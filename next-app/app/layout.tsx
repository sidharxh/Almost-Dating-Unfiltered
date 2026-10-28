import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "./analytics";
import VercelAnalytics from "@/components/vercel-analytics";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://almostunfiltereddating.com"),
  title: {
    default: "Almost — Unfiltered Dating",
    template: "%s | Almost",
  },
  description:
    "Anonymous dating confessions about betrayal, attraction, mixed signals, and the moments people rarely say out loud.",
  applicationName: "Almost — Unfiltered Dating",
  keywords: ["dating confessions", "anonymous dating stories", "relationship confessions", "dating stories"],
  openGraph: {
    type: "website",
    siteName: "Almost — Unfiltered Dating",
    title: "Almost — Unfiltered Dating",
    description: "Anonymous dating confessions, told straight.",
    url: "https://almostunfiltereddating.com/",
  },
  twitter: {
    card: "summary",
    title: "Almost — Unfiltered Dating",
    description: "Anonymous dating confessions, told straight.",
  },
  icons: { icon: "/icon.svg?v=2", shortcut: "/icon.svg?v=2" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {process.env.NODE_ENV === "production" && (
          <>
            <Script id="google-tag-init" strategy="beforeInteractive">
              {`window.dataLayer = window.dataLayer || [];
window.gtag = function(){window.dataLayer.push(arguments);};
window.gtag('js', new Date());
window.gtag('config', 'G-WWJH2R0QS6', { send_page_view: false });`}
            </Script>
            <Script
              id="google-tag"
              src="https://www.googletagmanager.com/gtag/js?id=G-WWJH2R0QS6"
              strategy="afterInteractive"
            />
          </>
        )}
        {children}
        <Analytics />
        <VercelAnalytics />
      </body>
    </html>
  );
}
