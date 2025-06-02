"use client";

import { useEffect, useRef, useState } from "react";
import calculateStats from "@/components/typingtest/calculateStats";
import clsx from "clsx";

const NAV_HEIGHT = 48;
const GAP_BELOW_NAV = 16;

export default function StatPanel({ started, done, stats, visible = true }) {
  const [navVisible, setNavVisible] = useState(true);
  const [offset, setOffset] = useState(0);

  const lastScrollY = useRef(0);
  const offsetRef = useRef(0);
  const raf = useRef(null);

  // Schedule re-renders
  const timeoutRef = useRef(null);
  const [, forceUpdate] = useState(0);

  const { wpm, acc, time, timeTillWpmDrop } = calculateStats(started, stats);

  // Scroll logic: direction detection + inertia delta
  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      // Inertia offset
      offsetRef.current += delta;

      // Navbar mimic logic
      if (currentY <= 10) {
        setNavVisible(true);
      } else if (currentY > lastScrollY.current) {
        setNavVisible(false);
      } else {
        setNavVisible(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lerp back to anchor position
  useEffect(() => {
    const step = () => {
      offsetRef.current *= 0.65;
      if (Math.abs(offsetRef.current) < 0.2) offsetRef.current = 0;
      setOffset((v) => (v === offsetRef.current ? v : offsetRef.current));
      raf.current = requestAnimationFrame(step);
    };

    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  // Re-render after the time it will take for 1 wpm drop
  useEffect(() => {
    // Clear any existing scheduled re-render
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Schedule
    if (!done && Number.isFinite(timeTillWpmDrop) && timeTillWpmDrop > 0) {
      timeoutRef.current = setTimeout(
        () => {
          forceUpdate((n) => n + 1); // Force re-render
        },
        timeTillWpmDrop * 1000 + 20,
      ); // +20ms to make sure it hits
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [timeTillWpmDrop, done]);

  const anchorTop = navVisible ? NAV_HEIGHT + GAP_BELOW_NAV : GAP_BELOW_NAV;

  return (
    <div
      className={clsx(
        "fixed right-4 xl:right-48 will-change-transform will-change-filter",
        "transition-all duration-400 ease-out",
        visible
          ? "opacity-100 blur-0"
          : "opacity-0 blur-md pointer-events-none",
      )}
      style={{
        top: `${anchorTop - offset}px`,
        transitionProperty: "opacity, filter, top",
      }}
    >
      <div className="border border-neutral-800 rounded-lg p-6 font-mono bg-zinc-950/80 backdrop-blur-sm">
        <div className="flex row">
          <div>
            <h3 className="text-neutral-600">MAIN</h3>
            <div className="flex row gap-2">
              <p className="text-blue-300">WPM:</p>
              <p>{wpm}</p>
            </div>
            <div className="flex row gap-2">
              <p className="text-blue-300">ACC:</p>
              <p>{acc}</p>
            </div>
            <div className="flex row gap-2">
              <p className="text-blue-300">TIME:</p>
              <p>{time}</p>
            </div>
          </div>

          <div className="border-r border-neutral-800 mx-8" />

          <div>
            <h3 className="text-neutral-600">DEBUG</h3>
            <div className="flex row gap-2">
              <p className="text-red-400">COR:</p>
              <p>{stats.current.correct}</p>
            </div>
            <div className="flex row gap-2">
              <p className="text-red-400">INC:</p>
              <p>{stats.current.incorrect}</p>
            </div>
            <div className="flex row gap-2">
              <p className="text-red-400">BAC:</p>
              <p>{stats.current.backspace}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
