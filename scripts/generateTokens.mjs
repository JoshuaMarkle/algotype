import fs from 'fs/promises';
import path from 'path';
import { createHighlighter } from 'shiki';
import lessons from '../src/data/lessons.js';

const OUTPUT_DIR = path.join(process.cwd(), 'src/data/tokens');

async function main() {
	const theme = "github-dark-default"
	const highlighter = await createHighlighter({
		themes: [theme],
		langs: ["python", "asm"],
	});

	await fs.mkdir(OUTPUT_DIR, { recursive: true });

	for (const lesson of lessons) {
		const inputPath = path.join(process.cwd(), 'src/data/files', lesson.file);
		const outputPath = path.join(OUTPUT_DIR, `${lesson.slug}.tokens.json`);

		const code = await fs.readFile(inputPath, 'utf-8');
		let tokens = highlighter.codeToTokens(code, {
			lang: lesson.language,
			theme: theme,
		});

		// Custom processing for typing
		tokens = Array.isArray(tokens) ? tokens : tokens?.tokens;
		tokens = processTokenLines(tokens);

		await fs.writeFile(outputPath, JSON.stringify(tokens, null, 2), 'utf-8');
		console.log(`\x1b[32m[SUCCESS]\x1b[0m	Tokenized: ${lesson.slug}`);
	}

	console.log('\x1b[36m[COMPLETE]\x1b[0m');
}

main().catch((err) => {
	console.error('\x1b[31m[FAILED]\x1b[0m	Token generation failed:', err);
	process.exit(1);
});

function processTokenLines(lines) {
	return lines.map((lineTokens) => {
		// Flatten line into full string
		const fullLine = lineTokens.map(t => t.content).join("");

		// Determine if this entire line should be skipped
		const isFullLineSkippable =
			fullLine.trim() === "" ||
			fullLine.trimStart().startsWith("#") ||
			fullLine.trimStart().startsWith("//") ||
			fullLine.trimStart().startsWith(";;") ||
			(fullLine.trim().startsWith('"""') && fullLine.trim().endsWith('"""')) ||
			(fullLine.trim().startsWith("'''") && fullLine.trim().endsWith("'''"));

		if (isFullLineSkippable) {
			return {
				skip: true,
				tokens: lineTokens.map(({ offset, ...t }) => ({ ...t, skip: true }))
			};
		}

		// Detect and isolate leading whitespace from the first token
		let newTokens = [...lineTokens];
		if (lineTokens.length > 0) {
			const first = lineTokens[0];
			const match = first.content.match(/^(\s+)(\S.*)?$/);
			if (match) {
				const [ , leading, rest ] = match;

				const leadingToken = {
					...first,
					content: leading,
					skip: true
				};
				delete leadingToken.offset;

				const tokens = [leadingToken];
				if (rest) {
					const restToken = {
						...first,
						content: rest,
						skip: false
					};
					delete restToken.offset;
					tokens.push(restToken);
				}

				// Replace first token with split
				newTokens = [...tokens, ...lineTokens.slice(1).map(({ offset, ...t }) => t)];
			} else {
				// Strip offset from all tokens if not splitting
				newTokens = lineTokens.map(({ offset, ...t }) => t);
			}
		}

		// Detect inline comments
		const commentIdx = newTokens.findIndex(t => {
			const s = t.content.trimStart();
			return s.startsWith("//") || s.startsWith("#") || s.startsWith(";");
		});

		if (commentIdx !== -1) {
			// mark every token from the comment start to end-of-line as skippable
			newTokens = [
				...newTokens.slice(0, commentIdx),                         // code before comment
				...newTokens.slice(commentIdx).map(tok => ({ ...tok, skip: true })) // comment tokens
			];
		}

		return {
			skip: false,
			tokens: newTokens
		};
	});
}
