import type { Metadata } from "next";
import StorySubmissionForm from "@/components/story-submission-form";

export const metadata: Metadata = {
  title: "Share a dating confession",
  description: "Submit an anonymous dating confession for review and publication.",
  robots: { index: false, follow: false },
};

export default function SubmitStoryPage() {
  return (
    <main className="submit-shell">
      <header className="story-nav">
        <a className="brand" href="/" aria-label="Almost — Unfiltered Dating">
          a<span>.</span>
        </a>
        <a className="back-link" href="/confessions">Browse confessions</a>
      </header>
      <section className="submit-intro">
        <p className="story-kicker">Your story, handled with care</p>
        <h1>Tell us what happened.</h1>
        <p>Share what happened in your own words. We review every story before it is published.</p>
        <div className="privacy-note">
          <span aria-hidden="true">✦</span>
          <span>Your story is anonymous by default. Include only details you’re comfortable sharing publicly.</span>
        </div>
      </section>
      <StorySubmissionForm />
    </main>
  );
}
