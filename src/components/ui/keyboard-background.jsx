"use client";

import React, { useEffect, useRef, useState } from "react";
import { Keyboard } from "@/components/ui/kbd";

const ROW_COUNT = 4;
const KEYBOARD_WIDTH = 720;
const KEYBOARD_HEIGHT = 230;
const SPEED = 20; // px/sec

let idCounter = 0;

export function KeyboardBackground() {
  const [keyboards, setKeyboards] = useState([]);
  const rafRef = useRef();

  const calculateKeyboards = () => {
    const screenWidth = window.innerWidth;
    const newKeyboards = [];

    for (let row = 0; row < ROW_COUNT; row++) {
      const direction = row % 2 === 0 ? 1 : -1;
      const keyboardsNeeded = Math.ceil(screenWidth / KEYBOARD_WIDTH) + 2;
      const y = row * KEYBOARD_HEIGHT;

      for (let i = 0; i < keyboardsNeeded; i++) {
        const offset = i * KEYBOARD_WIDTH;
        const x =
          direction === 1 ? offset - KEYBOARD_WIDTH : screenWidth - offset;

        newKeyboards.push({
          id: idCounter++,
          row,
          direction,
          x,
          y,
        });
      }
    }

    return newKeyboards;
  };

  useEffect(() => {
    const updateLayout = () => setKeyboards(calculateKeyboards());
    updateLayout();

    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  useEffect(() => {
    let last = performance.now();

    const step = (now) => {
      const delta = (now - last) / 1000;
      last = now;
      const screenWidth = window.innerWidth;

      setKeyboards((prev) =>
        prev.map((k) => {
          const nextX = k.x + k.direction * SPEED * delta;

          if (k.direction === 1 && nextX > screenWidth) {
            return { ...k, x: -KEYBOARD_WIDTH };
          } else if (k.direction === -1 && nextX < -KEYBOARD_WIDTH) {
            return { ...k, x: screenWidth };
          }

          return { ...k, x: nextX };
        }),
      );

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {keyboards.map((k) => (
        <div
          key={k.id}
          className="absolute"
          style={{
            top: `${k.y}px`,
            left: `${k.x}px`,
          }}
        >
          <Keyboard />
        </div>
      ))}
    </div>
  );
}
