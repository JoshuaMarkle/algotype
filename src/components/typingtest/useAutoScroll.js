import { useEffect, useRef } from "react";

export default function useAutoScroll(started, done, currentLineRef, tokenIdx, typed) {
	const scrollTargetY = useRef(0);
	const scrollRaf = useRef(null);

	useEffect(() => {
		if (!started || done) return;

		const frame = requestAnimationFrame(() => {
			if (!currentLineRef.current) return;

			const rect = currentLineRef.current.getBoundingClientRect();
			const middleY = window.scrollY + rect.top - window.innerHeight / 2 + rect.height / 2;
			scrollTargetY.current = middleY;

			const scrollStep = () => {
				const currentScroll = window.scrollY;
				const diff = scrollTargetY.current - currentScroll;
				const delta = diff * 0.15;

				if (Math.abs(diff) > 1) {
					window.scrollTo(0, currentScroll + delta);
					scrollRaf.current = requestAnimationFrame(scrollStep);
				} else {
					cancelAnimationFrame(scrollRaf.current);
				}
			};

			cancelAnimationFrame(scrollRaf.current);
			scrollRaf.current = requestAnimationFrame(scrollStep);
		});

		return () => cancelAnimationFrame(frame);
	}, [tokenIdx, typed, started, done, currentLineRef]);
}
