// Renders the React Email templates in backend/emails/ to static HTML for the
// Supabase dashboard (Authentication > Emails > Templates). The output keeps
// Supabase's Go template variables ({{ .TokenHash }}, ...) as plain text.
//
// Usage: npm run render:emails  ->  backend/emails/out/<template>.html

import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { build } from "esbuild";
import { render } from "@react-email/components";
import chalk from "chalk";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "emails");
const outDir = path.join(srcDir, "out");
// Inside node_modules so the bundles can import the project's packages
const tmpDir = path.join(root, "..", "node_modules", ".cache", "emails");

const templates = fs
  .readdirSync(srcDir)
  .filter((f) => f.endsWith(".jsx"))
  .sort();

await build({
  entryPoints: templates.map((f) => path.join(srcDir, f)),
  outdir: tmpDir,
  bundle: true,
  packages: "external",
  platform: "node",
  format: "esm",
  outExtension: { ".js": ".mjs" },
  logLevel: "warning",
});

fs.mkdirSync(outDir, { recursive: true });

for (const file of templates) {
  const name = path.basename(file, ".jsx");
  const modUrl = pathToFileURL(path.join(tmpDir, `${name}.mjs`)).href;
  const { default: Template } = await import(modUrl);

  const html = await render(Template({}), { pretty: true });
  fs.writeFileSync(path.join(outDir, `${name}.html`), html);
  console.log(chalk.green("✓"), `${name}.html`);
}

fs.rmSync(tmpDir, { recursive: true, force: true });
