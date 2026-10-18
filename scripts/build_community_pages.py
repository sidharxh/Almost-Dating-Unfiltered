#!/usr/bin/env python3
"""Build static SEO pages for all approved Supabase community stories."""
from __future__ import annotations

import html
import json
import re
import shutil
import unicodedata
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://almostunfiltereddating.com"
SITEMAP_NS = "http://www.sitemaps.org/schemas/sitemap/0.9"
ET.register_namespace("", SITEMAP_NS)


def escape(value: object) -> str:
    return html.escape(str(value or ""), quote=True)


def slugify(title: str, story_id: str) -> str:
    normalized = unicodedata.normalize("NFKD", title).encode("ascii", "ignore").decode().lower()
    words = re.sub(r"[^a-z0-9]+", "-", normalized).strip("-")[:64].rstrip("-")
    suffix = re.sub(r"[^a-f0-9]", "", story_id.lower())[:8]
    return f"{words or 'community-story'}-{suffix}"


def supabase_config() -> tuple[str, str]:
    archive = (ROOT / "confessions.html").read_text(encoding="utf-8")
    url = re.search(r'const SUPABASE_URL="([^"]+)"', archive)
    key = re.search(r'const SUPABASE_KEY="(sb_publishable_[^"]+)"', archive)
    if not url or not key:
        raise RuntimeError("Could not find the public Supabase URL and publishable key in confessions.html")
    return url.group(1), key.group(1)


def fetch_approved() -> list[dict[str, object]]:
    api, key = supabase_config()
    rows: list[dict[str, object]] = []
    start = 0
    page_size = 500
    while True:
        query = urllib.parse.urlencode({
            "select": "id,title,category,author,body,created_at,status",
            "status": "eq.approved",
            "order": "created_at.asc,id.asc",
            "limit": str(page_size),
            "offset": str(start),
        })
        request = urllib.request.Request(
            f"{api}/rest/v1/confessions?{query}",
            headers={"apikey": key, "Accept": "application/json"},
        )
        with urllib.request.urlopen(request, timeout=30) as response:
            page = json.load(response)
        if not isinstance(page, list):
            raise RuntimeError("Supabase returned an unexpected response")
        rows.extend(row for row in page if row.get("status") == "approved")
        if len(page) < page_size:
            break
        start += page_size
    return rows


