import fs from 'fs/promises';
import path from 'path';
import { createHighlighter } from 'shiki';
import lessons from '../src/data/lessons.js';

const OUTPUT_DIR = path.join(process.cwd(), 'src/data/tokens');

async function main() {

	const uniqueLangs = [...new Set(lessons.map(l => l.language.toLowerCase()))];
	const theme = "github-dark"

	const highlighter = await createHighlighter({
		themes: [theme],
		langs: uniqueLangs,
	});

	await fs.mkdir(OUTPUT_DIR, { recursive: true });

	for (const lesson of lessons) {
		const inputPath = path.join(process.cwd(), 'src/data/files', lesson.file);
		const outputPath = path.join(OUTPUT_DIR, `${lesson.slug}.tokens.json`);

		const code = await fs.readFile(inputPath, 'utf-8');
		const tokens = highlighter.codeToTokens(code, {
			lang: lesson.language,
			theme: theme,
		});

		await fs.writeFile(outputPath, JSON.stringify(tokens, null, 2), 'utf-8');
		console.log(`✅ Tokenized: ${lesson.slug}`);
	}

	console.log('✨ All tokens generated.');
}

main().catch((err) => {
	console.error('❌ Token generation failed:', err);
	process.exit(1);
});
