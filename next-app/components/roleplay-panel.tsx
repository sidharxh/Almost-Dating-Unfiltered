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
    <section className="roleplay-box" id="roleplay-action" aria-labelledby="roleplay-title">
      <div className="roleplay-box-heading">
        <p className="story-kicker">Roleplay this confession</p>
        <h2 id="roleplay-title">Choose who you’ll play.</h2>
        <p>Choose whether you want to play as the woman or man, then chat with the other character from this confession.</p>
      </div>
      <div className="roleplay-box-content">
        <p className="choice-label">Choose your character</p>
        <div className="perspective-options" role="group" aria-label="Choose the character to play">
          {(["woman", "man"] as const).map((choice) => (
            <button className={`perspective-option${perspective === choice ? " is-selected" : ""}`} type="button" key={choice}
              aria-pressed={perspective === choice} onClick={() => { setPerspective(choice); setStatus("idle"); }}>
              <span className="character-initial" aria-hidden="true">{choice === "woman" ? "W" : "M"}</span>
              <span className="character-copy"><span className="character-name">Play as the {choice}</span><span className="character-description">Take the {choice} character’s role in this confession.</span></span>
              <span className="perspective-check" aria-hidden="true">{perspective === choice ? "✓" : ""}</span>
            </button>
          ))}
        </div>
        <button className="start-roleplay" type="button" disabled={!perspective || status === "saving" || status === "saved"} onClick={startRoleplay}>
          {status === "saving" ? "Saving your choice…" : status === "saved" ? "Role saved" : perspective ? "Save my roleplay choice" : "Choose a character first"}<span aria-hidden="true">→</span>
        </button>
        <p className="interaction-status" role="status" aria-live="polite">
          {status === "saved" ? `Your choice to play as the ${perspective} is saved. The roleplay chat isn’t open yet.` : status === "failed" ? "We couldn’t save your role. Please try again." : "The chat is based on this confession. Save the role you’d like to play; the conversation isn’t open yet."}
        </p>
      </div>
    </section>
  );
}
