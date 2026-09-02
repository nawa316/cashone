"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Complete progress on route change
  useEffect(() => {
    if (loading) {
      setProgress(100);
      const timer = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Intercept internal link clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Ignore external links, anchor hashes, new tab clicks, and downloads
      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        target.target === "_blank" ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      // Check if it's pointing to a different page or query
      const currentUrl = `${window.location.pathname}${window.location.search}`;
      const targetUrl = new URL(href, window.location.origin);
      const targetPathWithSearch = `${targetUrl.pathname}${targetUrl.search}`;

      if (targetPathWithSearch !== currentUrl) {
        setLoading(true);
        setProgress(20);

        // Progress simulation
        const timer1 = setTimeout(() => setProgress((p) => (p < 50 ? 50 : p)), 100);
        const timer2 = setTimeout(() => setProgress((p) => (p < 80 ? 80 : p)), 350);

        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
        };
      }
    };

    window.addEventListener("click", handleClick, { capture: true });
    return () => {
      window.removeEventListener("click", handleClick, { capture: true });
    };
  }, []);

  if (!loading && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none transition-opacity duration-300"
      style={{ opacity: loading || progress > 0 ? 1 : 0 }}
      aria-hidden="true"
    >
      {/* Glowing progress line */}
      <div
        className="h-[2.5px] bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 transition-all duration-200 ease-out shadow-[0_0_8px_rgba(59,130,246,0.6)]"
        style={{
          width: `${progress}%`,
          transitionDuration: progress === 100 ? "150ms" : "300ms",
        }}
      />
      {/* Glowing tip */}
      <div
        className="absolute top-0 right-0 w-24 h-[2.5px] bg-cyan-300 blur-[2px] opacity-75"
        style={{
          transform: `translateX(${progress - 100}%)`,
          display: progress > 0 && progress < 100 ? "block" : "none",
        }}
      />
    </div>
  );
}
