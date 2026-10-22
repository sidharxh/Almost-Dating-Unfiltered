import type { Metadata } from "next";
import { STORY_CATEGORIES } from "@/lib/categories";
import { getStories } from "@/lib/stories";

export const metadata: Metadata = {
  title: "Dating Confession Categories",
  description: "Explore anonymous dating confessions by category, from betrayal and secret affairs to first dates and unexpected chemistry.",
  alternates: { canonical: "https://almostunfiltereddating.com/categories" },
};

export default async function CategoriesPage() {
  const stories = await getStories();
  return <main className="listing-shell">
    <header className="story-nav"><a className="brand" href="/" aria-label="Almost — Unfiltered Dating">a<span>.</span></a><a className="back-link" href="/confessions">All confessions</a></header>
    <section className="listing-hero"><p className="story-kicker">Browse by category</p><h1>Find your kind of story.</h1><p>Explore dating confessions by the choices, complications, and connections at their center.</p></section>
    <div className="category-directory">{STORY_CATEGORIES.map((category) => {
      const categoryStories = stories.filter((story) => story.category === category.label);
      return <a className="category-directory-card" href={`/categories/${category.slug}`} key={category.slug}><span className="category-pill">{categoryStories.length} {categoryStories.length === 1 ? "story" : "stories"}</span><h2>{category.label}</h2><p>Read anonymous confessions about {category.tags.slice(0, 2).join(" and ")}.</p><span className="card-link">Explore category →</span></a>;
    })}</div>
  </main>;
}