def add_static_schema(page: Path, is_homepage: bool = False, is_archive: bool = False) -> None:
    source = page.read_text(encoding="utf-8")
    if 'type="application/ld+json"' in source:
        return
    title_match = re.search(r"<title>(.*?)</title>", source, re.I | re.S)
    canonical_match = re.search(r'<link\s+rel="canonical"\s+href="([^"]+)"', source, re.I)
    description_match = re.search(r'<meta\s+name="description"\s+content="([^"]*)"', source, re.I)
    if not title_match:
        return
    title = html.unescape(re.sub(r"<[^>]+>", "", title_match.group(1))).strip()
    if not is_homepage and not is_archive:
        source = re.sub(r"<title>(.*?)\s+\|\s+Almost</title>", r"<title>\1 | Unfiltered Dating</title>", source, count=1, flags=re.I | re.S)
        source = re.sub(r'(<meta\s+property="og:title"\s+content=")(.*?\s+\|\s+)Almost("\s*/?>)', lambda match: match.group(1) + match.group(2) + "Unfiltered Dating" + match.group(3), source, count=1, flags=re.I | re.S)
        if 'property="og:site_name"' not in source:
            source = re.sub(r'(<meta\s+property="og:type"\s+content="[^"]+"\s*/?>)', r'\1<meta property="og:site_name" content="Almost — Unfiltered Dating">', source, count=1, flags=re.I)
        if 'name="twitter:title"' not in source:
            source = re.sub(r'(<meta\s+name="twitter:card"\s+content="[^"]+"\s*/?>)', r'\1<meta name="twitter:title" content="' + escape(title.replace(" | Almost", " | Unfiltered Dating")) + '">', source, count=1, flags=re.I)
        if 'name="twitter:description"' not in source and description_match:
            source = re.sub(r'(<meta\s+name="twitter:card"\s+content="[^"]+"\s*/?>)', lambda match: match.group(1) + '<meta name="twitter:description" content="' + escape(html.unescape(description_match.group(1))) + '">', source, count=1, flags=re.I)
    canonical = html.unescape(canonical_match.group(1)) if canonical_match else SITE + "/"
    if is_homepage:
        schema: dict[str, object] = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Almost",
            "alternateName": "Unfiltered Dating",
            "url": SITE + "/",
        }
    elif is_archive:
        schema = {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": title,
            "description": html.unescape(description_match.group(1)) if description_match else title,
            "url": canonical,
        }
    else:
        heading_match = re.search(r"<h1[^>]*>(.*?)</h1>", source, re.I | re.S)
        headline = html.unescape(re.sub(r"<[^>]+>", "", heading_match.group(1))).strip() if heading_match else title
        category_match = re.search(r'<span\s+class="tag"[^>]*>(.*?)</span>', source, re.I | re.S)
        schema = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": headline,
            "mainEntityOfPage": {"@type": "WebPage", "@id": canonical},
            "author": {"@type": "Organization", "name": "Almost"},
            "publisher": {"@type": "Organization", "name": "Almost"},
        }
        if description_match:
            schema["description"] = html.unescape(description_match.group(1))
        if category_match:
            schema["articleSection"] = html.unescape(re.sub(r"<[^>]+>", "", category_match.group(1))).strip()
    payload = json.dumps(schema, ensure_ascii=False).replace("</", "<\\/")
    source = re.sub(r"</head>", f'<script type="application/ld+json">{payload}</script>\n</head>', source, count=1, flags=re.I)
    page.write_text(source, encoding="utf-8")


