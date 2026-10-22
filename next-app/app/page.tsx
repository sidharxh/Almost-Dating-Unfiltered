import type { Metadata } from "next";
import { STORY_CATEGORIES } from "@/lib/categories";
import { getStories, storyPath } from "@/lib/stories";
import GuideDownloadForm from "@/components/guide-download-form";

export const metadata: Metadata = {
  title: "Dating Confessions You Can Step Into | Almost",
  description: "Read anonymous dating confessions, choose a perspective, and step into the story. Find your next confession by category at Almost.",
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
        <a className="brand brand-lockup" href="/" aria-label="Almost — Unfiltered Dating home"><span className="brand-name">Almost<span>.</span></span><span className="brand-tagline">Unfiltered Dating</span></a>
        <nav aria-label="Main navigation"><a href="/confessions">Confessions</a><a href="#hinge-guide">Free Hinge guide</a><a className="home-share-link" href="#share-story">Share your story</a></nav>
      </header>
      <section className="home-hero home-hero-compact">
        <p className="story-kicker">Dating confessions · choose your perspective</p>
        <h1>Read the confession.<br /><em>Step into the story.</em></h1>
        <p className="home-intro">Anonymous dating stories about attraction, betrayal, and the choices people rarely say out loud. Choose a perspective and take a role in the story.</p>
        <a className="primary-link home-hero-cta" href="/confessions">Explore confessions <span aria-hidden="true">→</span></a>
        <p className="home-hero-note">Read a story. Choose a side. See where it goes.</p>
      </section>
      <section className="home-featured" aria-labelledby="featured-title">
        <div className="section-heading"><div><p className="story-kicker">Find your story</p><h2 id="featured-title">Choose a category. Take a perspective.</h2></div><a href="/confessions">All confessions <span aria-hidden="true">→</span></a></div>
        {featuredByCategory.length ? <div className="home-featured-groups">{featuredByCategory.map(({ category, stories: categoryStories }) => (
          <section className="home-featured-group" key={category.slug}>
            <h3><a href={`/categories/${category.slug}`}>{category.label}<span aria-hidden="true">↗</span></a></h3>
            <div className="home-featured-stories">{categoryStories.map((story) => <a className="home-featured-story" href={storyPath(story)} key={story.id}><strong>{story.title}</strong><span>{story.summary}</span><small>Read it · take a role <b aria-hidden="true">→</b></small></a>)}</div>
          </section>
        ))}</div> : <p className="empty-stories">Published confessions will appear here.</p>}
      </section>
      <section className="home-how" aria-labelledby="how-title"><p className="story-kicker">Your turn in the story</p><h2 id="how-title">Three steps into a confession.</h2><ol><li><span>01</span><strong>Pick a story</strong><p>Browse dating confessions by category.</p></li><li><span>02</span><strong>Choose a perspective</strong><p>Take the woman’s or man’s role in the scene.</p></li><li><span>03</span><strong>Step into it</strong><p>Start the roleplay from the story page.</p></li></ol></section>
      <section id="hinge-guide" className="guide-section">
        <div className="guide-copy">
          <p className="story-kicker">FREE HINGE PROFILE GUIDE</p>
          <h2>A better Hinge profile starts with what you say.</h2>
          <p>Get the free guide for stronger prompts, clearer photos, and conversations that go somewhere.</p>
        </div>
        <GuideDownloadForm sourcePage="/" />
      </section>
      <section id="share-story" className="share-callout"><div><p className="story-kicker">Add your confession</p><h2>Got a dating story you can’t forget?</h2><p>Share it anonymously. Readers can step into the story from their own perspective.</p></div><a className="primary-link" href="/submit-story">Share your story <span aria-hidden="true">→</span></a></section>
      <footer className="site-footer"><a className="brand brand-lockup" href="/" aria-label="Almost — Unfiltered Dating home"><span className="brand-name">Almost<span>.</span></span><span className="brand-tagline">Unfiltered Dating</span></a><a href="/confessions">Confessions</a><a href="#hinge-guide">Free Hinge guide</a><a href="/submit-story">Share your story</a></footer>
    </main>
  );
}
