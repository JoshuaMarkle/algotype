import lessons from '@/data/lessons';
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import LessonCard from "@/components/LessonCard"

export default function Home() {
	return (
		<main className="font-[family-name:var(--font-geist-sans)]">
			<Navbar/>
			<div className="flex justify-center p-4">
				<div className="w-full max-w-5xl">
					<h1 className="text-4xl my-6">Lessons</h1>
					<div className="grid gap-4 sm:grid-cols-2">
						{lessons.map((lesson) => (
							<LessonCard
								key={lesson.slug}
								title={lesson.title}
								description={lesson.description}
								slug={lesson.slug}
							/>
						))}
					</div>
				</div>
			</div>
			<Footer/>
		</main>
	);
}
