"use client";

import { useState, type FormEvent } from "react";
import { STORY_CATEGORIES } from "@/lib/categories";

export default function StorySubmissionForm() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "failed">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    try {
      if (!url || !key) throw new Error("Story submission service is unavailable.");
      const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/confessions`, {
        method: "POST",
        headers: { apikey: key, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ title: title.trim(), body: description.trim(), category, author: "Anonymous", status: "pending" }),
      });
      if (!response.ok) throw new Error(`Story could not be submitted (${response.status}).`);
      setStatus("success");
      setTitle("");
      setCategory("");
      setDescription("");
    } catch (error) {
      console.warn("Story submission could not be saved.", error instanceof Error ? error.message : "Unknown error");
      setStatus("failed");
    }
  }

  return (
    <section className="submission-card" aria-labelledby="submission-title">
      <div className="submission-heading"><p className="story-kicker">Your dating confession</p><h2 id="submission-title">Share the story.</h2><p>We’ll review it before publication. Stories are anonymous by default.</p></div>
      <form className="submission-fields" onSubmit={submit}>
        <label className="form-field"><span>Title</span><input required maxLength={110} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Give your story a title" /></label>
        <label className="form-field"><span>Category</span><select required value={category} onChange={(event) => setCategory(event.target.value)}><option value="" disabled>Choose a category</option>{STORY_CATEGORIES.map((item) => <option key={item.slug} value={item.label}>{item.label}</option>)}</select></label>
        <label className="form-field"><span>Description</span><textarea required minLength={80} maxLength={8000} rows={12} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Tell us what happened, in your own words…" /><small className="field-count">{description.length} / 8,000 characters</small></label>
        <button className="form-submit" type="submit" disabled={status === "saving"}>{status === "saving" ? "Submitting…" : "Submit your story"}</button>
        <p className="interaction-status" role="status" aria-live="polite">{status === "success" ? "Your story has been submitted for review." : status === "failed" ? "We couldn’t submit your story. Please try again." : "Your story will appear after review."}</p>
      </form>
    </section>
  );
}