def render_story(row: dict[str, object], slug: str, description: str) -> str:
    title = str(row.get("title") or "Community dating story").strip()
    category = str(row.get("category") or "Dating stories")
    body = str(row.get("body") or "").strip()
    paragraphs = [part.strip() for part in re.split(r"\n\s*\n", body) if part.strip()]
    if len(paragraphs) < 2:
        paragraphs = [line.strip() for line in body.splitlines() if line.strip()]
    if not paragraphs and body:
        paragraphs = [body]
    paragraphs_html = "\n".join(f"<p>{escape(paragraph)}</p>" for paragraph in paragraphs)
    canonical = f"{SITE}/confessions/{slug}.html"
    schema: dict[str, object] = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "articleSection": category,
        "mainEntityOfPage": {"@type": "WebPage", "@id": canonical},
        "author": {"@type": "Person", "name": "Anonymous"},
        "publisher": {"@type": "Organization", "name": "Almost"},
    }
    data = json.dumps(schema, ensure_ascii=False).replace("</", "<\\/")
    story_id = escape(row.get("id"))
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{escape(title)} | Unfiltered Dating</title><meta name="description" content="{escape(description)}">
<meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="{escape(canonical)}">
<meta property="og:type" content="article"><meta property="og:site_name" content="Almost — Unfiltered Dating"><meta property="og:title" content="{escape(title)} | Unfiltered Dating"><meta property="og:description" content="{escape(description)}"><meta property="og:url" content="{escape(canonical)}">
<meta name="twitter:card" content="summary"><meta name="twitter:title" content="{escape(title)} | Unfiltered Dating"><meta name="twitter:description" content="{escape(description)}">
<script type="application/ld+json">{data}</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-WWJH2R0QS6"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments)}}gtag('js',new Date());gtag('config','G-WWJH2R0QS6',{{page_title:document.title,page_location:location.href,page_path:location.pathname}});</script>
<style>:root{{--bg:#100d16;--paper:#191421;--ink:#f3edf9;--muted:#b1a7bf;--line:#342a40;--accent:#b99be8;--pink:#ff79b8}}*{{box-sizing:border-box}}body{{margin:0;background:var(--bg);color:var(--ink);font:16px/1.8 Inter,system-ui,sans-serif}}.wrap{{max-width:760px;margin:auto;padding:26px 22px 70px}}a{{color:var(--accent)}}.brand{{font:700 30px Georgia,serif;color:var(--ink);text-decoration:none}}.brand span{{color:var(--pink)}}.back{{display:inline-block;margin:30px 0 22px;text-decoration:none}}.tag{{display:inline-block;background:#30243e;border-radius:99px;padding:5px 12px;color:#d5c0f4;font-size:11px;font-weight:800;letter-spacing:.6px;text-transform:uppercase}}h1{{font:500 clamp(36px,7vw,56px)/1.08 Georgia,serif;letter-spacing:-1px;margin:20px 0}}.meta{{color:var(--muted);font-size:13px}}article{{background:var(--paper);border:1px solid var(--line);border-radius:18px;padding:clamp(20px,5vw,38px);margin-top:26px}}article p{{margin:0 0 18px}}article p:last-child{{margin-bottom:0}}.related{{margin-top:28px;display:flex;flex-wrap:wrap;gap:18px}}.reaction-row{{display:flex;flex-wrap:wrap;gap:7px;margin-top:22px}}.reaction{{border:1px solid var(--line);background:#100d16;color:var(--muted);border-radius:999px;padding:7px 10px;font:12px system-ui;cursor:pointer}}.reaction:disabled{{opacity:.6}}.status{{color:var(--muted);font-size:12px}}</style></head>
<body><main class="wrap"><a class="brand" href="../index.html">almost<span>.</span></a><br><a class="back" href="../confessions.html">← Back to confessions</a><div><span class="tag">{escape(category)}</span></div>
<h1>{escape(title)}</h1><div class="meta">Anonymous community submission{' · 18+' if category == 'Intimacy & 18+' else ''}</div>
<article>{paragraphs_html}</article><div class="reaction-row" aria-label="React to this story">{''.join(f'<button class="reaction" type="button" data-reaction="{escape(name)}">{escape(name)} <span data-count="{escape(name)}">0</span></button>' for name in ('Relatable','Plot Twist','Green Flag','Red Flag','Been There'))}</div><p class="status" id="reaction-status" role="status" aria-live="polite"></p>
<div class="related"><a href="../confessions.html">Read more confessions →</a></div></main>
<script>
(()=>{{const id="{story_id}",api="https://uajkmfiuuljbnuawovma.supabase.co",key="sb_publishable_gVCj4Z6JlPjWNwc7buKKmg_zaZTLU7r",status=document.getElementById("reaction-status");
async function request(path,options={{}}){{const response=await fetch(api+"/rest/v1/"+path,{{...options,headers:{{apikey:key,"Content-Type":"application/json",Prefer:options.method==="POST"?"return=minimal":"return=representation",...(options.headers||{{}})}}}});if(!response.ok)throw new Error("Request failed");return response.status===204?[]:response.json()}}
async function counts(){{try{{const rows=await request("confession_reactions?select=reaction&confession_id=eq."+encodeURIComponent(id));const values={{}};rows.forEach(row=>values[row.reaction]=(values[row.reaction]||0)+1);document.querySelectorAll("[data-count]").forEach(el=>el.textContent=values[el.dataset.count]||0)}}catch(error){{console.warn("Reactions unavailable",error)}}}}
document.querySelectorAll("button[data-reaction]").forEach(button=>{{const storageKey="almost-reacted-"+id+"-"+button.dataset.reaction;if(localStorage.getItem(storageKey))button.disabled=true;button.addEventListener("click",async()=>{{button.disabled=true;status.textContent="Saving reaction…";try{{await request("confession_reactions",{{method:"POST",body:JSON.stringify({{confession_id:id,reaction:button.dataset.reaction}})}});localStorage.setItem(storageKey,"1");const count=button.querySelector("span");count.textContent=Number(count.textContent)+1;status.textContent="Reaction saved.";if(typeof gtag==="function")gtag("event","story_reaction",{{reaction:button.dataset.reaction,story_id:id}})}}catch(error){{button.disabled=false;status.textContent="Could not save your reaction. Please try again."}}}})}});counts()}})();
</script><script>document.addEventListener('click',function(event){{var el=event.target.closest&&event.target.closest('a,button');if(!el||typeof gtag!=="function")return;gtag('event','ui_click',{{element_text:(el.getAttribute('aria-label')||el.innerText||'').replace(/\\s+/g,' ').trim().slice(0,100),element_type:el.tagName.toLowerCase(),page_path:location.pathname,page_title:document.title,link_url:el.tagName==='A'?(el.getAttribute('href')||''):''}})}},true);</script>
</body></html>'''


def copy_site_files(output: Path) -> None:
    """Copy deployable site files while keeping build/repository files out of Pages."""
    excluded = {".git", ".github", "scripts", "supabase", "__pycache__", "_site", "README.txt"}
    for source in ROOT.iterdir():
        if source.name in excluded or source.resolve() == output.resolve():
            continue
        target = output / source.name
        if source.is_dir() and not source.is_symlink():
            shutil.copytree(source, target)
        else:
            shutil.copy2(source, target)


def build(output: Path) -> int:
    rows = fetch_approved()
    if output.exists():
        shutil.rmtree(output)
    output.mkdir(parents=True)
    copy_site_files(output)

    add_static_schema(output / "index.html", is_homepage=True)
    add_static_schema(output / "confessions.html", is_archive=True)
    for page in (output / "confessions").glob("*.html"):
        add_static_schema(page)

    sitemap_path = output / "sitemap.xml"
    tree = ET.parse(sitemap_path)
    urlset = tree.getroot()
    existing = {item.findtext(f"{{{SITEMAP_NS}}}loc") for item in urlset}
    archive_path = output / "confessions.html"
    archive = archive_path.read_text(encoding="utf-8")
    cards = []
    for row in rows:
        story_id = str(row.get("id") or "")
        title = str(row.get("title") or "").strip()
        body = str(row.get("body") or "").strip()
        category = str(row.get("category") or "Dating stories")
        if not story_id or not title or len(body) < 1:
            continue
        slug = slugify(title, story_id)
        rel = f"confessions/{slug}.html"
        description = re.sub(r"\s+", " ", body).strip()
        if len(description) > 155:
            description = description[:152].rsplit(" ", 1)[0].rstrip(".,;:") + "…"
        target = output / rel
        target.write_text(render_story(row, slug, description), encoding="utf-8")
        canonical = f"{SITE}/{rel}"
        if canonical not in existing:
            node = ET.SubElement(urlset, f"{{{SITEMAP_NS}}}url")
            ET.SubElement(node, f"{{{SITEMAP_NS}}}loc").text = canonical
            existing.add(canonical)
        cards.append({"cat": category, "title": title, "desc": description, "url": rel, "adult": category == "Intimacy & 18+", "dynamic": True, "id": story_id})

    sitemap_path.write_bytes(ET.tostring(urlset, encoding="utf-8", xml_declaration=True))
    marker = "];\nconst categories=["
    serialized = json.dumps(cards, ensure_ascii=False).replace("</", "<\\/")
    if marker not in archive:
        raise RuntimeError("Could not locate the story manifest in confessions.html")
    if cards:
        archive = archive.replace(marker, ",\n  " + serialized[1:-1] + marker, 1)
    archive_path.write_text(archive, encoding="utf-8")
    return len(cards)


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, required=True)
    arguments = parser.parse_args()
    print(f"Built {build(arguments.output)} approved community story pages")
