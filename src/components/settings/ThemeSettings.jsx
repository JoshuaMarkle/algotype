"use client";

import { Check } from "lucide-react";

import { THEMES, resolveTheme } from "@/lib/themes";
import { cn } from "@/lib/utils";

// Small Python snippet as [type, text] pairs for the preview cards
const PREVIEW_LINES = [
  [
    ["keyword", "def "],
    ["function", "two_sum"],
    ["punctuation", "("],
    ["plain", "nums"],
    ["punctuation", ", "],
    ["plain", "target"],
    ["punctuation", "):"],
  ],
  [["comment", "    # value -> index"]],
  [
    ["plain", "    seen "],
    ["operator", "= "],
    ["punctuation", "{}"],
  ],
  [
    ["keyword", "    for "],
    ["plain", "i "],
    ["keyword", "in "],
    ["builtin", "range"],
    ["punctuation", "("],
    ["number", "0"],
    ["punctuation", ", "],
    ["builtin", "len"],
    ["punctuation", "("],
    ["plain", "nums"],
    ["punctuation", ")):"],
  ],
  [
    ["keyword", "        return "],
    ["string", '"found"'],
  ],
];

export default function ThemeSettings({ theme, onChange }) {
  const active = resolveTheme(theme);

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl">Themes</h2>
        <p className="text-fg-2">
          Colors for the site and the code you type. Saved in this browser.
        </p>
      </div>
      <div
        role="radiogroup"
        aria-label="Theme"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {THEMES.map(({ id, name }) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={id === active}
            onClick={() => onChange(id)}
            className={cn(
              "rounded-lg border border-border text-left transition hover:border-border-strong focus-visible:outline-2 focus-visible:outline-ring",
              id === active && "ring-2 ring-primary border-transparent",
            )}
          >
            <ThemePreview id={id} name={name} selected={id === active} />
          </button>
        ))}
      </div>
    </section>
  );
}

// Card rendered in its own theme via data-theme
function ThemePreview({ id, name, selected }) {
  return (
    <div
      data-theme={id}
      className="rounded-lg bg-bg-2 text-fg overflow-hidden h-full"
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-sm font-medium">{name}</span>
        <div className="flex items-center gap-1">
          {["bg-red", "bg-yellow", "bg-green", "bg-blue"].map((c) => (
            <span key={c} className={cn("size-2.5 rounded-full", c)} />
          ))}
          {selected && <Check className="size-4 ml-1 text-primary" />}
        </div>
      </div>
      <pre className="px-3 py-2 font-mono text-xs leading-relaxed overflow-hidden">
        {PREVIEW_LINES.map((line, li) => (
          <div key={li} className="whitespace-pre">
            {line.map(([type, text], ti) => (
              <span key={ti} className={`token token-${type}`}>
                {text}
              </span>
            ))}
          </div>
        ))}
      </pre>
    </div>
  );
}
