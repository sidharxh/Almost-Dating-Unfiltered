import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { STORY_CATEGORIES } from "@/lib/categories";
import { getStories, storyPath } from "@/lib/stories";
import StoryImageViewer from "@/components/story-image-viewer";

const siteUrl = "https://almostunfiltereddating.com";
type Props = { params: Promise<{ category: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = STORY_CATEGORIES.find((entry) => entry.slug === slug);
  if (!category) return { title: "Category not found", robots: { index: false, follow: false } };
  const categoryStories = (await getStories()).filter((story) => story.category === category.label);
  return {
    title: `${category.label} Dating Confessions`,
    description: `${category.description} Read anonymous dating confessions at Almost.`,
    alternates: { canonical: `${siteUrl}/categories/${category.slug}` },
    keywords: ["dating confessions", "anonymous dating stories", category.label, ...category.tags],
    robots: categoryStories.length ? undefined : { index: false, follow: true },
    openGraph: { type: "website", title: `${category.label} Dating Confessions`, description: category.description, url: `${siteUrl}/categories/${category.slug}`, siteName: "Almost — Unfiltered Dating" },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = STORY_CATEGORIES.find((entry) => entry.slug === slug);
  if (!category) notFound();
  const stories = (await getStories()).filter((story) => story.category === category.label);
  const itemList = { "@context": "https://schema.org", "@type": "ItemList", name: `${category.label} dating confessions`, description: category.description, itemListElement: stories.map((story, index) => ({ "@type": "ListItem", position: index + 1, url: `${siteUrl}${storyPath(story)}`, name: story.title })) };
  return <main className="listing-shell">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList).replace(/</g, "\\u003c") }} />
    <header className="story-nav"><a className="brand" href="/" aria-label="Almost home">Almost<span>.</span></a><a className="back-link" href="/categories">All categories</a></header>
    <section className="listing-hero"><p className="story-kicker">Unfiltered Dating · Confession topic</p><h1>{category.label}</h1><p>{category.description}</p></section>
    {stories.length ? <div className="story-cards listing-cards">{stories.map((story) => <article className="story-list-card" key={story.id}>
      {story.coverImageUrl && <StoryImageViewer src={story.coverImageUrl} alt={story.coverImageAlt} variant="card" />}
      <div className="story-list-card-copy"><span className="category-pill">{story.category}</span><h2><a href={storyPath(story)}>{story.title}</a></h2><p>{story.summary}</p><a className="card-link" href={storyPath(story)}>Read confession →</a></div>
    </article>)}</div> : <div className="category-page-empty"><span className="empty-eyebrow">{category.label}</span><h2>Stories for this category are on the way.</h2><p>Browse other dating confessions or share a story to help start this collection.</p><div><a href="/confessions">Browse all confessions</a><a href="/submit-story">Share a confession</a></div></div>}
    <footer className="story-footer"><a href="/submit-story">Share your confession</a><span>Almost · Unfiltered Dating</span></footer>
  </main>;
}
