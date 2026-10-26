"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "./admin-review.module.css";

type Submission = { id: string; title: string; category: string; author: string; body: string; created_at: string; image_path: string | null; image_alt: string | null };
type PendingComment = { id: string; story_slug: string; author_label: string; body: string; created_at: string };

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const apiHeaders = () => ({ apikey: supabaseKey ?? "", "Content-Type": "application/json" });

export default function AdminReview() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [comments, setComments] = useState<PendingComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true); setError(""); setNotice("");
    if (!supabaseUrl || !supabaseKey) { setError("Database connection is not configured for this deployment."); setLoading(false); return; }
    try {
      const [storyResponse, commentResponse] = await Promise.all([
        fetch(`${supabaseUrl}/rest/v1/confessions?select=id,title,category,author,body,created_at,image_path,image_alt&status=eq.pending&order=created_at.asc&limit=100`, { headers: apiHeaders() }),
        fetch(`${supabaseUrl}/rest/v1/story_comments?select=id,story_slug,author_label,body,created_at&status=eq.pending&order=created_at.asc&limit=100`, { headers: apiHeaders() }),
      ]);
      if (!storyResponse.ok || !commentResponse.ok) throw new Error("Could not load pending reviews. Check the Supabase connection and permissions, then refresh.");
      const [storyRows, commentRows] = await Promise.all([storyResponse.json(), commentResponse.json()]) as [Submission[], PendingComment[]];
      setSubmissions(storyRows); setComments(commentRows);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not load pending reviews."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  async function approve(table: "confessions" | "story_comments", id: string) {
    const story = table === "confessions";
    if (!window.confirm(story ? "Approve this story and publish it in the confession archive?" : "Approve this comment and make it public?")) return;
    setBusyId(id); setError(""); setNotice("");
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}&status=eq.pending`, {
        method: "PATCH", headers: { ...apiHeaders(), Prefer: "return=minimal" }, body: JSON.stringify({ status: "approved" }),
      });
      if (!response.ok) throw new Error(`Could not approve this ${story ? "story" : "comment"}. Refresh and try again.`);
      if (story) setSubmissions((rows) => rows.filter((row) => row.id !== id));
      else setComments((rows) => rows.filter((row) => row.id !== id));
      setNotice(story ? "Story approved and published." : "Comment approved.");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Approval failed. Refresh and try again."); }
    finally { setBusyId(""); }
  }

  return <main className={styles.shell}>
    <header className={styles.header}><a className={styles.brand} href="/" aria-label="Almost home">Almost<span>.</span></a><a href="/confessions">View confessions</a></header>
    <section className={styles.intro}><p className={styles.kicker}>Almost · Unfiltered Dating</p><h1>Review submissions</h1><p>Read each story and approve submissions you want to publish. Approved stories appear in the confession archive.</p></section>
    <aside className={styles.notice}><strong>Open community review:</strong> anyone who visits this page can approve a pending story or comment.</aside>
    <div className={styles.toolbar}><h2>Pending stories <span>{submissions.length}</span></h2><button type="button" onClick={() => void refresh()} disabled={loading}>{loading ? "Refreshing…" : "Refresh"}</button></div>
    {error && <p className={styles.error} role="alert">{error}</p>}{notice && <p className={styles.success} role="status">{notice}</p>}
    {loading ? <p className={styles.empty}>Loading submissions…</p> : submissions.length ? <div className={styles.queue}>{submissions.map((item) => <article className={styles.card} key={item.id}>
      <span className={styles.category}>{item.category}</span><h3>{item.title}</h3><p className={styles.meta}>{item.author || "Anonymous"} · {new Date(item.created_at).toLocaleString()}</p>
      {item.image_path && supabaseUrl && <img className={styles.cover} src={`${supabaseUrl}/storage/v1/object/public/confession-images/${item.image_path.split("/").map(encodeURIComponent).join("/")}`} alt={item.image_alt || `Cover image for ${item.title}`} />}
      <p className={styles.story}>{item.body}</p>
      <button type="button" onClick={() => void approve("confessions", item.id)} disabled={busyId === item.id}>{busyId === item.id ? "Approving…" : "Approve story"}</button>
    </article>)}</div> : <p className={styles.empty}>There are no pending stories.</p>}
    <div className={styles.toolbar}><h2>Pending comments <span>{comments.length}</span></h2><button type="button" onClick={() => void refresh()} disabled={loading}>{loading ? "Refreshing…" : "Refresh"}</button></div>
    {loading ? <p className={styles.empty}>Loading comments…</p> : comments.length ? <div className={styles.queue}>{comments.map((item) => <article className={styles.card} key={item.id}>
      <p className={styles.meta}>{item.author_label || "Anonymous"} · Story: {item.story_slug}</p><p className={styles.story}>{item.body}</p>
      <button type="button" onClick={() => void approve("story_comments", item.id)} disabled={busyId === item.id}>{busyId === item.id ? "Approving…" : "Approve comment"}</button>
    </article>)}</div> : <p className={styles.empty}>There are no pending comments.</p>}
    <footer className={styles.footer}><a href="/confessions">← Back to confessions</a></footer>
  </main>;
}
