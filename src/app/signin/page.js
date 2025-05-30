"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button, PrimaryButton } from "@/components/ui/Button";
import { useState } from "react";

export default function SignInPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		// Handle sign-in logic here (API call, validation, etc.)
		console.log("Email:", email);
		console.log("Password:", password);
	};

	return (
		<main className="font-[family-name:var(--font-geist-sans)]">
			<Navbar />
			<div className="flex justify-center p-4">
				<div className="w-full max-w-md mt-24 mb-32">
					<h1 className="text-4xl font-bold text-transparent bg-clip-text bg-[radial-gradient(ellipse_at_50%_75%,_#fff_0%,_#ddd_60%,_#555_100%)] text-center mb-6">
						Sign In
					</h1>
					<p className="text-center text-fg-2 text-base mb-8">
						Access your lessons and track your progress
					</p>

					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<input
							type="email"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="px-4 py-3 rounded-lg bg-bg-2 border border-border text-fg-1 placeholder:text-fg-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<input
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="px-4 py-3 rounded-lg bg-bg-2 border border-border text-fg-1 placeholder:text-fg-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<PrimaryButton type="submit">Sign In</PrimaryButton>
					</form>

					<p className="text-center text-sm text-fg-3 mt-6">
						Don’t have an account?{" "}
						<a href="/signup" className="underline">
							Sign up
						</a>
					</p>
				</div>
			</div>
			<Footer />
		</main>
	);
}
