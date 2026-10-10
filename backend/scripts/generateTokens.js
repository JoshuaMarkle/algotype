import fs from "fs/promises";
import path from "path";
import chalk from "chalk";
import loadLanguages from "prismjs/components/index.js";

import { countTypableLines, tokenizeCode } from "./tokenizer.js";

const GAMEMODES = ["algorithms"];
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

      try {
        const meta = JSON.parse(await fs.readFile(metaPath, "utf8"));
        const code = await fs.readFile(filePath, "utf8");
        const tokenLines = tokenizeCode(code, language);

        const output = {
          title: meta.title,
          description: meta.description,
          lines: countTypableLines(tokenLines),
          language,
          source: meta.source || "",
          slug: baseName + "-" + language,
          mode,
          tokens: tokenLines,
        };

        await fs.mkdir(outputDir, { recursive: true });
        await fs.writeFile(outputPath, JSON.stringify(output, null, 2), "utf8");
        console.log(
          `${chalk.green("[SUCCESS]")}\tTokenized: ${mode}/${language}/${file}`,
        );
      } catch (err) {
        if (err.code === "ENOENT") {
          console.warn(
            `${chalk.yellow("[WARNING]")}\tSkipping:  ${mode}/${language}/${file}\n` +
              `\t\tMissing metadata file: ${metaPath}\n` +
              `\t\tExpected code file: ${filePath}`,
          );
        } else {
          console.error(
            `${chalk.red("[ERROR]")}\tFailed:    ${filePath}\n` +
              `\t\tMetadata: ${metaPath}\n` +
              `\t\tError Message: ${err.message}`,
          );
        }
      }
    }
  }
}

console.log(chalk.blue("[COMPLETE]"));
