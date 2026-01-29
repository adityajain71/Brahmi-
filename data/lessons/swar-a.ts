import { Lesson } from "@/types/lesson";

export const sampleLesson: Lesson = {
    id: "swar-a",
    type: "vowel",
    title: "अ",
    description: "देवनागरी स्वर ‘अ’ और उसका ब्राह्मी रूप",
    steps: [
        {
            id: "intro",
            type: "intro",
            prompt: "स्वर ‘अ’ सीखिए"
        },
        {
            id: "explain",
            type: "explanation",
            data: {
                devnagari: "अ",
                brahmi: "𑀅"
            }
        },
        {
            id: "recognition",
            type: "recognition_mcq",
            data: {
                question: "‘अ’ का ब्राह्मी चिन्ह कौन-सा है?",
                options: ["𑀆", "𑀇", "𑀅", "𑀊"],
                answer: "𑀅"
            }
        },
        {
            id: "trace",
            type: "trace",
            data: {
                character: "𑀅"
            }
        },
        {
            id: "reward",
            type: "reward"
        }
    ],
    reward: {
        points: 1,
        badge: "पहला कदम"
    }
};
