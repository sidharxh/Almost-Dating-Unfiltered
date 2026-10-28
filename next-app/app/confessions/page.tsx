import type { Metadata } from "next";
import { STORY_CATEGORIES } from "@/lib/categories";
import { getStories, storyPath } from "@/lib/stories";
import ConfessionsBrowser from "@/components/confessions-browser";

export const metadata: Metadata = {
  title: "Read Anonymous Dating Confessions",
  description: "Browse anonymous dating confessions about attraction, betrayal, mixed signals, and complicated relationship choices by category.",
  alternates: { canonical: "https://almostunfiltereddating.com/confessions" },
  openGraph: {
    type: "website",
    title: "Read Anonymous Dating Confessions",
    description: "Read anonymous dating confessions organized by story category.",
    url: "https://almostunfiltereddating.com/confessions",
    siteName: "Almost — Unfiltered Dating",
  },
};

type ConfessionsPageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function ConfessionsPage({ searchParams }: ConfessionsPageProps) {
  const { category } = await searchParams;
  const initialCategory = typeof category === "string" && STORY_CATEGORIES.some((entry) => entry.slug === category) ? category : "all";
  const stories = await getStories();
  let itemPosition = 0;
  const itemList = {
    "@context": "https://schema.org", "@type": "ItemList", name: "Anonymous dating confessions",
    itemListElement: stories.map((story) => ({
      "@type": "ListItem", position: ++itemPosition, name: story.title, url: `https://almostunfiltereddating.com${storyPath(story)}`, item: { "@type": "Article", articleSection: story.category },
    })),
  };
  return <main className="listing-shell">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList).replace(/</g, "\\u003c") }} />
    <header className="story-nav"><a className="brand" href="/" aria-label="Almost home">Almost<span>.</span></a><nav className="simple-nav" aria-label="Main navigation"><a href="/">Home</a><a href="/submit-story">Share a story</a></nav></header>
    <section className="listing-hero confession-listing-hero"><p className="story-kicker">Unfiltered Dating · Anonymous confessions</p><h1>Find a story that pulls you in.</h1><p>Browse anonymous dating confessions by category, or read every story from the full collection.</p></section>
    <ConfessionsBrowser initialCategory={initialCategory} stories={stories.map(({ id, slug, title, category, summary, coverImageUrl, coverImageAlt }) => ({ id, slug, title, category, summary, coverImageUrl, coverImageAlt }))} categories={STORY_CATEGORIES.map(({ slug, label }) => ({ slug, label }))} />
    <footer className="story-footer"><a href="/">Home</a><a href="/submit-story">Share your confession</a><span>Almost · Unfiltered Dating</span></footer>
  </main>;
}
