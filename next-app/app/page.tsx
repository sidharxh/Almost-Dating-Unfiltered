import type { Metadata } from "next";
import { STORY_CATEGORIES } from "@/lib/categories";
import { getStories, storyPath } from "@/lib/stories";
import GuideDownloadForm from "@/components/guide-download-form";

export const metadata: Metadata = {
  title: "Dating Confessions, Told Straight",
  description: "Read anonymous dating confessions about betrayal, mixed signals, unexpected chemistry, and the choices people keep to themselves.",
  alternates: { canonical: "https://almostunfiltereddating.com/" },
};

export default async function HomePage() {
  const stories = await getStories();
  const featured = stories.slice(0, 3);
  return (
    <main className="home-shell">
      <header className="home-nav">
        <a className="brand" href="/" aria-label="Almost — Unfiltered Dating">a<span>.</span></a>
        <nav aria-label="Main navigation"><a href="/confessions">Confessions</a><a href="/categories">Categories</a><a href="/submit-story">Share a story</a><a href="#hinge-guide">Hinge guide</a></nav>
      </header>
      <section className="home-hero">
        <p className="story-kicker">Unfiltered Dating</p>
        <h1>Dating confessions,<br /><em>told straight.</em></h1>
        <p className="home-intro">The dates that went sideways. The messages that changed everything. The things people rarely say out loud.</p>
        <div className="home-actions"><a className="primary-link" href="/confessions">Read the confessions <span aria-hidden="true">→</span></a><a className="secondary-link" href="/submit-story">Share your story</a></div>
      </section>
      <section className="home-section" aria-labelledby="latest-title">
        <div className="section-heading"><div><p className="story-kicker">Real experiences, told anonymously</p><h2 id="latest-title">Latest confessions</h2></div><a href="/confessions">See all stories →</a></div>
        {featured.length ? <div className="story-cards">{featured.map((story) => <a className="story-list-card" href={storyPath(story)} key={story.id}><span className="category-pill">{story.category}</span><h3>{story.title}</h3><p>{story.summary}</p><span className="card-link">Read confession →</span></a>)}</div> : <p className="empty-stories">New confessions are being reviewed. Check back for the latest stories.</p>}
      </section>
      <section className="home-section category-section" aria-labelledby="category-title">
        <div className="section-heading"><div><p className="story-kicker">Find the story that speaks to you</p><h2 id="category-title">Browse by category</h2></div><a href="/categories">All categories →</a></div>
        <div className="category-links">{STORY_CATEGORIES.map((category) => <a key={category.slug} href={`/categories/${category.slug}`}>{category.label}<span aria-hidden="true">↗</span></a>)}</div>
      </section>
      <section id="hinge-guide" className="guide-section">
        <div><p className="story-kicker">A better start on Hinge</p><h2>Make your profile sound like you.</h2><p>Get the free Hinge Glow-Up Guide, with practical prompts and profile advice you can use today.</p></div>
        <GuideDownloadForm sourcePage="/" />
      </section>
      <section className="share-callout"><div><p className="story-kicker">Your story belongs here</p><h2>Something happened. Tell it straight.</h2><p>Share your dating confession anonymously. Every story is reviewed before it appears.</p></div><a className="primary-link" href="/submit-story">Share a story <span aria-hidden="true">→</span></a></section>
      <footer className="site-footer"><a className="brand" href="/" aria-label="Almost — Unfiltered Dating">a<span>.</span></a><span>Unfiltered Dating</span><a href="/confessions">Confessions</a><a href="/categories">Categories</a><a href="/submit-story">Submit a story</a></footer>
    </main>
  );
}
