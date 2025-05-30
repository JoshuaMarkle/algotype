import { useEffect, useState } from "react";

export default function useTypingStats(started, done, stats) {
	const [wpm, setWpm] = useState(0);
	const [acc, setAcc] = useState(100);

	useEffect(() => {
		if (!started || done) return;

		const interval = setInterval(() => {
			const now = performance.now();
			const minutes = (now - started) / 1000 / 60;
			const correct = stats.current.correct;
			const incorrect = stats.current.incorrect;

			const grossWpm = correct / 5 / minutes;
			const totalTyped = correct + incorrect;
			const accPct = totalTyped > 0 ? (correct / totalTyped) * 100 : 100;

			setWpm(Math.round(grossWpm));
			setAcc(Math.round(accPct));
		}, 250);

		return () => clearInterval(interval);
	}, [started, done]);

	return { wpm, acc };
}
