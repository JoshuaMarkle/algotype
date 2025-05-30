// generate-tokens.js

import fs from 'fs/promises';
import path from 'path';
import Prism from 'prismjs';
import loadLanguages from 'prismjs/components/index.js';
import lessons from '../src/data/lessons.js';

const OUTPUT_DIR = path.join(process.cwd(), 'src/data/tokens');

// Deduplicate and verify supported Prism languages
const uniqueLangs = Array.from(new Set(lessons.map(l => l.language)));
const supportedLangs = [];

for (const lang of uniqueLangs) {
	try {
		loadLanguages([lang]);
		if (Prism.languages[lang]) {
			supportedLangs.push(lang);
		} else {
			console.warn(`\x1b[33m[SKIPPED]\x1b[0m Language '${lang}' is not recognized by Prism.js after loading.`);
		}
	} catch {
		console.warn(`\x1b[33m[SKIPPED]\x1b[0m Failed to load unsupported language: ${lang}`);
	}
}

await fs.mkdir(OUTPUT_DIR, { recursive: true });

await Promise.all(lessons.map(async (lesson) => {
	if (!supportedLangs.includes(lesson.language)) {
		console.warn(`\x1b[33m[SKIPPED]\x1b[0m ${lesson.slug} — unsupported language: ${lesson.language}`);
		return;
	}

	const inputPath = path.join(process.cwd(), 'src/data/files', lesson.file);
	const outputPath = path.join(OUTPUT_DIR, `${lesson.slug}.tokens.json`);
	const code = await fs.readFile(inputPath, 'utf-8');
	const lines = code.split('\n');

	const processed = lines.map(line => {
		if (line.trim() === "") return [];
		const rawTokens = Prism.tokenize(line, Prism.languages[lesson.language]);
		const normalized = normalizeTokens(rawTokens);
		const withWlengths = addWlengths(normalized);
		return insertNewlineToken(withWlengths);
	});

	if (processed.length && processed.at(-1).length === 0) {
		processed.pop();
	}

	await fs.writeFile(outputPath, JSON.stringify(processed, null, 2), 'utf-8');
	console.log(`\x1b[32m[SUCCESS]\x1b[0m Tokenized: ${lesson.slug}`);
}));

console.log('\x1b[36m[COMPLETE]\x1b[0m');

// Helpers

function normalizeTokens(tokens) {
	const out = [];

	for (const token of tokens) {
		const type = typeof token === 'string' ? 'plain' : token.type || 'plain';
		let content = typeof token === 'string'
			? token
			: Array.isArray(token.content)
				? token.content.map(t => (typeof t === 'string' ? t : t.content)).join('')
				: token.content;

		if (typeof content !== 'string') continue;

		if (type === 'comment') {
			out.push({ type, content, skip: true });
			continue;
		}

		let buf = '', bufIsSpace = null;
		for (const ch of content) {
			const isSpace = /\s/.test(ch);
			if (buf === '') {
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

	// Efficiently compute firstReal and lastReal
	let firstReal = -1, lastReal = -1;
	for (let i = 0; i < out.length; i++) {
		if (!out[i].skip && out[i].type !== 'space') {
			firstReal = i;
			break;
		}
	}
	for (let j = out.length - 1; j >= 0; j--) {
		if (!out[j].skip && out[j].type !== 'space') {
			lastReal = j;
			break;
		}
	}
	if (firstReal !== -1) {
		for (let i = 0; i < firstReal; ++i)
		if (out[i].type === 'space') out[i].skip = true;
		for (let i = lastReal + 1; i < out.length; ++i)
		if (out[i].type === 'space') out[i].skip = true;
	}

	return out;
}

function makeToken(content, baseType, isSpace) {
	return { type: isSpace ? 'space' : baseType, content };
}

function addWlengths(tokens) {
	let count = 0;
	for (let i = tokens.length - 1; i >= 0; i--) {
		const t = tokens[i];
		if (t.skip || t.type === 'space') {
			count = 0;
		} else {
			t.wlength = ++count;
		}
	}
	return tokens;
}

function insertNewlineToken(tokens) {
	const hasRealContent = tokens.some(t => !t.skip);
	if (!hasRealContent) return tokens;

	// Find where trailing skippable tokens begin
	let insertAt = tokens.length;
	for (let i = tokens.length - 1; i >= 0; i--) {
		if (!tokens[i].skip) {
			insertAt = i + 1;
			break;
		}
	}

	const newlineToken = { type: 'newline' };
	tokens.splice(insertAt, 0, newlineToken);
	return tokens;
}
