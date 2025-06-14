import fs from "fs/promises";
import path from "path";
import chalk from "chalk";
import Prism from "prismjs";
import loadLanguages from "prismjs/components/index.js";

const GAMEMODES = ["files", "algorithms", "syntax"];
const BASE_DIR = path.join(process.cwd(), "backend/data");

for (const mode of GAMEMODES) {
  const modeDir = path.join(BASE_DIR, mode);
  const languages = await fs.readdir(modeDir);

  for (const language of languages) {
    const langDir = path.join(modeDir, language);
    const files = (await fs.readdir(langDir)).filter(
      (f) =>
        !f.endsWith(".meta") && !f.startsWith(".") && !f.includes("tokens"),
    );

    try {
      loadLanguages([language]);
    } catch {
      console.warn(
        `${chalk.yellow("[WARNING]")}\tSkipping unsupported Prism language: ${language}`,
      );
      continue;
    }

    for (const file of files) {
      const baseName = file.replace(/\.[^.]+$/, ""); // removes extension
      const filePath = path.join(langDir, file);
      const metaPath = path.join(langDir, `${baseName}.meta`);
      const outputDir = path.join(
        process.cwd(),
        "backend/tokens",
        mode,
        language,
      );
      const outputPath = path.join(outputDir, `${baseName}.json`);

      // Ensure .meta exists
      try {
        const meta = JSON.parse(await fs.readFile(metaPath, "utf8"));
        const code = await fs.readFile(filePath, "utf8");
        const lines = code.split("\n");

        const tokenLines = lines.map((line) => {
          if (line.trim() === "") return [];
          const rawTokens = Prism.tokenize(line, Prism.languages[language]);
          const normalized = normalizeTokens(rawTokens);
          const withWlengths = addWlengths(normalized);
          return insertNewlineToken(withWlengths);
        });

        if (tokenLines.length && tokenLines.at(-1).length === 0)
          tokenLines.pop();

        // Wrap the tokenLines in a { tokens: [...] } structure
        const output = {
          title: meta.title,
          description: meta.description,
          lines: tokenLines.length,
          language,
          source: meta.source || "",
          slug: baseName + "-" + language,
          mode,
          tokens: tokenLines,
        };

        await fs.mkdir(outputDir, { recursive: true });
        await fs.writeFile(outputPath, JSON.stringify(output, null, 2), "utf8");
        console.log(
          `${chalk.green("[SUCCESS]")}\tTokenized: [${mode}/${language}/${file}]`,
        );
      } catch (err) {
        if (err.code === "ENOENT") {
          console.warn(
            `${chalk.yellow("[WARNING]")}\tSkipping:  [${mode}/${language}/${file}]\n` +
              `\t\tMissing or unreadable metadata file: ${metaPath}\n` +
              `\t\tExpected code file: ${filePath}`,
          );
        } else {
          console.error(
            `${chalk.red("[ERROR]")}\tFailed to process: ${filePath}\n` +
              `\t\tWith meta: ${metaPath}\n` +
              `\t\tReason: ${err.message}`,
          );
        }
      }
    }
  }
}

console.log(chalk.blue("[COMPLETE]"));

// Helper functions

function normalizeTokens(tokens) {
  const out = [];

  for (const token of tokens) {
    const type = typeof token === "string" ? "plain" : token.type || "plain";
    let content =
      typeof token === "string"
        ? token
        : Array.isArray(token.content)
          ? token.content
              .map((t) => (typeof t === "string" ? t : t.content))
              .join("")
          : token.content;

    if (typeof content !== "string") continue;

    if (type === "comment") {
      out.push({ type, content, skip: true });
      continue;
    }

    let buf = "",
      bufIsSpace = null;
    for (const ch of content) {
      const isSpace = /\s/.test(ch);
      if (buf === "") {
        buf = ch;
        bufIsSpace = isSpace;
      } else if (isSpace === bufIsSpace) {
        buf += ch;
      } else {
        out.push(makeToken(buf, type, bufIsSpace));
        buf = ch;
        bufIsSpace = isSpace;
      }
    }
    if (buf) out.push(makeToken(buf, type, bufIsSpace));
  }

  let firstReal = -1,
    lastReal = -1;
  for (let i = 0; i < out.length; i++) {
    if (!out[i].skip && out[i].type !== "space") {
      firstReal = i;
      break;
    }
  }
  for (let j = out.length - 1; j >= 0; j--) {
    if (!out[j].skip && out[j].type !== "space") {
      lastReal = j;
      break;
    }
  }
  if (firstReal !== -1) {
    for (let i = 0; i < firstReal; ++i)
      if (out[i].type === "space") out[i].skip = true;
    for (let i = lastReal + 1; i < out.length; ++i)
      if (out[i].type === "space") out[i].skip = true;
  }

  return out;
}

function makeToken(content, baseType, isSpace) {
  return { type: isSpace ? "space" : baseType, content };
}

function addWlengths(tokens) {
  let count = 0;
  for (let i = tokens.length - 1; i >= 0; i--) {
    const t = tokens[i];
    if (t.skip || t.type === "space") {
      count = 0;
    } else {
      t.wlength = ++count;
    }
  }
  return tokens;
}

function insertNewlineToken(tokens) {
  const hasRealContent = tokens.some((t) => !t.skip);
  if (!hasRealContent) return tokens;

  let insertAt = tokens.length;
  for (let i = tokens.length - 1; i >= 0; i--) {
    if (!tokens[i].skip) {
      insertAt = i + 1;
      break;
    }
  }

  const newlineToken = { type: "newline", content: "↵" };
  tokens.splice(insertAt, 0, newlineToken);
  return tokens;
}
