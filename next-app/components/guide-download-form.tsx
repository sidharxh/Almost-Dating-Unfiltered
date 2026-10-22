"use client";

import { useState, type FormEvent } from "react";

export default function GuideDownloadForm({ sourcePage }: { sourcePage: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "failed">("idle");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    try {
      if (!url || !key) throw new Error("Guide request service is unavailable.");
      const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/guide_leads`, {
        method: "POST", headers: { apikey: key, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ email: email.trim(), source_page: sourcePage }),
      });
      if (!response.ok) throw new Error(`Guide request could not be saved (${response.status}).`);
      setStatus("success");
      const link = document.createElement("a");
      link.href = "/hinge-glow-up-guide.pdf";
      link.download = "Almost-Hinge-Glow-Up-Guide.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.warn("Guide request could not be saved.", error instanceof Error ? error.message : "Unknown error");
      setStatus("failed");
    }
  }
  return <form className="guide-form" onSubmit={submit}>
    <label htmlFor="guide-email">Your email address</label>
    <div className="guide-form-row"><input id="guide-email" type="email" required maxLength={254} autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} /><button type="submit" disabled={status === "saving"}>{status === "saving" ? "Sending…" : "Get the free guide"}<span aria-hidden="true">→</span></button></div>
    <p className="interaction-status" role="status" aria-live="polite">{status === "success" ? "Your guide is downloading." : status === "failed" ? "We couldn’t process that request. Please try again." : "Enter your email to get the free guide download."}</p>
  </form>;
}
