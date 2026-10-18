#!/usr/bin/env python3
"""Publish one editorial confession as a static, indexable GitHub Pages page.

Input is a JSON file with: slug, title, category, description, published_date,
and paragraphs (array of strings). See scripts/confession.example.json.
"""
from __future__ import annotations

import html
import json
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://almostunfiltereddating.com/"
CATEGORIES = {
    "First dates", "Ghosting", "Situationships", "Dating disasters", "Green flags",
    "Breakups & exes", "Secret crushes", "LGBTQ+ dating", "Intimacy & 18+",
    "Serious intentions",
}


def fail(message: str) -> None:
    raise SystemExit(f"Error: {message}")


def main() -> None:
    if len(sys.argv) != 2:
        fail("Usage: python3 scripts/publish_confession.py path/to/story.json")
    source = Path(sys.argv[1]).resolve()
    try:
        story = json.loads(source.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        fail(f"could not read JSON input: {exc}")

    required = ("slug", "title", "category", "description", "published_date", "paragraphs")
    if any(not story.get(key) for key in required):
        fail("provide slug, title, category, description, published_date, and paragraphs")
    slug = story["slug"]
    if not isinstance(slug, str) or not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug):
        fail("slug must use lowercase letters, numbers, and hyphens")
    if story["category"] not in CATEGORIES:
        fail("choose a category from: " + ", ".join(sorted(CATEGORIES)))
    if not isinstance(story["paragraphs"], list) or not all(isinstance(p, str) and p.strip() for p in story["paragraphs"]):
        fail("paragraphs must be an array of non-empty strings")
    if len(story["title"].strip()) > 110:
        fail("title must be 110 characters or fewer")
    if len(story["description"].strip()) > 300:
        fail("description must be 300 characters or fewer")
    try:
        date.fromisoformat(story["published_date"])
    except (TypeError, ValueError):
        fail("published_date must use YYYY-MM-DD")

    rel_path = f"confessions/{slug}.html"
    target = ROOT / rel_path
    archive_path = ROOT / "confessions.html"
    sitemap_path = ROOT / "sitemap.xml"
    if target.exists():
        fail(f"{rel_path} already exists")

    archive = archive_path.read_text(encoding="utf-8")
    sitemap = sitemap_path.read_text(encoding="utf-8")
    if f'"url": "{rel_path}"' in archive or f"{BASE}{rel_path}</loc>" in sitemap:
        fail("this slug is already listed")

    title = story["title"].strip()
    description = story["description"].strip()
    category = story["category"]
    url = BASE + rel_path
    e = lambda value: html.escape(str(value), quote=True)
    paragraphs = "\n".join(f"<p>{e(p.strip())}</p>" for p in story["paragraphs"])
    adult = category == "Intimacy & 18+"
    article_json = {
        "@context": "https://schema.org", "@type": "Article", "headline": title,
        "description": description, "datePublished": story["published_date"],
        "dateModified": story["published_date"], "author": {"@type": "Organization", "name": "Almost"},
        "mainEntityOfPage": {"@type": "WebPage", "@id": url},
        "articleSection": category,
    }
    page = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(title)} | Almost</title><meta name="description" content="{e(description)}">
<meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="{url}">
<meta property="og:type" content="article"><meta property="og:site_name" content="Almost — Dating, Unfiltered">
<meta property="og:title" content="{e(title)} | Almost"><meta property="og:description" content="{e(description)}"><meta property="og:url" content="{url}">
<meta name="twitter:card" content="summary"><script type="application/ld+json">{json.dumps(article_json, ensure_ascii=False)}</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-WWJH2R0QS6"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments)}}gtag('js',new Date());gtag('config','G-WWJH2R0QS6',{{page_title:document.title,page_location:location.href,page_path:location.pathname}});</script>
<style>:root{{--bg:#100b17;--paper:#1b1324;--ink:#f4eef9;--muted:#c4bacf;--line:#392b49;--accent:#b99be8;--pink:#ff79b8}}*{{box-sizing:border-box}}body{{margin:0;background:var(--bg);color:var(--ink);font:16px/1.8 Inter,system-ui,sans-serif}}.wrap{{max-width:760px;margin:auto;padding:26px 22px 70px}}a{{color:var(--accent)}}.brand{{font:700 30px Georgia,serif;color:var(--ink);text-decoration:none}}.back{{display:inline-block;margin:30px 0 22px;text-decoration:none}}.tag{{display:inline-block;border:1px solid var(--line);border-radius:99px;padding:5px 12px;color:var(--accent);font-size:12px;text-transform:uppercase;letter-spacing:1px}}h1{{font:500 clamp(36px,7vw,56px)/1.08 Georgia,serif;letter-spacing:-1px;margin:20px 0}}.meta{{color:var(--muted);font-size:13px}}article{{background:var(--paper);border:1px solid var(--line);border-radius:18px;padding:clamp(20px,5vw,38px);margin-top:26px}}article p{{margin:0 0 18px}}article p:last-child{{margin-bottom:0}}.related{{margin-top:28px;display:flex;flex-wrap:wrap;gap:18px}}.guide-inline-button{{font:inherit;color:var(--accent);background:transparent;border:0;padding:0;text-decoration:underline;text-underline-offset:3px;cursor:pointer}}.brand span{{color:var(--pink)}}</style></head>
<body><main class="wrap"><a class="brand" href="../index.html">almost<span>.</span></a><br><a class="back" href="../confessions.html">← Back to confessions</a><div><span class="tag">{e(category)}</span></div>
<h1>{e(title)}</h1><div class="meta">Anonymous Confession{' · 18+' if adult else ''} · Published {e(story['published_date'])}</div><article>{paragraphs}</article>
<div class="related"><a href="../confessions.html">Read more confessions →</a><button type="button" class="guide-inline-button" data-open-guide>Get the free Hinge guide →</button></div></main>
<script id="almost-ga-click-tracking">document.addEventListener('click',function(event){{var el=event.target.closest&&event.target.closest('a,button,[role="button"]');if(!el||typeof gtag!=="function")return;gtag('event','ui_click',{{element_text:(el.getAttribute('aria-label')||el.innerText||'').replace(/\\s+/g,' ').trim().slice(0,100),element_type:el.tagName.toLowerCase(),page_path:location.pathname,page_title:document.title,link_url:el.tagName==='A'?(el.getAttribute('href')||''):''}})}},true);</script>
</body></html>'''
    # Add the new static article to the hand-authored story manifest used by the archive.
    marker = "];\nconst categories=["
    if marker not in archive:
        fail("could not locate the static story list in confessions.html")
    card = {"cat": category, "title": title, "desc": description, "url": rel_path, "adult": adult}
    archive = archive.replace(marker, ",\n  " + json.dumps(card, ensure_ascii=False, indent=2).replace("\n", "\n  ") + marker, 1)
    escaped_loc = html.escape(url)
    sitemap = sitemap.replace("</urlset>", f"  <url><loc>{escaped_loc}</loc><lastmod>{story['published_date']}</lastmod></url>\n</urlset>")

    target.write_text(page, encoding="utf-8")
    archive_path.write_text(archive, encoding="utf-8")
    sitemap_path.write_text(sitemap, encoding="utf-8")
    print(f"Published {rel_path}; added it to confessions.html and sitemap.xml")


if __name__ == "__main__":
    main()
