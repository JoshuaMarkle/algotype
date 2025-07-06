import fs from "fs/promises";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import pLimit from "p-limit";

const exec = promisify(execFile);
const ROOT = path.resolve("data/algorithms");
const ERROR_LOG = path.resolve("scripts/logs/format_errors.txt");

const EXTENSION_TO_LANGUAGE = {
  ".py": "python",
  ".js": "javascript",
  ".cpp": "cpp",
  ".java": "java",
  ".rs": "rust",
};

const FORMAT_COMMANDS = {
  python: async (file) => exec("black", [file]),
  javascript: async (file) => exec("prettier", ["--write", file]),
  cpp: async (file) => exec("clang-format", ["-i", file]),
  java: async (file) =>
    exec("java", ["-jar", "scripts/google-java-format.jar", "--replace", file]),
  rust: async (file) => exec("rustfmt", [file]),
};

async function getAllFilesRecursively(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const fullPath = path.join(dir, entry.name);
      return entry.isDirectory() ? getAllFilesRecursively(fullPath) : fullPath;
    }),
  );
  return files.flat();
}

async function main() {
  const allFiles = await getAllFilesRecursively(ROOT);
  const limit = pLimit(10); // Concurrency limit
  const failedPaths = [];

  const formatTasks = allFiles
    .map((file) => {
      const ext = path.extname(file);
      const lang = EXTENSION_TO_LANGUAGE[ext];
      if (!lang || !(lang in FORMAT_COMMANDS)) return null;

      const format = FORMAT_COMMANDS[lang];

      return limit(() =>
        format(file)
          .then(() => console.log(`✅ Formatted: ${file}`))
          .catch((err) => {
            console.warn(`❌ Failed: ${file}`);
            console.warn(err.message);
            failedPaths.push(file);
          }),
      );
    })
    .filter(Boolean);

  await Promise.allSettled(formatTasks);

  if (failedPaths.length > 0) {
    await fs.writeFile(ERROR_LOG, failedPaths.join("\n"), "utf8");
    console.log(`\n⚠️ Formatting errors logged in: ${ERROR_LOG}`);
  }

  console.log("\n✅ [DONE] Formatting complete.");
}

main();
