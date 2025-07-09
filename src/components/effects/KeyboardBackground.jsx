"use client";

import React, { useEffect, useRef, useState } from "react";
import { Keyboard } from "@/components/ui/Kbd";

const KEYBOARD_WIDTH = 720;
const KEYBOARD_HEIGHT = 230;
const SPEED = 20; // px/sec

export default function KeyboardBackground({ className = "" }) {
  const [rows, setRows] = useState([]);
  const containerRef = useRef(null);
  const startTime = useRef(performance.now());

  const getLayout = () => {
    const screenWidth = window.innerWidth;
    const pageHeight = document.body.scrollHeight;
    const rowCount = Math.ceil(pageHeight / KEYBOARD_HEIGHT);
    const rowData = [];

    for (let row = 0; row < rowCount; row++) {
      const direction = row % 2 === 0 ? 1 : -1;
      const count = Math.ceil(screenWidth / KEYBOARD_WIDTH) + 2;

      rowData.push({ row, direction, count });
    }

    return rowData;
  };

  useEffect(() => {
    const update = () => {
      setRows(getLayout());
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none -z-10"
    >
      {rows.map(({ row, direction, count }) => {
        const y = row * KEYBOARD_HEIGHT;

        return Array.from({ length: count }).map((_, i) => {
          return (
            <MovingKeyboard
              key={`${row}-${i}`}
              y={y}
              i={i}
              direction={direction}
              startTime={startTime}
            />
          );
        });
      })}
    </div>
  );
}

function MovingKeyboard({ y, i, direction, startTime }) {
  const ref = useRef();
  const animationRef = useRef();

  useEffect(() => {
    const screenWidth = window.innerWidth;
    const totalKeyboards = Math.ceil(screenWidth / KEYBOARD_WIDTH) + 2;
    const totalWidth = totalKeyboards * KEYBOARD_WIDTH;
    const offset = i * KEYBOARD_WIDTH;
    const base =
      direction === 1 ? -KEYBOARD_WIDTH + offset : screenWidth - offset;

    const update = () => {
      const now = performance.now();
      const elapsed = (now - startTime.current) / 1000;
      const distance = (SPEED * elapsed) % totalWidth;

      const x =
        direction === 1
          ? (base + distance) % totalWidth
          : (base - distance + totalWidth) % totalWidth;

      if (ref.current)
        ref.current.style.transform = `translate(${x}px, ${y}px)`;
      animationRef.current = requestAnimationFrame(update);
    };

    animationRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationRef.current);
  }, [y, i, direction, startTime]);

  return (
    <div ref={ref} className="absolute" style={{ willChange: "transform" }}>
      <Keyboard />
    </div>
  );
}
