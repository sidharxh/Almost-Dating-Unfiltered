import type { Metadata } from "next";
import { STORY_CATEGORIES } from "@/lib/categories";
import { getStories } from "@/lib/stories";

export const metadata: Metadata = {
  title: "Explore Dating Confession Topics",
  description: "Choose a dating confession topic, from secret affairs and betrayal to mixed signals, first dates, and unexpected attraction.",
  alternates: { canonical: "https://almostunfiltereddating.com/categories" },
};

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
    <section className="listing-hero"><p className="story-kicker">Almost · Unfiltered Dating</p><h1>Choose a confession topic.</h1><p>Start with the situation that interests you. Each topic brings together personal dating stories with something in common.</p></section>
    <div className="category-directory">{STORY_CATEGORIES.map((category) => {
      const categoryStories = stories.filter((story) => story.category === category.label);
      return <a className="category-directory-card" href={`/categories/${category.slug}`} key={category.slug}><span className="category-pill">{categoryStories.length ? `${categoryStories.length} ${categoryStories.length === 1 ? "confession" : "confessions"}` : "Explore topic"}</span><h2>{category.label}</h2><p>{category.description}</p><span className="card-link">Read confessions →</span></a>;
    })}</div>
  </main>;
}
