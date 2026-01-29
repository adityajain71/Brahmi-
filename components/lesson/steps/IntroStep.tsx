import React from 'react';
import { LessonStep } from '@/types/lesson';

interface IntroStepProps {
    step: LessonStep;
    onComplete: () => void;
}

const IntroStep: React.FC<IntroStepProps> = ({ step, onComplete }) => {
    return (
        <div className="flex flex-col items-center justify-center space-y-8 p-8 text-center bg-white rounded-xl shadow-sm border border-orange-100/20 max-w-lg mx-auto">
            <h2 className="text-3xl font-bold text-gray-800">{step.prompt}</h2>
            <p className="text-gray-600">Get ready to learn a new Brahmi character!</p>
            <button
                onClick={onComplete}
                className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-full transition-colors text-lg"
            >
                Start Lesson
            </button>
        </div>
    );
};

export default IntroStep;
