import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { STORY_CATEGORIES } from "@/lib/categories";
import { getStories, storyPath } from "@/lib/stories";

const siteUrl = "https://almostunfiltereddating.com";
type Props = { params: Promise<{ category: string }> };

export async function generateStaticParams() { return STORY_CATEGORIES.map(({ slug }) => ({ category: slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = STORY_CATEGORIES.find((entry) => entry.slug === slug);
  if (!category) return { title: "Category not found", robots: { index: false, follow: false } };
  return {
    title: `${category.label} Dating Confessions`,
    description: `Read anonymous dating confessions about ${category.tags.join(", ")}. Explore ${category.label.toLowerCase()} stories at Almost — Unfiltered Dating.`,
    alternates: { canonical: `${siteUrl}/categories/${category.slug}` },
    openGraph: { type: "website", title: `${category.label} Dating Confessions`, description: `Anonymous stories about ${category.tags.join(", ")}.`, url: `${siteUrl}/categories/${category.slug}`, siteName: "Almost — Unfiltered Dating" },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = STORY_CATEGORIES.find((entry) => entry.slug === slug);
  if (!category) notFound();
  const stories = (await getStories()).filter((story) => story.category === category.label);
  const itemList = { "@context": "https://schema.org", "@type": "ItemList", name: `${category.label} dating confessions`, itemListElement: stories.map((story, index) => ({ "@type": "ListItem", position: index + 1, url: `${siteUrl}${storyPath(story)}`, name: story.title })) };
  return <main className="listing-shell">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList).replace(/</g, "\\u003c") }} />
    <header className="story-nav"><a className="brand" href="/">Almost<span>.</span></a><a className="back-link" href="/categories">All categories</a></header>
    <section className="listing-hero"><p className="story-kicker">Unfiltered Dating · Category</p><h1>{category.label}</h1><p>Anonymous dating confessions about {category.tags.join(", ")}.</p></section>
    {stories.length ? <div className="story-cards listing-cards">{stories.map((story) => <a className="story-list-card" href={storyPath(story)} key={story.id}><span className="category-pill">{story.category}</span><h2>{story.title}</h2><p>{story.summary}</p><span className="card-link">Read confession →</span></a>)}</div> : <p className="empty-stories">There are no published stories in this category yet. <a href="/confessions">Browse all confessions.</a></p>}
    <footer className="story-footer"><a href="/submit-story">Share your confession</a><span>Almost · Unfiltered Dating</span></footer>
  </main>;
}
