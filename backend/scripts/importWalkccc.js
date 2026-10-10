// Convert a local clone of walkccc/LeetCode (MIT) into backend/data, the
// input format of generateTokens.js: one code file + .meta per challenge.
//
//   git clone --depth 1 https://github.com/walkccc/LeetCode backend/sources/walkccc
//   npm run import:walkccc
//
// Only the main solution of each problem is used ("994.py", not "994-2.py"),
// and files with fewer than MIN_LINES typable lines are skipped.
import fs from "fs/promises";
import path from "path";
import chalk from "chalk";

import { countTypableLines, tokenizeCode } from "./tokenizer.js";

const SRC_DIR = path.join(process.cwd(), "backend/sources/walkccc/solutions");
const OUT_DIR = path.join(process.cwd(), "backend/data/algorithms");
const MIN_LINES = 5;
const LANGUAGES = { cpp: "cpp", java: "java", py: "python" };

const stats = { problems: 0, written: 0, short: 0, collisions: 0 };
const seen = new Set();

const dirs = await fs.readdir(SRC_DIR);
for (const dir of dirs) {
  const match = dir.match(/^(\d+)\. (.+)$/);
  if (!match) continue;
  const [, number, title] = match;
  stats.problems++;

  for (const [ext, language] of Object.entries(LANGUAGES)) {
    let code;
    try {
      code = await fs.readFile(
        path.join(SRC_DIR, dir, `${number}.${ext}`),
        "utf8",
      );
    } catch {
      continue; // no solution in this language
    }
    code = code.replace(/\r\n/g, "\n").replace(/\n+$/, "") + "\n";

    if (countTypableLines(tokenizeCode(code, language)) < MIN_LINES) {
      stats.short++;
      continue;
    }

    const baseName = toBaseName(title);
    const key = `${language}/${baseName}`;
    if (seen.has(key)) {
      stats.collisions++;
      console.warn(
        `${chalk.yellow("[WARNING]")}\tDuplicate name ${key} (${dir})`,
      );
      continue;
    }
    seen.add(key);

    const meta = {
      title,
      description: "",
      source: `https://leetcode.com/problems/${toLeetCodeSlug(title)}`,
    };
    const langDir = path.join(OUT_DIR, language);
    await fs.mkdir(langDir, { recursive: true });
    await fs.writeFile(path.join(langDir, `${baseName}.${ext}`), code, "utf8");
    await fs.writeFile(
      path.join(langDir, `${baseName}.meta`),
      JSON.stringify(meta, null, 2) + "\n",
      "utf8",
    );
    stats.written++;
  }
}

console.log(
  `${chalk.blue("[COMPLETE]")}\t${stats.problems} problems, ${stats.written} files written, ` +
    `${stats.short} under ${MIN_LINES} lines skipped, ${stats.collisions} name collisions`,
);

// "Pow(x, n)" -> "Powxn", matching existing slugs like "AddBinary-python"
function toBaseName(title) {
  return title.replace(/[^A-Za-z0-9]/g, "");
}

// "Two Sum II - Input Array Is Sorted" -> "two-sum-ii-input-array-is-sorted"
function toLeetCodeSlug(title) {
  return title
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9 -]/g, "")
    .trim()
    .replace(/[ -]+/g, "-");
}
