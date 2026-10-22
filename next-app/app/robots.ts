import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://almostunfiltereddating.com/sitemap.xml",
    host: "https://almostunfiltereddating.com",
  };
}
