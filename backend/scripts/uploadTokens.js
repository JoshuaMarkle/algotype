import fs from "fs/promises";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import chalk from "chalk";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error(
    chalk.red(
      "[ERROR] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
    ),
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const TOKENS_DIR = path.join(process.cwd(), "backend/tokens");

async function uploadTokens() {
  const gamemodes = await fs.readdir(TOKENS_DIR);

  for (const mode of gamemodes) {
    const modePath = path.join(TOKENS_DIR, mode);
    const languages = await fs.readdir(modePath);

    for (const language of languages) {
      const langPath = path.join(modePath, language);
      const files = (await fs.readdir(langPath)).filter((f) =>
        f.endsWith(".json"),
      );

      for (const file of files) {
        const fullPath = path.join(langPath, file);
        try {
          const json = JSON.parse(await fs.readFile(fullPath, "utf8"));

          const {
            title,
            description,
            lines,
            language,
            source,
            slug,
            mode,
            tokens,
          } = json;

          if (!slug || !tokens) {
            console.warn(
              chalk.yellow(
                `[WARNING] Missing slug or tokens in: ${file} (skipped)`,
              ),
            );
            continue;
          }

          const { error } = await supabase.from("challenges").upsert(
            [
              {
                slug,
                title,
                description,
                lines,
                language,
                source,
                mode,
                tokens,
              },
            ],
            { onConflict: "slug" },
          );

          if (error) {
            console.error(
              chalk.red(`[ERROR] Failed to upload ${file}: ${error.message}`),
            );
          } else {
            console.log(
              chalk.green(`[SUCCESS] Uploaded: [${mode}/${language}/${slug}]`),
            );
          }
        } catch (err) {
          console.error(
            chalk.red(
              `[ERROR] Failed to read or upload ${file}: ${err.message}`,
            ),
          );
        }
      }
    }
  }
}

await uploadTokens();
console.log(chalk.blue("[COMPLETE]"));
