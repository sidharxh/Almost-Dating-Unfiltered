"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { STORY_CATEGORIES } from "@/lib/categories";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

type SubmissionStatus = "idle" | "saving" | "success" | "failed" | "image-failed";

function supabaseHeaders(key: string) {
  // This app uses a publishable key, which belongs in apikey only. A bearer
  // token is reserved for a signed-in user's JWT.
  return { apikey: key };
}

function storageObjectUrl(baseUrl: string, path: string) {
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  return `${baseUrl.replace(/\/$/, "")}/storage/v1/object/confession-images/${encodedPath}`;
}

async function readImageDimensions(file: File) {
  if (typeof createImageBitmap !== "function") return { width: null, height: null };
  const bitmap = await createImageBitmap(file);
  const dimensions = { width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return dimensions;
}

export default function StorySubmissionForm() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [adultConsent, setAdultConsent] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [storyId, setStoryId] = useState<string | null>(null);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!image) {
      setImagePreview(null);
      return;
    }
    const previewUrl = URL.createObjectURL(image);
    setImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [image]);

  function selectImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    setImageError("");
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES[file.type]) {
      setImage(null);
      setImageError("Choose a JPG, PNG, WebP, or AVIF image.");
      event.currentTarget.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setImage(null);
      setImageError("The image must be 5 MB or smaller.");
      event.currentTarget.value = "";
      return;
    }
    setImage(file);
    setStatus("idle");
  }

  function clearImage() {
    if (storyId) return;
    setImage(null);
    setImageError("");
    setStatus("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!adultConsent) return;
    if (imageError) return;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) {
      setStatus("failed");
      return;
    }

    setStatus("saving");
    let savedStoryId = storyId;
    let savedImagePath = imagePath;
    try {
      if (!savedStoryId) {
        const dimensions = image ? await readImageDimensions(image) : { width: null, height: null };
        const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/confessions?select=id`, {
          method: "POST",
          headers: { ...supabaseHeaders(key), "Content-Type": "application/json", Prefer: "return=representation" },
          body: JSON.stringify({
            title: title.trim(),
            body: description.trim(),
            category,
            author: "Anonymous",
            status: "pending",
            image_alt: image ? title.trim() : null,
            image_metadata: image ? {
              mime_type: image.type,
              size_bytes: image.size,
              width: dimensions.width,
              height: dimensions.height,
            } : {},
          }),
        });
        if (!response.ok) throw new Error(`Story could not be submitted (${response.status}).`);
        const rows = await response.json() as Array<{ id: string }>;
        savedStoryId = rows[0]?.id ?? null;
        if (!savedStoryId) throw new Error("The submitted story did not return an ID.");
        setStoryId(savedStoryId);
      }

      if (image && savedStoryId) {
        const extension = ALLOWED_IMAGE_TYPES[image.type];
        savedImagePath ??= `submissions/${savedStoryId}/cover-${savedStoryId}.${extension}`;
        setImagePath(savedImagePath);

        // Remove an unlinked object left by a previous interrupted attempt, then retry the same path.
        await fetch(storageObjectUrl(url, savedImagePath), {
          method: "DELETE",
          headers: supabaseHeaders(key),
        }).catch(() => undefined);

        const upload = await fetch(storageObjectUrl(url, savedImagePath), {
          method: "POST",
          headers: { ...supabaseHeaders(key), "Content-Type": image.type, "x-upsert": "false", "cache-control": "31536000" },
          body: image,
        });
        if (!upload.ok) throw new Error(`Image upload failed (${upload.status}).`);

        const query = new URLSearchParams({ id: `eq.${savedStoryId}`, status: "eq.pending", image_path: "is.null", select: "id" });
        const linked = await fetch(`${url.replace(/\/$/, "")}/rest/v1/confessions?${query}`, {
          method: "PATCH",
          headers: { ...supabaseHeaders(key), "Content-Type": "application/json", Prefer: "return=representation" },
          body: JSON.stringify({ image_path: savedImagePath }),
        });
        const linkedRows = linked.ok ? await linked.json() as Array<{ id: string }> : [];
        if (!linked.ok || linkedRows.length === 0) {
          await fetch(storageObjectUrl(url, savedImagePath), { method: "DELETE", headers: supabaseHeaders(key) }).catch(() => undefined);
          throw new Error("Image could not be linked to the story.");
        }
      }

      setStatus("success");
      setTitle("");
      setCategory("");
      setDescription("");
      setAdultConsent(false);
      setImage(null);
      setImagePath(null);
      setStoryId(null);
    } catch (error) {
      const imageWasPending = Boolean(savedStoryId && image);
      console.warn("Story submission could not be saved.", error instanceof Error ? error.message : "Unknown error");
      setStatus(imageWasPending ? "image-failed" : "failed");
    }
  }

  const statusMessage = status === "success"
    ? "Your story has been submitted for review."
    : status === "image-failed"
      ? "Your story was saved, but its image didn’t finish uploading. Submit again to retry the image."
      : status === "failed"
        ? "We couldn’t submit your story. Please try again."
        : status === "saving"
          ? image ? "Saving your story and image…" : "Saving your story…"
          : "Your story will appear after review.";

  return (
    <section className="submission-card" aria-labelledby="submission-title">
      <div className="submission-heading"><p className="story-kicker">Your dating confession</p><h2 id="submission-title">Share the story.</h2><p>We’ll review it before publication. Stories are anonymous by default.</p></div>
      <form className="submission-fields" onSubmit={submit}>
        <label className="form-field"><span>Title</span><input required maxLength={110} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Give your story a title" disabled={Boolean(storyId) || status === "saving"} /></label>
        <label className="form-field"><span>Category</span><select required value={category} onChange={(event) => setCategory(event.target.value)} disabled={Boolean(storyId) || status === "saving"}><option value="" disabled>Choose a category</option>{STORY_CATEGORIES.map((item) => <option key={item.slug} value={item.label}>{item.label}</option>)}</select></label>
        <label className="form-field"><span>Description</span><textarea required minLength={80} maxLength={8000} rows={12} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Tell us what happened, in your own words…" disabled={Boolean(storyId) || status === "saving"} /><small className="field-count">{description.length} / 8,000 characters</small></label>
        <div className="form-field image-upload-field">
          <span>Story image <small>Optional · one image per story</small></span>
          <label className={`image-upload-control${imagePreview ? " has-image" : ""}${storyId ? " is-locked" : ""}`}>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={selectImage} disabled={Boolean(storyId) || status === "saving"} />
            {imagePreview ? <img src={imagePreview} alt="Preview of the story cover image" /> : <span className="image-upload-placeholder"><strong>Choose an image</strong><small>JPG, PNG, WebP, or AVIF · up to 5 MB</small></span>}
          </label>
          {image && <div className="image-selection-details"><small className="image-file-details">{image.name} · {(image.size / 1024 / 1024).toFixed(1)} MB</small><button type="button" onClick={clearImage} disabled={Boolean(storyId) || status === "saving"}>Remove image</button></div>}
          <small>Landscape images around 1200 × 675 px work best. We’ll fit the image to each screen size.</small>
          {imageError && <small className="image-upload-error" role="alert">{imageError}</small>}
        </div>
        <label className="consent-field"><input type="checkbox" required checked={adultConsent} onChange={(event) => setAdultConsent(event.target.checked)} disabled={Boolean(storyId) || status === "saving"} /><span>I confirm I’m 18 or older and consent to my story being reviewed for anonymous publication.</span></label>
        <button className="form-submit" type="submit" disabled={status === "saving"}>{status === "saving" ? "Submitting…" : status === "image-failed" ? "Retry image upload" : "Submit your story"}</button>
        <p className="interaction-status" role="status" aria-live="polite">{statusMessage}</p>
      </form>
    </section>
  );
}
