import ancientEchoes from '@/content/courses/ancient-echoes.json';

export function getNextLessonId(currentLessonId: string): string | null {
    // Flatten all lessons from modules
    const allLessons = ancientEchoes.modules.flatMap(module => module.lessons);

    const currentIndex = allLessons.findIndex(l => l.lessonId === currentLessonId);

    if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
        return allLessons[currentIndex + 1].lessonId;
    }

    return null;
}
