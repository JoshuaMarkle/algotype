import Link from "next/link"
import LetterGlitch from '@/components/LetterGlitch';

export default function LessonCard({ title, description, slug }) {
	return (
		<Link href={`/lessons/${slug}`}>
			<div className="relative w-full h-24 rounded-xl overflow-hidden shadow-lg border border-neutral-800">
				{/* Background animation */}
				{/*<LetterGlitch
					glitchColors={["#262626", "#404040"]}
					glitchSpeed={100}
					centerVignette={false}
					outerVignette={false}
					smooth={true}
				/>*/}

				{/* Gradient overlay */}
				{/*<div className="absolute inset-0 z-1 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />*/}

				{/* Foreground Content */}
				<div className="absolute inset-0 z-2 flex flex-col justify-center p-6">
					<h2 className="text-2xl mb-2">{title}</h2>
					<p className="text-neutral-300">{description}</p>
				</div>
			</div>
		</Link>
	);
}
