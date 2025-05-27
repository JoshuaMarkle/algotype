import path from 'path';
import fs from 'fs/promises';
import { loadLessonBySlug } from '@/utils/loadLessonCode';
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer"
import TypingTest from '@/components/TypingTest';

export async function generateStaticParams() {
	const lessons = (await import('@/data/lessons')).default;
	return lessons.map((lesson) => ({ slug: lesson.slug }));
}

export default async function LessonPage({ params }) {
	const { error, lesson } = await loadLessonBySlug(params.slug);

	if (error) {
		return (
			<main className="p-6 text-red-500 font-mono">
				<Navbar/>
				<div className="mt-6">{error}</div>
			</main>
		);
	}

	const tokenPath = path.join(process.cwd(), 'src/data/tokens', `${lesson.slug}.tokens.json`);
	const tokenFile = await fs.readFile(tokenPath, 'utf-8');
	const tokenLines = JSON.parse(tokenFile);

	return (
		<main className="font-[family-name:var(--font-geist-sans)]">
			<Navbar/>
			<div className="flex justify-center p-4">
				<div className="w-full max-w-5xl">
					<h1 className="text-4xl my-6">{lesson.title}</h1>
					<TypingTest tokens={tokenLines.tokens} />
				</div>
			</div>
			<Footer/>
		</main>
	);
}
