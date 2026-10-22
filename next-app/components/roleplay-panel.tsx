"use client";

import { useState } from "react";
import type { StoryCharacter } from "@/lib/stories";

type RoleplayPanelProps = {
  characters: StoryCharacter[];
  storySlug: string;
  storyCategory: string;
};

export default function RoleplayPanel({ characters, storySlug, storyCategory }: RoleplayPanelProps) {
  const [perspective, setPerspective] = useState<string | null>(null);
  const [adultConfirmed, setAdultConfirmed] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [interestStatus, setInterestStatus] = useState<"idle" | "saving" | "saved" | "failed">("idle");

  async function handleRoleplayClick() {
    if (!perspective || !adultConfirmed) return;

    setInterestStatus("saving");
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    const selectedPerspective = characters.find((character) => character.name === perspective)?.genderLabel.toLowerCase();

    try {
      if (!supabaseUrl || !publishableKey || !selectedPerspective) {
        throw new Error("Supabase public client configuration is missing.");
      }

      const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/story_roleplay_interest_clicks`, {
        method: "POST",
        headers: {
          apikey: publishableKey,
          Authorization: `Bearer ${publishableKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          story_slug: storySlug,
          story_category: storyCategory,
          selected_perspective: selectedPerspective,
        }),
      });
      if (!response.ok) throw new Error(`Roleplay interest could not be saved (${response.status}).`);
      setInterestStatus("saved");
    } catch (error) {
      console.warn("Roleplay interest could not be saved.", error);
      setInterestStatus("failed");
    }
    setShowComingSoon(true);
  }

  return (
    <div className="roleplay-start">
      <p className="choice-label">What gender would you like to roleplay as in this story?</p>
      <div className="perspective-options" role="group" aria-label="Choose the gender perspective for this roleplay">
        {characters.map((character) => (
          <button
            className={`perspective-option${perspective === character.name ? " is-selected" : ""}`}
            type="button"
            key={character.name}
            aria-pressed={perspective === character.name}
            onClick={() => {
              setPerspective(character.name);
            }}
          >
            <span className="character-initial" aria-hidden="true">
              {character.name[0]}
            </span>
            <span className="character-name">{character.genderLabel}’s perspective</span>
            <span className="character-cue">{character.cue}</span>
          </button>
        ))}
      </div>

      <label className="adult-confirmation">
        <input
          type="checkbox"
          checked={adultConfirmed}
          onChange={(event) => setAdultConfirmed(event.target.checked)}
        />
        <span>I’m 18 or older and understand this is an interactive roleplay.</span>
      </label>

      <button
        className="start-roleplay"
        type="button"
        disabled={!perspective || !adultConfirmed || interestStatus === "saving"}
        onClick={handleRoleplayClick}
      >
        {interestStatus === "saving" ? "Saving your interest…" : perspective ? "Start roleplay" : "Choose a roleplay gender"}
        <span aria-hidden="true">→</span>
      </button>
      <p className="prototype-status" role="status" aria-live="polite">
        {!perspective
          ? "Choose a role, then confirm you’re 18 or older to enter the scene."
          : !adultConfirmed
            ? `You’ll take the ${characters.find((character) => character.name === perspective)?.genderLabel.toLowerCase()} perspective. The other character will respond within the story.`
            : "Your scene is set. Roleplay is coming soon."}
      </p>

      {showComingSoon && (
        <div className="coming-soon-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setShowComingSoon(false);
        }}>
          <section
            className="coming-soon-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="coming-soon-title"
            aria-describedby="coming-soon-message"
          >
            <p className="roleplay-eyebrow">Almost · Unfiltered Dating</p>
            <h3 id="coming-soon-title">Roleplay is coming soon</h3>
            <p id="coming-soon-message">
              {interestStatus === "saved"
                ? "We’ve recorded your interest. We’re building this story’s roleplay experience. Check back soon."
                : "We’re building this story’s roleplay experience. Check back soon. Your interest could not be recorded this time."}
            </p>
            <button className="start-roleplay" type="button" onClick={() => setShowComingSoon(false)}>
              Got it <span aria-hidden="true">×</span>
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
