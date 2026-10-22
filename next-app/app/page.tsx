import type { Metadata } from "next";
import { STORY_CATEGORIES } from "@/lib/categories";
import { getStories, storyPath } from "@/lib/stories";
import GuideDownloadForm from "@/components/guide-download-form";

export const metadata: Metadata = {
  title: "Dating Confessions by Category",
  description: "Browse anonymous dating confessions by category, including betrayal, secret affairs, mixed signals, first dates, and more.",
  alternates: { canonical: "https://almostunfiltereddating.com/" },
};

export default async function HomePage() {
  const stories = await getStories();
  const featuredByCategory = STORY_CATEGORIES
    .map((category) => ({ category, stories: stories.filter((story) => story.category === category.label).slice(0, 2) }))
    .filter((entry) => entry.stories.length > 0)
    .slice(0, 6);
  const featuredStories = featuredByCategory.flatMap(({ stories: categoryStories }) => categoryStories);
  const structuredData = {
    "@context": "https://schema.org", "@graph": [
      { "@type": "WebSite", name: "Almost — Unfiltered Dating", url: "https://almostunfiltereddating.com/" },
      { "@type": "Organization", name: "Almost — Unfiltered Dating", url: "https://almostunfiltereddating.com/", logo: "https://almostunfiltereddating.com/icon.svg" },
      { "@type": "ItemList", name: "Featured dating confessions", itemListElement: featuredStories.map((story, index) => ({ "@type": "ListItem", position: index + 1, name: story.title, url: `https://almostunfiltereddating.com${storyPath(story)}` })) },
    ],
  };
  return (
    <main className="home-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <header className="home-nav">
        <a className="brand" href="/" aria-label="Almost home">Almost<span>.</span></a>
        <nav aria-label="Main navigation"><a href="/confessions">Confessions</a><a href="#hinge-guide">Free Hinge guide</a><a className="home-share-link" href="#share-story">Share a story</a></nav>
      </header>
      <section className="home-hero home-hero-compact">
        <p className="story-kicker">Unfiltered Dating</p>
        <h1>Dating confessions,<br /><em>by category.</em></h1>
        <p className="home-intro">Read the stories people usually keep to themselves.</p>
      </section>
      <section className="home-featured" aria-labelledby="featured-title">
        <div className="section-heading"><div><p className="story-kicker">A place to start</p><h2 id="featured-title">Confessions to read</h2></div><a href="/confessions">Browse all confessions →</a></div>
        {featuredByCategory.length ? <div className="home-featured-groups">{featuredByCategory.map(({ category, stories: categoryStories }) => (
          <section className="home-featured-group" key={category.slug}>
            <h3><a href={`/categories/${category.slug}`}>{category.label}<span aria-hidden="true">↗</span></a></h3>
            <div className="home-featured-stories">{categoryStories.map((story) => <a className="home-featured-story" href={storyPath(story)} key={story.id}><strong>{story.title}</strong><span>{story.summary}</span><small>Read confession →</small></a>)}</div>
          </section>
        ))}</div> : <p className="empty-stories">Published confessions will appear here.</p>}
      </section>
      <section id="hinge-guide" className="guide-section">
        <div className="guide-copy">
          <p className="story-kicker">FREE HINGE PROFILE GUIDE</p>
          <h2>Make your Hinge profile stand out.</h2>
          <p>Get practical prompt ideas and profile tips in the free Hinge Glow-Up Guide.</p>
        </div>
        <GuideDownloadForm sourcePage="/" />
      </section>
      <section id="share-story" className="share-callout"><div><p className="story-kicker">Share a story</p><h2>Your dating confession belongs here.</h2><p>Submit it anonymously. We review every story before publication.</p></div><a className="primary-link" href="/submit-story">Share your story <span aria-hidden="true">→</span></a></section>
      <footer className="site-footer"><span>Almost. · Unfiltered Dating</span><a href="/">Home</a><a href="/confessions">Confessions</a><a href="/submit-story">Share a story</a></footer>
    </main>
  );
}
