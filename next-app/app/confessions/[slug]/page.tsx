import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StoryImagePackageInterest from "@/components/story-image-package-interest";
import StoryShare from "@/components/story-share";
import StoryImageViewer from "@/components/story-image-viewer";
import { getStories, getStory, storyPath } from "@/lib/stories";

const siteUrl = "https://almostunfiltereddating.com";
type PageProps = { params: Promise<{ slug: string }> };
function cleanSlug(slug: string) { return slug.replace(/\.html$/, ""); }
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getStories()).map((story) => ({ slug: `${story.slug}.html` }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStory(cleanSlug(slug));
  if (!story) return { title: "Confession not found", robots: { index: false, follow: false } };
  const canonical = `${siteUrl}${storyPath(story)}`;
  const shareImage = `${canonical}/opengraph-image`;
  const searchDescription = `Read “${story.title},” an anonymous ${story.category.toLowerCase()} dating confession. Request its related images and get notified when they’re ready to view or download.`.slice(0, 160).trimEnd();
  return {
    title: story.title,
    description: searchDescription,
    keywords: ["dating confession", "anonymous dating story", "dating story images", "confession images", story.category],
    alternates: { canonical },
    openGraph: { type: "article", title: story.title, description: searchDescription, url: canonical, siteName: "Almost — Unfiltered Dating", publishedTime: story.createdAt, section: story.category, images: [{ url: shareImage, alt: `Almost. share card for ${story.title}` }] },
    twitter: { card: "summary_large_image", title: story.title, description: searchDescription, images: [`${canonical}/twitter-image`] },
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
    description: `Read “${story.title},” an anonymous ${story.category.toLowerCase()} dating confession. Request its related images and get notified when they’re ready to view or download.`.slice(0, 160).trimEnd(),
    articleSection: story.category, datePublished: story.createdAt,
    dateModified: story.createdAt, inLanguage: "en", keywords: ["dating confession", "anonymous dating story", story.category].join(", "),
    articleBody: story.body, wordCount: story.body.trim().split(/\s+/).filter(Boolean).length,
    about: [{ "@type": "Thing", name: story.category }, { "@type": "Thing", name: "Images for this dating confession" }],
    ...(story.coverImageUrl ? { image: story.coverImageUrl } : {}),
    author: { "@type": "Person", name: "Anonymous" }, mainEntityOfPage: canonical,
    isAccessibleForFree: true,
    isPartOf: { "@type": "WebSite", name: "Almost — Unfiltered Dating", url: siteUrl },
    publisher: { "@type": "Organization", name: "Almost — Unfiltered Dating", url: siteUrl, logo: { "@type": "ImageObject", url: `${siteUrl}/icon.svg` } },
  };
  const breadcrumbData = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Confessions", item: `${siteUrl}/confessions` },
      { "@type": "ListItem", position: 3, name: story.title, item: canonical },
    ],
  };
  return (
    <main className="story-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData).replace(/</g, "\\u003c") }} />
      <header className="story-nav"><a className="brand" href="/" aria-label="Almost home">Almost<span>.</span></a><a className="back-link" href="/confessions">All confessions</a></header>
      {story.coverImageUrl && <StoryImageViewer src={story.coverImageUrl} alt={story.coverImageAlt} />}
      <section className="story-hero" aria-labelledby="story-title">
        <p className="story-kicker">{story.category} · Unfiltered Dating</p>
        <h1 id="story-title">{story.title}</h1>
        <p className="story-deck">{story.summary}</p>
        <div className="story-byline"><span>Anonymous confession</span><span aria-hidden="true">·</span><time dateTime={story.createdAt}>{new Date(story.createdAt).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })}</time></div>
        <a className="image-package-link" href="#image-package">See the images connected to this story <span aria-hidden="true">↓</span></a>
      </section>
      <StoryImagePackageInterest storySlug={story.slug} storyCategory={story.category} storyTitle={story.title} imageUrl={story.coverImageUrl} />
      <article id="the-confession" className="confession confession-full" aria-label="Dating confession">
        <div className="chapter-mark"><span>01</span> THE CONFESSION</div>
        <div className="confession-body">{paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
      </article>
      <StoryShare title={story.title} storyUrl={canonical} imageUrl={`${canonical}/opengraph-image`} />
      <footer className="story-footer"><a href="/confessions">Browse all confessions</a><span>{story.category}</span></footer>
    </main>
  );
}
