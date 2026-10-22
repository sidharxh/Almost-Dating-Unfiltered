import type { MetadataRoute } from "next";
import { STORY_CATEGORIES } from "@/lib/categories";
import { getStories, storyPath } from "@/lib/stories";

const siteUrl = "https://almostunfiltereddating.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const stories = await getStories();
  const publishedCategorySlugs = new Set(stories.flatMap((story) => {
    const category = STORY_CATEGORIES.find((entry) => entry.label === story.category);
    return category ? [category.slug] : [];
  }));
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/confessions`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/categories`, changeFrequency: "weekly", priority: 0.8 },
    ...STORY_CATEGORIES.filter((category) => publishedCategorySlugs.has(category.slug)).map((category) => ({ url: `${siteUrl}/categories/${category.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
  const storyPages: MetadataRoute.Sitemap = stories.map((story) => ({
    url: `${siteUrl}${storyPath(story)}`,
    lastModified: story.createdAt,
    changeFrequency: "monthly",
    priority: 0.8,
  }));
  return [...staticPages, ...storyPages];
}
