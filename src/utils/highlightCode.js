let cachedHighlighter;

export async function getHighlightedTokens(code, lang = 'python') {
	if (!cachedHighlighter) {
		const shiki = await import('shiki');
		cachedHighlighter = await shiki.getHighlighter({
			theme: 'nord',
		});
	}

	return cachedHighlighter.codeToThemedTokens(code, lang, {
		includeExplanation: false,
	});
}
