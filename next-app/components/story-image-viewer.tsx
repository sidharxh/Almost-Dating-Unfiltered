"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type StoryImageViewerProps = {
  src: string;
  alt: string;
  variant?: "card" | "article";
};

export default function StoryImageViewer({ src, alt, variant = "article" }: StoryImageViewerProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "Tab") {
        event.preventDefault();
        closeRef.current?.focus();
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      triggerRef.current?.focus();
    };
  }, [open]);

  return <>
    <button
      ref={triggerRef}
      className={`story-image-trigger story-image-trigger-${variant}`}
      type="button"
      aria-label={`Open full-screen image: ${alt}`}
      onClick={() => setOpen(true)}
    >
      <Image
        className="story-image-display"
        src={src}
        alt={alt}
        fill
        sizes={variant === "card" ? "(max-width: 580px) 100vw, (max-width: 800px) 90vw, (max-width: 1180px) 45vw, 550px" : "(max-width: 900px) 100vw, 900px"}
        loading={variant === "card" ? "lazy" : "eager"}
      />
      <span className="story-image-open-hint">View full image</span>
    </button>
    {open && <div className="story-image-lightbox" role="dialog" aria-modal="true" aria-label="Story image" onClick={() => setOpen(false)}>
      <button ref={closeRef} className="story-image-close" type="button" aria-label="Close full-screen image" onClick={() => setOpen(false)}>×</button>
      <img src={src} alt={alt} onClick={(event) => event.stopPropagation()} />
    </div>}
  </>;
}
