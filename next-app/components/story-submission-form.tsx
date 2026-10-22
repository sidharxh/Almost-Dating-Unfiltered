"use client";

import { useState } from "react";

export default function StorySubmissionForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <section className="submission-card" aria-labelledby="submission-title">
      <div className="submission-heading">
        <p className="story-kicker">Your dating confession</p>
        <h2 id="submission-title">Share the story.</h2>
        <p>We’ll review it before publication. Stories are anonymous by default.</p>
      </div>
      <form className="submission-fields" onSubmit={(event) => event.preventDefault()}>
        <label className="form-field">
          <span>Title</span>
          <input required maxLength={110} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Give your story a title" />
        </label>
        <label className="form-field">
          <span>Description</span>
          <textarea required minLength={80} maxLength={8000} rows={12} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Tell us what happened, in your own words…" />
          <small className="field-count">{description.length} / 8,000 characters</small>
        </label>
        <button className="form-submit" type="button" disabled>
          Story submission is not connected yet
        </button>
        <p className="not-saved-note">This prototype does not save or send your story.</p>
      </form>
    </section>
  );
}
