import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RoleplayPanel from "@/components/roleplay-panel";
import { getStories, getStory } from "@/lib/stories";

const siteUrl = "https://almostunfiltereddating.com";

type PageProps = { params: Promise<{ slug: string }> };

function cleanSlug(routeSlug: string) {
  return routeSlug.replace(/\.html$/, "");
}

export function generateStaticParams() {
  return getStories().map((story) => ({ slug: `${story.slug}.html` }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: routeSlug } = await params;
  const story = getStory(cleanSlug(routeSlug));
  if (!story) return { title: "Story not found" };

  const canonical = `${siteUrl}/confessions/${story.slug}.html`;
  return {
    title: story.title,
    description: story.deck,
    alternates: { canonical },
    robots: story.previewOnly ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      title: story.title,
      description: story.deck,
      url: canonical,
      siteName: "Almost — Unfiltered Dating",
    },
  };
}

export default async function ConfessionPage({ params }: PageProps) {
  const { slug: routeSlug } = await params;
  const story = getStory(cleanSlug(routeSlug));
  if (!story) notFound();

  return (
    <main className="story-shell">
      <header className="story-nav">
        <a className="brand" href="/" aria-label="Almost home">
          Almost<span>.</span>
        </a>
        <span className="preview-label">
          {story.previewOnly ? "Private design preview" : "Unfiltered Dating"}
        </span>
      </header>

      <section className="story-hero" aria-labelledby="story-title">
        <p className="story-kicker">
          {story.category} {story.previewOnly ? "· Design preview" : ""}
        </p>
        <h1 id="story-title">{story.title}</h1>
        <p className="story-deck">{story.deck}</p>
        <div className="story-byline">
          {story.attribution.map((item, index) => (
            <span className="byline-item" key={item}>
              {index > 0 && <span aria-hidden="true">·</span>}
              {item}
            </span>
          ))}
        </div>
        <a className="roleplay-hero-link" href="#roleplay-title">
          Step into the scene <span aria-hidden="true">↓</span>
        </a>
      </section>

      <div className="experience-grid">
        <article id="the-confession" className="confession" aria-label="The confession">
          <div className="chapter-mark"><span>01</span> THE CONFESSION</div>
          {story.segments.map((segment, index) =>
            segment.kind === "quote" ? (
              <blockquote key={`${segment.kind}-${index}`}>{segment.text}</blockquote>
            ) : (
              <p key={`${segment.kind}-${index}`}>{segment.text}</p>
            ),
          )}
          {story.previewOnly && (
            <p className="story-note">
              Temporary sample copy for the page design.
            </p>
          )}
        </article>

        <aside id="story-roleplay" className="roleplay-card" aria-labelledby="roleplay-title">
          <p className="roleplay-eyebrow">Step into this story</p>
          <h2 id="roleplay-title">What would you say next?</h2>
          <p className="roleplay-description">{story.roleplayDescription}</p>
          <RoleplayPanel
            characters={story.characters}
            storySlug={story.slug}
            storyCategory={story.category}
          />
          <p className="roleplay-boundary">{story.roleplayBoundary}</p>
        </aside>
      </div>
      <footer className="story-footer">
        <span>Almost · Unfiltered Dating</span>
        <span>{story.previewOnly ? "Story page design preview" : story.category}</span>
      </footer>
    </main>
  );
}
