import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://almostunfiltereddating.com"),
  title: {
    default: "Almost — Unfiltered Dating",
    template: "%s | Almost — Unfiltered Dating",
  },
  description:
    "Intimate dating confessions and story-based roleplay for adults.",
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
