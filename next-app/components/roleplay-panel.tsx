"use client";

import { useState } from "react";

type RoleplayPanelProps = { storySlug: string; storyCategory: string };

export default function RoleplayPanel({ storySlug, storyCategory }: RoleplayPanelProps) {
  const [perspective, setPerspective] = useState<"woman" | "man" | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "failed">("idle");

  async function startRoleplay() {
    if (!perspective || status === "saving") return;
    setStatus("saving");
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    try {
      if (!url || !key) throw new Error("Public database configuration is unavailable.");
      const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/story_roleplay_interest_clicks`, {
        method: "POST",
        headers: { apikey: key, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ story_slug: storySlug, story_category: storyCategory, selected_perspective: perspective }),
      });
      if (!response.ok) throw new Error(`Selection could not be recorded (${response.status}).`);
      setStatus("saved");
    } catch (error) {
      console.warn("Role selection could not be recorded.", error instanceof Error ? error.message : "Unknown error");
      setStatus("failed");
    }
  }

  return (
    <div className="roleplay-start">
      <p className="choice-label">What gender would you like to roleplay as in this story?</p>
      <div className="perspective-options" role="group" aria-label="Choose a perspective">
        {(["woman", "man"] as const).map((choice) => (
          <button className={`perspective-option${perspective === choice ? " is-selected" : ""}`} type="button" key={choice}
            aria-pressed={perspective === choice} onClick={() => { setPerspective(choice); setStatus("idle"); }}>
            <span className="character-initial" aria-hidden="true">{choice === "woman" ? "W" : "M"}</span>
            <span className="character-name">{choice === "woman" ? "Woman’s perspective" : "Man’s perspective"}</span>
          </button>
        ))}
      </div>
      <button className="start-roleplay" type="button" disabled={!perspective || status === "saving"} onClick={startRoleplay}>
        {status === "saving" ? "Starting…" : "Start roleplay"}<span aria-hidden="true">→</span>
      </button>
      <p className="interaction-status" role="status" aria-live="polite">
        {status === "saved" ? "Your selection is recorded." : status === "failed" ? "We couldn’t save that selection. Please try again." : "Choose a perspective to continue."}
      </p>
    </div>
  );
}
