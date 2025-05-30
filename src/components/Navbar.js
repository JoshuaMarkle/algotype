"use client";

import { useEffect, useRef, useState } from "react";
import { Code } from "lucide-react";
import clsx from "clsx";

export default function Navbar() {
	const [visible, setVisible] = useState(true);
	const lastScrollY = useRef(0);

	const controlNavbar = () => {
		const currentScrollY = window.scrollY;

		if (currentScrollY <= 10) {
			setVisible(true);
		} else if (currentScrollY > lastScrollY.current) {
			setVisible(false);
		} else {
			setVisible(true);
		}

		lastScrollY.current = currentScrollY;
	};

	useEffect(() => {
		window.addEventListener("scroll", controlNavbar);
		return () => {
			window.removeEventListener("scroll", controlNavbar);
		};
	}, []);

	// Fixed height of navbar (p-4 = 16px top/bottom padding, plus content)
	const navbarHeight = 48;

	return (
		<>
			{/* Actual navbar (fixed) */}
			<nav
				className={clsx(
					"fixed top-0 left-0 w-full z-50 bg-black transition-transform duration-300",
					visible ? "translate-y-0" : "-translate-y-full"
				)}
				style={{ height: `${navbarHeight}px` }}
			>
				<div className="flex justify-center h-full border-b border-neutral-800 px-4">
					<div className="w-full flex items-center justify-between max-w-5xl">
						<div className="flex flex-row gap-2 items-center">
							<Code className="h-6 w-6 text-blue-400"/>
							<div className="font-semibold">AlgoType</div>
						</div>
						<ul className="flex gap-8">
							<li><a href="/" className="hover:text-red-400 transition">About</a></li>
							<li><a href="/lessons" className="hover:text-red-400 transition">Lessons</a></li>
							<li><a href="/signin" className="hover:text-red-400 transition">Sign In</a></li>
						</ul>
					</div>
				</div>
			</nav>

			{/* Spacer div to preserve layout height */}
			<div style={{ height: `${navbarHeight}px` }} />
		</>
	);
}
