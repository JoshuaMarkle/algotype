'use client';
import { useState } from 'react';

export default function TypingTest({ tokens }) {
	const [input, setInput] = useState('');
	const flattened = tokens.flat();

	const totalText = flattened.map(t => t.content).join('');
	const currentInputLength = input.length;

	let typedSoFar = 0;

	return (
		<div className="p-4 bg-neutral-900 rounded-lg">
			<textarea
				className="w-full mb-4 bg-neutral-800 text-white p-2 rounded"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="Start typing..."
			/>

			<pre className="font-mono whitespace-pre-wrap text-sm leading-relaxed">
				{tokens.map((line, lineIdx) => (
					<div key={lineIdx}>
						{line.map((token, tokenIdx) => {
							const expected = token.content;
							const typed = input.slice(typedSoFar, typedSoFar + expected.length);
							const isCorrect = typed === expected;
							const isPartial = expected.startsWith(typed) && typed.length < expected.length;

							const color = isCorrect
								? token.color
								: isPartial
									? '#aaa'
									: '#444'; // not yet typed or wrong

							typedSoFar += expected.length;

							return (
								<span key={tokenIdx} style={{ color }}>{token.content}</span>
							);
						})}
					</div>
				))}
			</pre>
		</div>
	);
}
