import type { Metadata } from "next";
import { STORY_CATEGORIES } from "@/lib/categories";
import { getStories, storyPath } from "@/lib/stories";

export const metadata: Metadata = {
  title: "Read Dating Confessions & Choose a Role | Almost",
  description: "Browse anonymous dating confessions by category. Open a story, choose a perspective, and step into the roleplay.",
  alternates: { canonical: "https://almostunfiltereddating.com/confessions" },
};

export default async function ConfessionsPage() {
  const stories = await getStories();
  const grouped = STORY_CATEGORIES
    .map((category) => ({ category, stories: stories.filter((story) => story.category === category.label) }))
  let itemPosition = 0;
  const itemList = {
    "@context": "https://schema.org", "@type": "ItemList", name: "Dating confessions by category",
    itemListElement: grouped.flatMap(({ category, stories: categoryStories }) => categoryStories.map((story) => ({
      "@type": "ListItem", position: ++itemPosition, name: story.title, url: `https://almostunfiltereddating.com${storyPath(story)}`, item: { "@type": "Article", articleSection: category.label },
    }))),
  };
  return <main className="listing-shell">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList).replace(/</g, "\\u003c") }} />
    <header className="story-nav listing-nav"><a className="brand brand-lockup" href="/" aria-label="Almost — Unfiltered Dating home"><span className="brand-name">Almost<span>.</span></span><span className="brand-tagline">Unfiltered Dating</span></a><nav className="simple-nav" aria-label="Main navigation"><a href="/">Home</a><a className="listing-nav-current" href="/confessions" aria-current="page">Confessions</a><a href="/submit-story">Share your story</a></nav></header>
    <section className="listing-hero listing-hero-focused"><p className="story-kicker">Anonymous dating confessions · interactive roleplay</p><h1>Read what happened.<br /><em>Choose your part.</em></h1><p>Every confession starts with a real-feeling dating dilemma. Open a story, pick a perspective, and step into the scene.</p><div className="listing-hero-actions"><a className="primary-link" href="#confession-categories">Browse by category <span aria-hidden="true">↓</span></a><span>Choose a role inside each story</span></div></section>
    <nav className="category-jump-nav" aria-label="Jump to a confession category">{grouped.map(({ category, stories: categoryStories }) => <a href={`#${category.slug}`} key={category.slug}>{category.label}<span>{categoryStories.length}</span></a>)}</nav>
    {grouped.length ? <div className="confession-category-groups" id="confession-categories">{grouped.map(({ category, stories: categoryStories }) => <section className="confession-category-group" id={category.slug} key={category.slug} aria-labelledby={`${category.slug}-title`}>
      <div className="section-heading"><h2 id={`${category.slug}-title`}><a href={`/categories/${category.slug}`}>{category.label}</a></h2><span>{categoryStories.length} {categoryStories.length === 1 ? "confession" : "confessions"}</span></div>
      {categoryStories.length ? <div className="story-cards">{categoryStories.map((story) => <a className="story-list-card" href={storyPath(story)} key={story.id}><h3>{story.title}</h3><p>{story.summary}</p><span className="card-link">Read and take a role →</span></a>)}</div> : <p className="category-empty">No published confessions in this category yet.</p>}
    </section>)}</div> : <p className="empty-stories">Published confessions will appear here.</p>}
    <footer className="story-footer"><a href="/">Home</a><a href="/submit-story">Share your confession</a><a href="/#hinge-guide">Free Hinge guide</a><span>Almost · Unfiltered Dating</span></footer>
  </main>;
}
