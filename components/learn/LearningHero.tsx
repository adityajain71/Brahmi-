import { Button } from "@/components/ui/Button";
import Link from 'next/link';

export function LearningHero() {
    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-12 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Column: Text & CTA */}
            <div className="text-center md:text-left space-y-8 order-2 md:order-1">
                <h1 className="text-4xl md:text-6xl font-serif text-learning-surface font-bold leading-tight">
                    The free, fun way to learn <span className="text-learning-gold">Brahmi</span>.
                </h1>

                <p className="text-xl text-learning-info font-medium max-w-md mx-auto md:mx-0">
                    Master the mother of scripts. Unlock ancient wisdom. forever.
                </p>

                <div className="pt-4">
                    <Link href="/learn/lesson/intro-history">
                        <Button variant="learning-action" size="lg" className="w-full md:w-auto text-xl px-12 py-7 rounded-2xl shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-1">
                            START LEARNING
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Right Column: Visual / Mascot */}
            <div className="flex justify-center md:justify-end order-1 md:order-2">
                <div className="w-64 h-64 md:w-96 md:h-96 bg-learning-surface/5 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-learning-surface/10 animate-float">
                    <span className="text-9xl filter drop-shadow-2xl">🦉</span>
                </div>
            </div>
        </div>
    );
}
