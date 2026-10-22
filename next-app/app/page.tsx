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
  return (
    <main className="home-shell">
      <header className="home-nav">
        <a className="brand" href="/" aria-label="Almost home">Almost<span>.</span></a>
        <a className="home-share-link" href="/submit-story">Share a story</a>
      </header>
      <section className="home-categories" aria-labelledby="categories-title">
        <div className="section-heading">
          <div><p className="story-kicker">Unfiltered Dating</p><h1 id="categories-title">Browse stories by category</h1></div>
        </div>
        <div className="home-category-list">
          {STORY_CATEGORIES.map((category) => {
            const categoryStories = stories.filter((story) => story.category === category.label);
            return (
              <section className="home-category-card" key={category.slug}>
                <div className="home-category-heading">
                  <h2><a href={`/categories/${category.slug}`}>{category.label}</a></h2>
                  <span>{categoryStories.length} {categoryStories.length === 1 ? "story" : "stories"}</span>
                </div>
                {categoryStories.length > 0 ? (
                  <ul>{categoryStories.slice(0, 4).map((story) => <li key={story.id}><a href={storyPath(story)}>{story.title}<span aria-hidden="true">↗</span></a></li>)}</ul>
                ) : <p className="category-empty">No published stories in this category yet.</p>}
              </section>
            );
          })}
        </div>
      </section>
      <section id="hinge-guide" className="guide-section">
        <div className="guide-copy">
          <p className="story-kicker">FREE HINGE PROFILE GUIDE</p>
          <h2>Make your Hinge profile stand out.</h2>
          <p>Get practical prompt ideas and profile tips in the free Hinge Glow-Up Guide.</p>
        </div>
        <GuideDownloadForm sourcePage="/" />
      </section>
      <footer className="site-footer"><span>Almost. · Unfiltered Dating</span><a href="/categories">All categories</a></footer>
    </main>
  );
}
