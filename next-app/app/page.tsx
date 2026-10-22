export default function HomePage() {
  return (
    <main className="shell">
      <a className="brand" href="/" aria-label="Almost home">
        Almost<span>.</span>
      </a>
      <p className="eyebrow">Unfiltered dating</p>
      <h1>A new story experience is taking shape.</h1>
      <p className="intro">
        Intimate dating confessions, each with its own story-based roleplay.
      </p>
      <a className="preview-link" href="/confessions/design-preview.html">
        View the story-page prototype <span aria-hidden="true">↗</span>
      </a>
      <a className="preview-link preview-link-secondary" href="/submit-story">
        View the story submission draft <span aria-hidden="true">↗</span>
      </a>
      <p className="status">The new experience is being designed.</p>
    </main>
  );
}
