import { Lesson } from "@/types/lesson";

export const lessonConcept: Lesson = {
    id: "concept-lipi",
    type: "onboarding",
    title: "Lipi vs. Bhasha",
    description: "Understand the difference between a Script and a Language.",
    steps: [
        {
            id: "intro",
            type: "intro",
            prompt: "Concept Check"
        },
        {
            id: "explain-lipi",
            type: "explanation",
            data: {
                heading: "What is a Lipi?",
                text: "A Lipi (Script) is a set of symbols used to represent sounds. Just like 'A' is a symbol in the Roman script.",
                devnagari: "Lipi",
                brahmi: "𑀮𑀺𑀧𑀺"
            }
        },
        {
            id: "quiz-true-false",
            type: "recognition_mcq",
            data: {
                question: "True or False: Brahmi is a spoken language like Hindi.",
                options: ["True", "False"],
                answer: "False"
            }
        },
        {
            id: "reward",
            type: "reward"
        }
    ],
    reward: {
        points: 10,
        badge: "Concept Master"
    }
};
