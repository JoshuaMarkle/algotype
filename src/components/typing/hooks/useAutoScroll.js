"use client";

import { useEffect, useRef } from "react";

export function useAutoScroll(started, done, currentLineRef, tokenIdx, typed) {
  const scrollTargetY = useRef(0);
  const scrollRaf = useRef(null);

  useEffect(() => {
    if (!started || done) return;

    const updateScrollTarget = () => {
      if (!currentLineRef.current) return;

      const rect = currentLineRef.current.getBoundingClientRect();
      scrollTargetY.current =
        window.scrollY + rect.top - window.innerHeight / 2 + rect.height / 2;
    };

    const scrollStep = () => {
      const currentScroll = window.scrollY;
      const diff = scrollTargetY.current - currentScroll;
      const delta = diff * 0.15;

      if (Math.abs(diff) > 1) {
        window.scrollTo(0, currentScroll + delta);
        scrollRaf.current = requestAnimationFrame(scrollStep);
      } else {
        cancelAnimationFrame(scrollRaf.current);
      }
    };

    // Start the scroll animation
    updateScrollTarget();
    scrollRaf.current = requestAnimationFrame(scrollStep);

    // Clean up when component unmounts or deps change
    return () => {
      cancelAnimationFrame(scrollRaf.current);
    };
  }, [tokenIdx, typed, started, done, currentLineRef]);
}
