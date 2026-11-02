import type { Metadata } from "next";
import { STORY_CATEGORIES } from "@/lib/categories";
import { getStories } from "@/lib/stories";

export const metadata: Metadata = {
  title: "Dating Confession Topics & Categories",
  description: "Explore anonymous dating confession stories by topic, including cheating and betrayal, secret affairs, first dates, mixed signals, and unexpected attraction.",
  alternates: { canonical: "https://almostunfiltereddating.com/categories" },
};

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const stories = await getStories();
  const categoryList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Dating confession topics",
    itemListElement: STORY_CATEGORIES.map((category, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: category.label,
      description: category.description,
      url: `https://almostunfiltereddating.com/categories/${category.slug}`,
    })),
  };
  return <main className="listing-shell">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryList).replace(/</g, "\\u003c") }} />
    <header className="story-nav"><a className="brand" href="/" aria-label="Almost home">Almost<span>.</span></a><a className="back-link" href="/confessions">All confessions</a></header>
    <section className="listing-hero"><p className="story-kicker">Almost · Unfiltered Dating</p><h1>Dating confessions by topic.</h1><p>Choose a subject and read anonymous dating stories about situations people face, from broken trust to unexpected attraction.</p></section>
    <div className="category-directory">{STORY_CATEGORIES.map((category) => {
      const categoryStories = stories.filter((story) => story.category === category.label);
      return <a className="category-directory-card" href={`/categories/${category.slug}`} key={category.slug}><span className="category-pill">{categoryStories.length ? `${categoryStories.length} ${categoryStories.length === 1 ? "confession" : "confessions"}` : "Explore topic"}</span><h2>{category.label}</h2><p>{category.description}</p><span className="card-link">Read confessions →</span></a>;
    })}</div>
  </main>;
}
