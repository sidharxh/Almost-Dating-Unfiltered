"use client";

import { useState } from "react";

type Props = { title: string; storyUrl: string; imageUrl: string };

async function getImageFile(imageUrl: string, title: string) {
  const response = await fetch(imageUrl);
  if (!response.ok) throw new Error("The story image could not be prepared.");
  const blob = await response.blob();
  return new File([blob], `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "almost-story"}.png`, { type: "image/png" });
}

function saveImage(file: File) {
  const objectUrl = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

export default function StoryShare({ title, storyUrl, imageUrl }: Props) {
  const [status, setStatus] = useState("");
  const shareText = `Read “${title}” on Almost.`;

  async function copyStoryLink() {
    try {
      await navigator.clipboard.writeText(storyUrl);
      setStatus("Story link copied.");
    } catch {
      setStatus("Copy wasn’t available. Use your browser’s address bar to copy the story link.");
    }
  }

  async function shareStory() {
    setStatus("Preparing the story card…");
    try {
      const file = await getImageFile(imageUrl, title);
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title, text: shareText, url: storyUrl, files: [file] });
        setStatus("Story card and link shared.");
        return;
      }
      saveImage(file);
      try {
        await navigator.clipboard.writeText(storyUrl);
        setStatus("Story image downloaded and link copied. Attach the image where you share it.");
      } catch {
        setStatus("Story image downloaded. Use Copy story link to copy its URL.");
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        setStatus("Sharing cancelled.");
        return;
      }
      setStatus("The story card could not be prepared. You can still copy the story link.");
    }
  }

  async function downloadForSocialPost() {
    setStatus("Preparing the story card…");
    try {
      const file = await getImageFile(imageUrl, title);
      saveImage(file);
      try {
        await navigator.clipboard.writeText(storyUrl);
        setStatus("Story card downloaded and link copied. Add the card to Instagram, then use a Story link sticker or bio link; on YouTube, add the URL to the description or a pinned comment.");
      } catch {
        setStatus("Story card downloaded. Use Copy story link to copy its URL.");
      }
    } catch {
      setStatus("The story card could not be prepared. You can still copy the story link.");
    }
  }

  return (
    <section className="story-share" aria-labelledby="story-share-title">
      <div className="story-share-copy"><p className="story-kicker">Share this confession</p><h2 id="story-share-title">Pass the story along.</h2><p>The share card includes the story title and Almost. branding.</p></div>
      <div className="story-share-actions">
        <button type="button" onClick={shareStory}>Share image + link <span aria-hidden="true">↗</span></button>
        <a href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${storyUrl}`)}`} target="_blank" rel="noreferrer">WhatsApp <span aria-hidden="true">↗</span></a>
        <button type="button" onClick={downloadForSocialPost}>Instagram / YouTube card <span aria-hidden="true">↓</span></button>
        <button type="button" className="story-share-copy-link" onClick={copyStoryLink}>Copy story link</button>
      </div>
      <p className="story-share-status" role="status" aria-live="polite">{status || "WhatsApp shares a story link. For Instagram or YouTube, download the card and add the link to your post."}</p>
    </section>
  );
}
