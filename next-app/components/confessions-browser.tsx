"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import StoryImageViewer from "@/components/story-image-viewer";

type CategoryOption = { slug: string; label: string };
type StoryCard = { id: string; slug: string; title: string; category: string; summary: string; coverImageUrl: string | null; coverImageAlt: string };

export default function ConfessionsBrowser({
  stories,
  categories,
  initialCategory,
}: {
  stories: StoryCard[];
  categories: CategoryOption[];
  initialCategory: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  function selectCategory(slug: string) {
    setActiveCategory(slug);
    router.replace(slug === "all" ? pathname : `${pathname}?category=${encodeURIComponent(slug)}`, { scroll: false });
  }
  const selectedCategory = categories.find((category) => category.slug === activeCategory);
  const visibleStories = selectedCategory
    ? stories.filter((story) => story.category === selectedCategory.label)
    : stories;

  return (
    <section className="confessions-browser" aria-label="Browse dating confessions">
      <div className="confession-filter-bar">
        <p>Choose a topic</p>
        <div className="confession-filters" role="group" aria-label="Filter confessions by category">
          <button type="button" className={activeCategory === "all" ? "is-active" : ""} aria-pressed={activeCategory === "all"} aria-controls="confession-results" onClick={() => selectCategory("all")}>
            All confessions{stories.length > 0 && <span>{stories.length}</span>}
          </button>
          {categories.map((category) => {
            const count = stories.filter((story) => story.category === category.label).length;
            return <button key={category.slug} type="button" className={activeCategory === category.slug ? "is-active" : ""} aria-pressed={activeCategory === category.slug} aria-controls="confession-results" onClick={() => selectCategory(category.slug)}>
              {category.label}{count > 0 && <span>{count}</span>}
            </button>;
          })}
        </div>
      </div>

      {visibleStories.length ? <div id="confession-results" className="story-cards confession-results" aria-live="polite">
        {visibleStories.map((story) => <article className="story-list-card" key={story.id}>
          {story.coverImageUrl && <StoryImageViewer src={story.coverImageUrl} alt={story.coverImageAlt} variant="card" />}
          <div className="story-list-card-copy">
            <span className="category-pill">{story.category}</span>
            <h2><a href={`/confessions/${story.slug}.html`}>{story.title}</a></h2>
            <p>{story.summary}</p>
            <a className="card-link" href={`/confessions/${story.slug}.html`}>Read confession <span aria-hidden="true">→</span></a>
          </div>
        </article>)}
      </div> : <div id="confession-results" className="confessions-empty" aria-live="polite">
        <span className="empty-eyebrow">{selectedCategory ? selectedCategory.label : "Almost · Unfiltered Dating"}</span>
        <h2>{selectedCategory ? "No stories in this category yet." : "The first confession is waiting to be told."}</h2>
        <p>{selectedCategory ? "Try another category, or share a story to start this collection." : "Stories appear here after review. Browse the categories or send in a confession of your own."}</p>
        <div className="empty-actions">
          {selectedCategory && <button type="button" onClick={() => selectCategory("all")}>View all confessions</button>}
          <a href="/submit-story">Share a confession <span aria-hidden="true">→</span></a>
        </div>
      </div>}
    </section>
  );
}
