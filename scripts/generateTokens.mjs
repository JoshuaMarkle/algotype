import fs from 'fs/promises';
import path from 'path';
import { createHighlighter } from 'shiki';
import lessons from '../src/data/lessons.js';

const OUTPUT_DIR = path.join(process.cwd(), 'src/data/tokens');

function isSkippableLine(tokens) {
	// If all tokens are empty or whitespace
	if (tokens.length === 0) return true;
	const lineText = tokens.map(t => t.content).join('').trim();

	// Skip empty/whitespace lines
	if (lineText === '') return true;

	// Skip Python (#...), JS (//...), or docstring-style """comments"""
	if (
		lineText.startsWith('#') ||
		lineText.startsWith('//') ||
		(lineText.startsWith('"""') && lineText.endsWith('"""')) ||
		(lineText.startsWith("'''") && lineText.endsWith("'''"))
	) {
		return true;
	}

	return false;
}

async function main() {
	const uniqueLangs = [...new Set(lessons.map(l => l.language.toLowerCase()))];
	const theme = "github-dark";

	const highlighter = await createHighlighter({
		themes: [theme],
		langs: uniqueLangs,
	});

	await fs.mkdir(OUTPUT_DIR, { recursive: true });

	for (const lesson of lessons) {
		try {
			const inputPath = path.join(process.cwd(), 'src/data/files', lesson.file);
			const outputPath = path.join(OUTPUT_DIR, `${lesson.slug}.tokens.json`);

			const code = await fs.readFile(inputPath, 'utf-8');
			let tokens = highlighter.codeToTokens(code, {
				lang: lesson.language,
				theme,
			});

			// Apply skippable check per line
			tokens = tokens.map(line => {
				const shouldSkip = isSkippableLine(line);
				if (shouldSkip) {
					return line.map(t => ({ ...t, skip: true }));
				}
				return line;
			});

			await fs.writeFile(outputPath, JSON.stringify(tokens, null, 2), 'utf-8');
			console.log(`✅ SUCCESS: Tokenized: ${lesson.slug}`);
		} catch (err) {
			console.error(`❌ ERROR processing ${lesson.slug}:`, err);
		}
	}

	console.log('✨ DONE: All tokens generated.');
}

main().catch((err) => {
	console.error('❌ FAILED: Token generation failed:', err);
	process.exit(1);
});
