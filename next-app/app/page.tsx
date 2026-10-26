import type { Metadata } from "next";
import { STORY_CATEGORIES } from "@/lib/categories";
import { getStories, storyPath } from "@/lib/stories";
import GuideDownloadForm from "@/components/guide-download-form";
import StoryImageViewer from "@/components/story-image-viewer";

export const metadata: Metadata = {
  title: "Dating Confessions, Unfiltered",
  description: "Read anonymous dating confessions, choose whether to play as the woman or man in a story, and step into a character-based roleplay chat.",
  alternates: { canonical: "https://almostunfiltereddating.com/" },
};

export default async function HomePage() {
  const stories = await getStories();
  const featuredStories = STORY_CATEGORIES
    .flatMap((category) => stories.find((story) => story.category === category.label) ?? [])
    .slice(0, 6);
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
        <nav aria-label="Main navigation"><a href="/confessions">Confessions</a><a href="#hinge-guide">Free Hinge guide</a></nav>
        <a className="home-share-link" href="/submit-story">Share a story</a>
      </header>
      <section className="home-hero home-hero-compact">
        <div className="home-hero-copy"><p className="story-kicker">Anonymous stories · Unfiltered Dating</p>
          <h1>Dating confessions.<br /><em>Choose your role.</em></h1>
          <p className="home-intro">Choose a confession, play as the woman or man in the story, then roleplay a conversation with the other character.</p>
          <div className="home-actions"><a className="primary-link" href="/confessions">Browse confessions <span aria-hidden="true">→</span></a><a className="secondary-link" href="#story-categories">Explore categories</a></div>
        </div>
        <aside className="home-hero-note" aria-label="How story roleplay works"><span className="hero-note-number">READ · CHOOSE · ROLEPLAY</span><ol><li><span>01</span> Pick a confession</li><li><span>02</span> Choose the woman’s or man’s role</li><li><span>03</span> Start a chat with the other character</li></ol><a href="/confessions">Find a story <span aria-hidden="true">↗</span></a></aside>
      </section>
      <section id="story-categories" className="home-category-section" aria-labelledby="category-title">
        <div className="section-heading"><div><p className="story-kicker">Choose what you want to read</p><h2 id="category-title">Explore confessions</h2></div><a href="/categories">View every topic →</a></div>
        <div className="home-category-grid">{STORY_CATEGORIES.map((category, index) => {
          const count = stories.filter((story) => story.category === category.label).length;
          return <a className="home-category-card" href={`/categories/${category.slug}`} key={category.slug}><span className="home-category-index">{String(index + 1).padStart(2, "0")}</span><strong>{category.label}</strong><small className="home-category-tease">{category.description}</small><span className="home-category-meta">{count > 0 ? `${count} ${count === 1 ? "confession" : "confessions"}` : "Read this topic"}<span aria-hidden="true">↗</span></span></a>;
        })}</div>
      </section>
      {featuredStories.length > 0 && <section className="home-featured" aria-labelledby="featured-title">
        <div className="section-heading"><div><p className="story-kicker">Start reading</p><h2 id="featured-title">A few confessions to begin with</h2></div><a href="/confessions">Browse every confession →</a></div>
        <div className="home-featured-grid">{featuredStories.map((story) => (
          <article className="home-featured-card" key={story.id}>
              {story.coverImageUrl && <StoryImageViewer src={story.coverImageUrl} alt={story.coverImageAlt} variant="card" />}
              <div className="home-featured-card-copy"><span className="category-pill">{story.category}</span>
                <a className="home-featured-story-link" href={storyPath(story)}><strong>{story.title}</strong><span>{story.summary}</span><small>Read confession →</small></a>
              </div>
          </article>
        ))}</div>
      </section>}
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
