import { LearningHero } from "@/components/learn/LearningHero";
import { LearningStats } from "@/components/learn/LearningStats";
import { LearningPathGrid } from "@/components/learn/LearningPathGrid";

export default function LearnPage() {
    return (
        <div className="flex flex-col min-h-screen pb-20 space-y-24">
            {/* 1. Hero Section */}
            <section>
                <LearningHero />
            </section>

            {/* 2. Stats & Motivation - Sticky Bar style? keeping it simple for now */}
            <section className="px-4">
                <div className="max-w-4xl mx-auto mb-8 text-center md:text-left">
                    <h2 className="text-2xl font-serif text-learning-surface font-bold mb-4">Your Progress</h2>
                    <LearningStats />
                </div>
            </section>

            {/* 3. Learning Paths (The 'Menu') */}
            <section className="relative z-10 px-4">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-serif text-learning-surface font-bold mb-8 text-center md:text-left">
                        Choose Your Path
                    </h2>
                    <LearningPathGrid />
                </div>
            </section>
        </div>
    );
}
