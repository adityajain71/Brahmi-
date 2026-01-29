export type LessonType = "onboarding" | "vowel" | "matra" | "consonant";

export type LessonStepType =
    | "intro"
    | "explanation"
    | "recognition_mcq"
    | "reverse_mcq"
    | "trace"
    | "listen_repeat"
    | "quiz"
    | "reward";

export interface LessonStep {
    id: string;
    type: LessonStepType;
    prompt?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any; // structured per step type
}

export interface Lesson {
    id: string;
    type: LessonType;
    title: string;
    description?: string;
    steps: LessonStep[];
    reward?: {
        points: number;
        badge: string;
    };
}
