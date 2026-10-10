"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import Button from "@/components/ui/Button";
import {
  DEFAULT_DRILL,
  DRILL_LANGUAGES,
  DRILL_LENGTHS,
  DRILL_TYPES,
  drillSlug,
} from "@/lib/drills";
import { cn, langToNatural } from "@/lib/utils";

const STORAGE_KEY = "algotype_drills";

// Last drill setup, so the picker opens where the user left it
function readSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    if (!saved) return DEFAULT_DRILL;
    const types = (saved.types ?? []).filter((t) =>
      DRILL_TYPES.some((d) => d.id === t),
    );
    return {
      language: DRILL_LANGUAGES.includes(saved.language)
        ? saved.language
        : DEFAULT_DRILL.language,
      types: types.length ? types : DEFAULT_DRILL.types,
      length: DRILL_LENGTHS.some((l) => l.id === saved.length)
        ? saved.length
        : DEFAULT_DRILL.length,
    };
  } catch {
    return DEFAULT_DRILL;
  }
}

export default function DrillPicker() {
  const [drill, setDrill] = useState(DEFAULT_DRILL);
  useEffect(() => setDrill(readSaved()), []);

  const update = (changes) => {
    const next = { ...drill, ...changes };
    setDrill(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage unavailable (private mode): the choice just isn't remembered
    }
  };

  const toggleType = (id) => {
    const types = drill.types.includes(id)
      ? drill.types.filter((t) => t !== id)
      : [...drill.types, id];
    update({ types });
  };

  const href =
    drill.types.length > 0
      ? `/drills/${drillSlug(drill.language, drill.types)}?length=${drill.length}`
      : null;

  return (
    <div className="flex flex-col gap-8">
      {/* Drill types */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">What to practice</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DRILL_TYPES.map((type) => {
            const selected = drill.types.includes(type.id);
            return (
              <button
                key={type.id}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleType(type.id)}
                className={cn(
                  "flex flex-row items-start justify-between gap-4 text-left bg-bg-2 border rounded-sm p-4 transition",
                  selected
                    ? "border-primary"
                    : "border-border hover:border-fg-3",
                )}
              >
                <div className="space-y-1">
                  <div className="font-medium">{type.name}</div>
                  <div className="text-sm text-fg-2">{type.description}</div>
                </div>
                <Check
                  className={cn(
                    "size-4 shrink-0 text-primary",
                    !selected && "invisible",
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Language + length */}
      <div className="flex flex-col md:flex-row gap-8">
        <OptionRow
          label="Language"
          options={DRILL_LANGUAGES.map((id) => ({
            id,
            name: langToNatural(id),
          }))}
          value={drill.language}
          onChange={(language) => update({ language })}
        />
        <OptionRow
          label="Length"
          options={DRILL_LENGTHS.map((l) => ({
            id: l.id,
            name: `${l.name} (${l.count})`,
          }))}
          value={drill.length}
          onChange={(length) => update({ length })}
        />
      </div>

      <div>
        {href ? (
          <Button asChild size="lg">
            <Link href={href}>
              Start drill
              <ArrowRight />
            </Link>
          </Button>
        ) : (
          <Button size="lg" disabled>
            Pick at least one drill
          </Button>
        )}
      </div>
    </div>
  );
}

function OptionRow({ label, options, value, onChange }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">{label}</h2>
      <div className="flex flex-row flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={value === option.id}
            onClick={() => onChange(option.id)}
            className={cn(
              "px-3 h-9 rounded-sm border text-sm transition",
              value === option.id
                ? "border-primary text-fg bg-bg-3"
                : "border-border text-fg-2 hover:text-fg",
            )}
          >
            {option.name}
          </button>
        ))}
      </div>
    </div>
  );
}
