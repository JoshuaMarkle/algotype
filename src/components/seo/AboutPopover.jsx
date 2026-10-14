"use client";

import { useEffect, useRef } from "react";

// <details> popover that also closes on Escape or a click outside it. The
// panel content is passed in from the server so it stays in the HTML
export default function AboutPopover({ label, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const close = () => ref.current?.removeAttribute("open");
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) close();
    };
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("pointerdown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <details ref={ref}>
      <summary className="list-none cursor-pointer text-sm font-medium text-muted-foreground hover:text-fg transition [&::-webkit-details-marker]:hidden">
        {label}
      </summary>
      {children}
    </details>
  );
}
