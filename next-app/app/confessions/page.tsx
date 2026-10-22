import type { Metadata } from "next";
import { getStories, storyPath } from "@/lib/stories";
import { STORY_CATEGORIES } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Anonymous Dating Confessions",
  description: "Browse anonymous dating confessions across betrayal, affairs, mixed signals, first dates, and more.",
  alternates: { canonical: "https://almostunfiltereddating.com/confessions" },
};

export default async function ConfessionsPage() {
  const stories = await getStories();
  return <main className="listing-shell">
    <header className="story-nav"><a className="brand" href="/" aria-label="Almost home">Almost<span>.</span></a><a className="back-link" href="/">Home</a></header>
    <section className="listing-hero"><p className="story-kicker">Unfiltered Dating</p><h1>Dating confessions</h1><p>Anonymous stories about attraction, betrayal, mixed signals, and the moments that changed a relationship.</p></section>
    <nav className="listing-categories" aria-label="Browse confession categories">{STORY_CATEGORIES.map((category) => <a key={category.slug} href={`/categories/${category.slug}`}>{category.label}</a>)}</nav>
    {stories.length ? <div className="story-cards listing-cards">{stories.map((story) => <a className="story-list-card" href={storyPath(story)} key={story.id}><span className="category-pill">{story.category}</span><h2>{story.title}</h2><p>{story.summary}</p><span className="card-link">Read confession →</span></a>)}</div> : <p className="empty-stories">No published confessions in this category yet.</p>}
    <footer className="story-footer"><a href="/submit-story">Share your confession</a><span>Almost · Unfiltered Dating</span></footer>
  </main>;
}
