export default function TypingTest({ code, language }) {
	return (
		<pre className="whitespace-pre-wrap font-mono text-neutral-300 p-4 rounded-lg overflow-auto max-h-[60vh]">
		{code}
		</pre>
	);
}
