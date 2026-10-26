import type { Metadata } from "next";
import { Analytics } from "./analytics";
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
  icons: { icon: "/icon.svg" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
