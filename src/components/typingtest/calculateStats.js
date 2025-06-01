export default function calculateStats(started, stats) {
	if (!started || !stats?.current) {
		return { wpm: 0, acc: 100, time: 0, timeTillWpmDrop: Infinity };
	}

	const now = performance.now();
	const seconds = (now - started) / 1000
	const minutes = seconds / 60;

	const correct = stats.current.correct;
	const incorrect = stats.current.incorrect;
	const totalTyped = correct + incorrect;

	const grossWpm = correct / 5 / minutes;
	const accPercent = totalTyped > 0 ? (correct / totalTyped) * 100 : 100;

	const wpm = Math.round(grossWpm);
	const acc = Math.floor(accPercent);
	const time = Math.round(seconds);

	// Time it takes to drop 1 WPM
	const timeTillWpmDrop = grossWpm <= 1 ? Infinity : (correct / 5) / (grossWpm - 1) * 60 - seconds;

	return { wpm, acc, time, timeTillWpmDrop };
}
