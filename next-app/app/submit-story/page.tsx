import type { Metadata } from "next";
import StorySubmissionForm from "@/components/story-submission-form";

export const metadata: Metadata = {
  title: "Share a dating confession",
  description: "Share an anonymous dating confession for review.",
  robots: { index: false, follow: false },
};

export default function SubmitStoryPage() {
  return (
    <main className="submit-shell">
      <header className="story-nav">
        <a className="brand" href="/" aria-label="Almost home">
          Almost<span>.</span>
        </a>
        <a className="back-link" href="/confessions/design-preview.html">Back to story preview</a>
      </header>
      <section className="submit-intro">
        <p className="story-kicker">Your story, handled with care</p>
        <h1>Tell us what happened.</h1>
        <p>Share the confession in your own words. Readers will choose their role when they open it.</p>
        <div className="privacy-note">
          <span aria-hidden="true">✦</span>
          <span>Stories are anonymous by default and reviewed before publication. The roleplay is created for readers from the story itself; you don’t need to set it up.</span>
        </div>
      </section>
      <StorySubmissionForm />
    </main>
  );
}
