import { loadLessonBySlug } from '@/utils/loadLessonCode';
import Navbar from '@/components/Navbar';
import TypingTest from '@/components/TypingTest';

export async function generateStaticParams() {
	const lessons = (await import('@/data/lessons')).default;
	return lessons.map((lesson) => ({ slug: lesson.slug }));
}

export default async function LessonPage({ params }) {
	const { error, lesson, code } = await loadLessonBySlug(params.slug);

	if (error) {
		return (
			<main className="p-6 text-red-500 font-mono">
				<Navbar />
				<div className="mt-6">{error}</div>
			</main>
		);
	}

	return (
		<main className="font-[family-name:var(--font-geist-sans)]">
			<Navbar />
			<div className="flex justify-center p-4">
				<div className="w-full max-w-5xl">
					<h1 className="text-4xl my-6">{lesson.title}</h1>
					<TypingTest code={code} language={lesson.language} />
				</div>
			</div>
		</main>
	);
}
