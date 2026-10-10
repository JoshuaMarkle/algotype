// Syntax drills: short, repeated snippets of one kind of syntax (loops,
// functions, ...) generated in the browser from local templates. Drills
// never touch the `challenges` table
import Prism from "prismjs";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-java";
import "prismjs/components/prism-python";

import { TEMPLATES } from "@/lib/drills/templates";
import { countTypableLines, tokenizeCode } from "@/lib/tokenizer";

export const DRILL_MODE = "drills";

export const DRILL_LANGUAGES = ["python", "cpp", "java"];

// Order here is the order types appear in the UI and in slugs
export const DRILL_TYPES = [
  {
    id: "for",
    name: "For loops",
    description: "Counting, ranges and for-each",
  },
  {
    id: "while",
    name: "While loops",
    description: "Binary search, queues, do-while",
  },
  {
    id: "if",
    name: "Conditionals",
    description: "if / else, ternaries, switch",
  },
  {
    id: "func",
    name: "Functions",
    description: "Definitions, lambdas, recursion",
  },
  { id: "class", name: "Classes", description: "Classes, structs and records" },
  { id: "idiom", name: "Idioms", description: "Sorting, maps, comprehensions" },
];

export const DRILL_LENGTHS = [
  { id: "short", name: "Short", count: 3 },
  { id: "medium", name: "Medium", count: 6 },
  { id: "long", name: "Long", count: 10 },
];

export const DEFAULT_DRILL = Object.freeze({
  language: "python",
  types: ["for"],
  length: "medium",
});

const TYPE_IDS = DRILL_TYPES.map((t) => t.id);

// --- Slugs ---
// A drill is addressed as /drills/<language>-<type>[-<type>...], e.g.
// /drills/python-for-func. The slug is also what history stores

export function drillSlug(language, types) {
  const ordered = TYPE_IDS.filter((id) => types.includes(id));
  return [language, ...ordered].join("-");
}

// Returns { language, types } or null when the slug is not a valid drill
export function parseDrillSlug(slug) {
  if (typeof slug !== "string") return null;
  const [language, ...types] = slug.split("-");

  if (!DRILL_LANGUAGES.includes(language)) return null;
  if (types.length === 0) return null;
  if (types.some((t) => !TYPE_IDS.includes(t))) return null;

  const ordered = TYPE_IDS.filter((id) => types.includes(id));
  if (ordered.length !== types.length) return null; // duplicates
  return { language, types: ordered };
}

export function drillLength(id) {
  return DRILL_LENGTHS.find((l) => l.id === id) ?? DRILL_LENGTHS[1];
}

// --- Generation ---

// Small seeded PRNG so tests (and anything else) can reproduce a drill
export function seededRandom(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function helpers(rng) {
  const int = (min, max) => min + Math.floor(rng() * (max - min + 1));
  const pick = (arr) => arr[int(0, arr.length - 1)];
  const distinct = (arr, k) => {
    const pool = [...arr];
    const out = [];
    while (out.length < k && pool.length) {
      out.push(pool.splice(int(0, pool.length - 1), 1)[0]);
    }
    return out;
  };
  return { int, pick, distinct };
}

// Source code for one drill: `count` snippets separated by blank lines.
// Types are cycled in a shuffled order so every chosen type shows up, and
// the same template is not used twice in a row
export function generateDrillCode({
  language,
  types,
  count,
  rng = Math.random,
}) {
  const templates = TEMPLATES[language];
  if (!templates) throw new Error(`Unknown drill language: ${language}`);

  const h = helpers(rng);
  const snippets = [];
  let order = [];
  let lastTemplate = null;

  for (let i = 0; i < count; i++) {
    if (order.length === 0) order = h.distinct(types, types.length);
    const type = order.shift();
    const options = templates[type];
    if (!options) throw new Error(`Unknown drill type: ${type}`);

    let template = h.pick(options);
    if (template === lastTemplate && options.length > 1) {
      template = options[(options.indexOf(template) + 1) % options.length];
    }
    lastTemplate = template;
    snippets.push(template(h));
  }

  return snippets.join("\n\n");
}

// A drill in the same shape as a `challenges` row, ready for TypingTest
export function buildDrillChallenge({ language, types, count, rng }) {
  const code = generateDrillCode({ language, types, count, rng });
  const tokens = tokenizeCode(code, language);
  const names = DRILL_TYPES.filter((t) => types.includes(t.id)).map(
    (t) => t.name,
  );

  return {
    title: names.join(", "),
    mode: DRILL_MODE,
    language,
    source: "",
    slug: drillSlug(language, types),
    lines: countTypableLines(tokens),
    tokens,
  };
}

// Make sure the languages above really are loaded (Prism silently ignores
// a missing component import)
for (const language of DRILL_LANGUAGES) {
  if (!Prism.languages[language]) {
    throw new Error(`Prism language missing for drills: ${language}`);
  }
}
