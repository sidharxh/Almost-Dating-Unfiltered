import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RoleplayPanel from "@/components/roleplay-panel";
import { getStories, getStory, storyPath } from "@/lib/stories";

const siteUrl = "https://almostunfiltereddating.com";
type PageProps = { params: Promise<{ slug: string }> };
function cleanSlug(slug: string) { return slug.replace(/\.html$/, ""); }

export async function generateStaticParams() {
  return (await getStories()).map((story) => ({ slug: `${story.slug}.html` }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStory(cleanSlug(slug));
  if (!story) return { title: "Confession not found", robots: { index: false, follow: false } };
  const canonical = `${siteUrl}${storyPath(story)}`;
  return {
    title: story.title,
    description: story.summary,
    alternates: { canonical },
    openGraph: { type: "article", title: story.title, description: story.summary, url: canonical, siteName: "Almost — Unfiltered Dating" },
    twitter: { card: "summary", title: story.title, description: story.summary },
  };
}

export default async function ConfessionPage({ params }: PageProps) {
  const { slug } = await params;
  const story = await getStory(cleanSlug(slug));
  if (!story) notFound();
  const paragraphs = story.body.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
  const canonical = `${siteUrl}${storyPath(story)}`;
  const structuredData = {
    "@context": "https://schema.org", "@type": "Article", headline: story.title,
    description: story.summary, articleSection: story.category, datePublished: story.createdAt,
    mainEntityOfPage: canonical, publisher: { "@type": "Organization", name: "Almost — Unfiltered Dating", url: siteUrl },
  };
  return (
    <main className="story-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <header className="story-nav"><a className="brand" href="/" aria-label="Almost home">Almost<span>.</span></a><a className="back-link" href="/confessions">All confessions</a></header>
      <section className="story-hero" aria-labelledby="story-title">
        <p className="story-kicker">{story.category} · Unfiltered Dating</p>
        <h1 id="story-title">{story.title}</h1>
        <p className="story-deck">{story.summary}</p>
        <div className="story-byline"><span>Anonymous confession</span><span aria-hidden="true">·</span><time dateTime={story.createdAt}>{new Date(story.createdAt).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })}</time></div>
        <a className="roleplay-hero-link" href="#roleplay-title">Choose your perspective <span aria-hidden="true">↓</span></a>
      </section>
      <div className="experience-grid">
        <article id="the-confession" className="confession" aria-label="Dating confession">
          <div className="chapter-mark"><span>01</span> THE CONFESSION</div>
          {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </article>
        <aside id="story-roleplay" className="roleplay-card" aria-labelledby="roleplay-title">
          <p className="roleplay-eyebrow">YOUR TURN</p>
          <h2 id="roleplay-title">Join the story</h2>
          <p className="roleplay-description">Choose whose perspective you want to take, then start.</p>
          <RoleplayPanel storySlug={story.slug} storyCategory={story.category} />
          <p className="roleplay-boundary">For adults 18+ · Keep interactions respectful.</p>
        </aside>
      </div>
      <footer className="story-footer"><a href="/confessions">Browse all confessions</a><span>{story.category}</span></footer>
    </main>
  );
}
