import path from 'path';
import fs from 'fs/promises';
import lessons from '@/data/lessons';

export async function loadLessonBySlug(slug) {
	const lesson = lessons.find((l) => l.slug === slug);
	if (!lesson) {
		return { error: 'Lesson not found', lesson: null, code: null };
	}

	try {
		const filePath = path.join(process.cwd(), 'src', 'data', 'files', lesson.file);
		const code = await fs.readFile(filePath, 'utf-8');
		return { error: null, lesson, code };
	} catch (err) {
		console.error('Failed to load lesson file:', err);
		return { error: 'Failed to load lesson file', lesson, code: null };
	}
}
