"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export function Analytics() {
  const pathname = usePathname();
  const enabled = process.env.NODE_ENV === "production";

  useEffect(() => {
    if (!enabled || pathname === "/admin") return;

    window.gtag("event", "page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [enabled, pathname]);

  useEffect(() => {
    if (!enabled || pathname === "/admin") return;

    const trackClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const control = target.closest("a, button, [role='button']");
      if (!(control instanceof HTMLElement)) return;

      const href = control instanceof HTMLAnchorElement ? control.href : "";
      let destination = "";
      if (href) {
        try {
          const url = new URL(href);
          destination = url.origin === window.location.origin ? url.pathname : "external";
        } catch {
          destination = "link";
        }
      }

      window.gtag("event", "ui_click", {
        element_type: control.tagName.toLowerCase(),
        element_id: control.id || undefined,
        element_class: typeof control.className === "string" ? control.className.slice(0, 100) : undefined,
        destination: destination || undefined,
      });
    };

    document.addEventListener("click", trackClick, true);
    return () => document.removeEventListener("click", trackClick, true);
  }, [enabled, pathname]);

  return null;
}
