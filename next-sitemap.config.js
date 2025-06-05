import fs from "fs/promises";
import path from "path";

export default {
  siteUrl: "https://algotype.net",
  generateRobotsTxt: true,
  outDir: "public",
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    additionalSitemaps: ["https://algotype.net/sitemap.xml"],
  },
  async additionalPaths(config) {
    const base = path.join(process.cwd(), "backend/tokens/files");
    let paths = [];
    try {
      const languages = await fs.readdir(base);
      for (const lang of languages) {
        const langDir = path.join(base, lang);
        const files = (await fs.readdir(langDir)).filter((f) =>
          f.endsWith(".json"),
        );
        for (const file of files) {
          const data = JSON.parse(
            await fs.readFile(path.join(langDir, file), "utf8"),
          );
          if (data.slug) {
            paths.push({ loc: `/files/${data.slug}` });
          }
        }
      }
    } catch {
      // ignore if tokens not present
    }
    return paths;
  },
};
