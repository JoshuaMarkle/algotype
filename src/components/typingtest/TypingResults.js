export default function TypingResults({
	wpm,
	acc,
	correct,
	incorrect,
	backspace,
}) {
	return (
		<>
			<h2 className="text-4xl font-semibold">Results</h2>
			<h3>WPM: {wpm}</h3>
			<h3>ACC: {acc}</h3>
			<h3>COR: {correct}</h3>
			<h3>INC: {incorrect}</h3>
			<h3>BAC: {backspace}</h3>
		</>
	);
}
