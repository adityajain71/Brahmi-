import { Lesson } from "@/types/lesson";

export const lessonHistory: Lesson = {
    id: "intro-history",
    type: "onboarding",
    title: "The Mother of Scripts",
    description: "Discover the divine origins of the Brahmi script.",
    steps: [
        {
            id: "intro",
            type: "intro",
            prompt: "Unlock the Ancient Wisdom"
        },
        {
            id: "narrative-1",
            type: "explanation",
            data: {
                devnagari: "मूल",
                brahmi: "𑀅", // Using 'A' as symbol for now
                heading: "A Gift from Rishabhdev",
                text: "Brahmi is the 'Mother of Scripts', created by Lord Rishabhdev for his daughter, Brahmi, to preserve knowledge for eternity.",
                // audioUrl: "/audio/history-1.mp3" // Placeholder
            }
        },
        {
            id: "narrative-2",
            type: "explanation",
            data: {
                devnagari: "लिपि",
                brahmi: "𑀟",
                heading: "Not a Language, A Script",
                text: "It is crucial to understand: Brahmi is a Lipi (Writing System), not a spoken language (Bhasha). It can be used to write Sanskrit, Prakrit, and even Hindi!",
            }
        },
        {
            id: "quiz-origin",
            type: "recognition_mcq",
            data: {
                question: "Who was the Brahmi script created for?",
                options: ["Lord Rishabhdev", "Brahmi", "Bharat", "Bahubali"],
                answer: "Brahmi"
            }
        },
        {
            id: "reward",
            type: "reward"
        }
    ],
    reward: {
        points: 10,
        badge: "Origin Seeker"
    }
};
