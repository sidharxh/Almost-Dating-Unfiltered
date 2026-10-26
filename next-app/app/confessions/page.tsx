import type { Metadata } from "next";
import { STORY_CATEGORIES } from "@/lib/categories";
import { getStories, storyPath } from "@/lib/stories";
import StoryImageViewer from "@/components/story-image-viewer";

export const metadata: Metadata = {
  title: "Dating Confessions & Roleplay Stories",
  description: "Browse anonymous dating confessions by category. Choose a story, select a perspective, and step into the scene.",
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
    <header className="story-nav"><a className="brand" href="/" aria-label="Almost home">Almost<span>.</span></a><nav className="simple-nav" aria-label="Main navigation"><a href="/">Home</a><a href="/submit-story">Share a story</a></nav></header>
    <section className="listing-hero"><p className="story-kicker">Unfiltered Dating · Pick a perspective</p><h1>Confessions to step into.</h1><p>Browse by category, choose a story, then take a role in the scene.</p></section>
    {grouped.length ? <div className="confession-category-groups">{grouped.map(({ category, stories: categoryStories }) => <section className="confession-category-group" id={category.slug} key={category.slug} aria-labelledby={`${category.slug}-title`}>
      <div className="section-heading"><h2 id={`${category.slug}-title`}><a href={`/categories/${category.slug}`}>{category.label}</a></h2><span>{categoryStories.length} {categoryStories.length === 1 ? "confession" : "confessions"}</span></div>
      {categoryStories.length ? <div className="story-cards">{categoryStories.map((story) => <article className="story-list-card" key={story.id}>
        {story.coverImageUrl && <StoryImageViewer src={story.coverImageUrl} alt={story.coverImageAlt} variant="card" />}
        <div className="story-list-card-copy"><span className="category-pill">{story.category}</span><h3><a href={storyPath(story)}>{story.title}</a></h3><p>{story.summary}</p><a className="card-link" href={storyPath(story)}>Read and take a role →</a></div>
      </article>)}</div> : <p className="category-empty">No published confessions in this category yet.</p>}
    </section>)}</div> : <p className="empty-stories">Published confessions will appear here.</p>}
    <footer className="story-footer"><a href="/">Home</a><a href="/submit-story">Share your confession</a><span>Almost · Unfiltered Dating</span></footer>
  </main>;
}
