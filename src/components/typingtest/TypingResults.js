import { Text, RefreshCcw, ChevronRight } from "lucide-react"
import calculateStats from "./calculateStats";

export default function TypingResults({
	started,
	stats
}) {
	const {wpm, acc, time, timeTillWpmDrop } = calculateStats(started, stats);
	const formattedTime = formatTime(time);
	const correct = stats.current.correct;
	const incorrect = stats.current.incorrect;
	const timeLost = Math.ceil(time * (1 - acc / 100))

	return (
		<div className="h-[70vh] flex flex-col items-center justify-center gap-8">
			<div className="flex flex-row gap-32 font-mono">
				<div>
					<h3 className="text-6xl">{wpm > 999 ? "Inf" : wpm}</h3>
					<p className="font-mono text-lg font-bold">
						WPM <span className="text-green">•</span>{"123"} <span className="text-red">•</span>{"23"}
					</p>
				</div>
				<div>
					<h3 className="text-6xl">{acc}%</h3>
					<p className="font-mono text-lg font-bold">
						ACC <span className="text-green">•</span>{correct} <span className="text-red">•</span>{incorrect}
					</p>
				</div>
				<div>
					<h3 className="text-6xl">{formattedTime}</h3>
					<p className="font-mono text-lg font-bold">
						TIME <span className="text-red">•</span>{timeLost}
					</p>
				</div>
			</div>
			<div className="flex flex-row gap-16">
				<Text className="h-6 w-6 text-fg"/>
				<RefreshCcw className="h-6 w-6 text-fg"/>
				<ChevronRight className="h-6 w-6 text-fg"/>
			</div>
		</div>
	);
}

function formatTime(seconds) {
	const hrs = Math.floor(seconds / 3600);
	const mins = Math.floor((seconds % 3600) / 60);
	const secs = seconds % 60;

	const paddedMins = hrs > 0 ? String(mins).padStart(2, "0") : mins;
	const paddedSecs = mins > 0 || hrs > 0 ? String(secs).padStart(2, "0") : secs;

	if (hrs > 0) return `${hrs}:${paddedMins}:${paddedSecs}`;
	if (mins > 0) return `${mins}:${paddedSecs}`;
	return `${secs}s`;
}
