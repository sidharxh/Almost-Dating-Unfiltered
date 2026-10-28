"use client";

import { useState, type FormEvent } from "react";

type Props = { storySlug: string; storyCategory: string };

function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("The story image interest form is not configured.");
  return { url: url.replace(/\/$/, ""), key };
}

async function saveInterestEvent(payload: Record<string, string | null>) {
  const { url, key } = supabaseConfig();
  const response = await fetch(`${url}/rest/v1/story_image_package_interest_events`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Interest could not be saved (${response.status}).`);
}

export default function StoryImagePackageInterest({ storySlug, storyCategory }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [clickStatus, setClickStatus] = useState<"idle" | "saving" | "saved" | "failed">("idle");
  const [formStatus, setFormStatus] = useState<"idle" | "saving" | "saved" | "failed">("idle");

  async function openRequest() {
    setIsOpen(true);
    if (clickStatus !== "idle") return;
    setClickStatus("saving");
    try {
      await saveInterestEvent({ story_slug: storySlug, story_category: storyCategory, event_type: "package_button_clicked", email: null });
      setClickStatus("saved");
    } catch (error) {
      console.warn("Story image request could not be recorded.", error instanceof Error ? error.message : "Unknown error");
      setClickStatus("failed");
    }
  }

  async function submitEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (formStatus === "saving") return;
    setFormStatus("saving");
    try {
      await saveInterestEvent({ story_slug: storySlug, story_category: storyCategory, event_type: "email_submitted", email: email.trim().toLowerCase() });
      setFormStatus("saved");
    } catch (error) {
      console.warn("Story image email could not be recorded.", error instanceof Error ? error.message : "Unknown error");
      setFormStatus("failed");
    }
  }

  return (
    <section className="image-package-box" id="image-package" aria-labelledby="image-package-title">
      <div className="image-package-heading">
        <p className="story-kicker">Images for this confession</p>
        <h2 id="image-package-title">Want the images from this story?</h2>
        <p>Request the images made for this confession. Leave your email and we’ll let you know when they’re ready to view or download.</p>
      </div>
      <div className="image-package-content">
        {!isOpen ? (
          <button className="image-package-cta" type="button" onClick={openRequest}>Request these story images <span aria-hidden="true">→</span></button>
        ) : formStatus === "saved" ? (
          <p className="interaction-status" role="status">Request received. We’ll email you when images for this confession are ready to view or download.</p>
        ) : (
          <form className="guide-form image-package-form" onSubmit={submitEmail}>
            <label htmlFor="image-package-email">Email address</label>
            <div className="guide-form-row">
              <input id="image-package-email" type="email" required maxLength={254} autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} />
              <button type="submit" disabled={formStatus === "saving"}>{formStatus === "saving" ? "Saving…" : "Register interest"}<span aria-hidden="true">→</span></button>
            </div>
            <p className="interaction-status" role="status" aria-live="polite">
              {formStatus === "failed" ? "We couldn’t save your email. Please try again." : clickStatus === "failed" ? "Your email can still be submitted, but the request wasn’t recorded." : "We’ll only use your email to update you about images for this confession."}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
