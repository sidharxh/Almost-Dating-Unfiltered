"use client";

import { useState, type FormEvent } from "react";

type Props = { storySlug: string; storyCategory: string; storyTitle: string; imageUrl?: string | null };

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

export default function StoryImagePackageInterest({ storySlug, storyCategory, storyTitle, imageUrl }: Props) {
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
        <p className="story-kicker">A closer look at this confession</p>
        <h2 id="image-package-title">Want to see the images behind this story?</h2>
        <p>Want a closer look at “{storyTitle}”? Ask for its related images, and we’ll email you when they’re ready to view or download.</p>
      </div>
      <div className="image-package-content">
        <div className="image-request-preview" role={imageUrl ? "img" : undefined} aria-label={imageUrl ? `Blurred preview of the image connected to ${storyTitle}` : undefined} aria-hidden={imageUrl ? undefined : true}>
          {imageUrl && <img src={imageUrl} alt="" aria-hidden="true" />}
          <div className="image-request-preview-overlay"><span>FROM THIS CONFESSION</span><strong>See the moment from another angle.</strong></div>
        </div>
        {!isOpen ? (
          <button className="image-package-cta" type="button" onClick={openRequest}>I want to see these images <span aria-hidden="true">→</span></button>
        ) : formStatus === "saved" ? (
          <p className="interaction-status" role="status">Request received. We’ll email you when images for “{storyTitle}” are ready to view or download.</p>
        ) : (
          <form className="guide-form image-package-form" onSubmit={submitEmail}>
            <label htmlFor="image-package-email">Email address</label>
            <div className="guide-form-row">
              <input id="image-package-email" type="email" required maxLength={254} autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} />
              <button type="submit" disabled={formStatus === "saving"}>{formStatus === "saving" ? "Sending…" : "Notify me when ready"}<span aria-hidden="true">→</span></button>
            </div>
            <p className="interaction-status" role="status" aria-live="polite">
              {formStatus === "failed" ? "We couldn’t save your email. Please try again." : clickStatus === "failed" ? "Your email can still be submitted, but the request wasn’t recorded." : "We’ll only email you about images for this confession."}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
