"use client";

import { useEffect, useRef, useState } from "react";

export default function HomeNavigation() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") { setOpen(false); menuButton.current?.focus(); }
      if (event.key === "Tab") {
        const controls = document.querySelectorAll<HTMLElement>("#mobile-site-menu a, #mobile-site-menu button");
        const first = controls.item(0);
        const last = controls.item(controls.length - 1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function closeMenu() { setOpen(false); menuButton.current?.focus(); }

  return <header className="home-nav">
    <a className="brand" href="/" aria-label="Almost home">Almost<span>.</span></a>
    <nav className="desktop-home-links" aria-label="Main navigation"><a href="/confessions">Confessions</a><a href="#hinge-guide">Free Hinge guide</a><a className="home-share-link" href="/submit-story">Share a story</a></nav>
    <button ref={menuButton} className="mobile-menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-site-menu" onClick={() => setOpen(true)}>
      <span className="hamburger-icon" aria-hidden="true"><i /><i /><i /></span><span>Menu</span>
    </button>
    {open && <div className="mobile-menu-backdrop" onClick={(event) => { if (event.target === event.currentTarget) closeMenu(); }}>
      <section className="mobile-menu-panel" id="mobile-site-menu" role="dialog" aria-modal="true" aria-labelledby="mobile-menu-title">
        <div className="mobile-menu-heading"><div><p className="story-kicker">Almost · Unfiltered Dating</p><h2 id="mobile-menu-title">Explore</h2></div><button ref={closeButton} className="mobile-menu-close" type="button" onClick={closeMenu} aria-label="Close menu">×</button></div>
        <nav className="mobile-menu-links" aria-label="Mobile navigation">
          <a href="/confessions" onClick={() => setOpen(false)}>Confessions <span aria-hidden="true">→</span></a>
          <a href="#hinge-guide" onClick={() => setOpen(false)}>Free Hinge guide <span aria-hidden="true">→</span></a>
          <a className="mobile-menu-submit" href="/submit-story" onClick={() => setOpen(false)}>Share a story <span aria-hidden="true">→</span></a>
        </nav>
      </section>
    </div>}
  </header>;
}
