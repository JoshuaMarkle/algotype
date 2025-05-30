"use client"

import { useState, useEffect } from 'react';
import lessons from '@/data/lessons';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LessonCard from "@/components/LessonCard";
import { Button, PrimaryButton } from "@/components/ui/Button";

export default function Home() {
	return (
		<main className="font-[family-name:var(--font-geist-sans)]">
			<Navbar/>
			<div className="flex justify-center p-4">
				<div className="w-full max-w-5xl">
					<div className="flex flex-col items-center my-32">
						<h1 className="text-5xl font-bold text-transparent bg-clip-text bg-[radial-gradient(ellipse_at_50%_75%,_#fff_0%,_#ddd_60%,_#555_100%)] text-center flex flex-col lg:flex-row lg:space-x-2">
							<span>Typing Practice</span>
							<span>For Programmers</span>
						</h1>
						<p className="text-xl text-fg-2 mt-4 mb-8 px-8 text-center">
							Turn all the symbols and syntax into second nature
						</p>
						<div className="flex flex-row gap-4">
							<PrimaryButton>Try For Free</PrimaryButton>
							<Button>Create Account</Button>
						</div>
					</div>

					{/* Code box */}
					<div className="relative rounded-xl overflow-hidden border border-border bg-bg-2">
						<div className="flex items-center px-4 py-2 border-b border-border bg-bg-3">
							<div className="flex space-x-2">
								<div className="w-3 h-3 rounded-full bg-red-400" />
								<div className="w-3 h-3 rounded-full bg-yellow-400" />
								<div className="w-3 h-3 rounded-full bg-green-400" />
							</div>
							<div className="ml-4 text-sm text-fg-2">quickSort.py</div>
						</div>
						<div className="p-6 overflow-auto h-[340px] font-mono text-sm">
							<pre className="text-fg-3">
								<code>
									This is some code<br/>
									There needs to be some better code
								</code>
							</pre>
						</div>
					</div>

					<div className="flex items-center justify-center">
						<div className="flex items-center justify-center text-sm font-semibold border border-fg rounded-full my-16 px-4 h-8">
							Learn More
						</div>
					</div>

					<div className="pr-0 md:pr-[30%]">
						<h2 className="text-4xl font-semibold">What is AlgoType.net?</h2>
						<p className="text-xl text-fg-2 my-4">AlgoType is a platform designed to train our users typing speed, specifally for the purpose of programming. Many programmers can achieve high WPM but crash while typing code because they neglected to learn how to type <strong className="underline">real</strong> syntax.</p>
					</div>
				</div>
			</div>
			<Footer/>
		</main>
	);
}
