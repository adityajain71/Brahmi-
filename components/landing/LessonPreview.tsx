"use client";

import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function LessonPreview() {
    return (
        <Section className="bg-background">
            <div className="text-center space-y-8 mb-12">
                <h2 className="text-3xl md:text-4xl font-serif text-foreground">
                    Begin Your Practice
                </h2>
                <p className="text-foreground/70 max-w-2xl mx-auto">
                    Experience a lesson designed for focus and retention.
                </p>
            </div>

            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-border overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Left: Lesson Content */}
                    <div className="p-8 md:p-12 flex flex-col justify-center items-center space-y-8 bg-card">
                        <div className="text-sm font-medium text-accent-gold uppercase tracking-widest">
                            Vowel • &apos;A&apos;
                        </div>
                        <div className="w-48 h-48 flex items-center justify-center border-2 border-dashed border-border rounded-xl bg-background">
                            <span className="text-8xl font-serif text-foreground">𑀅</span>
                        </div>
                        <p className="text-center text-foreground/60">
                            Trace the character to complete the lesson.
                        </p>
                    </div>

                    {/* Right: Context & Action */}
                    <div className="p-8 md:p-12 bg-accent-gold/5 flex flex-col justify-center space-y-6">
                        <h3 className="text-2xl font-serif text-foreground">
                            The First Sound
                        </h3>
                        <p className="text-foreground/70 leading-relaxed">
                            In Brahmi, &apos;A&apos; is the inherent vowel in every consonant. It represents the beginning of all speech and knowledge.
                        </p>

                        <div className="space-y-4 pt-4">
                            <div className="flex items-center space-x-4 text-sm text-foreground/80">
                                <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center">✓</div>
                                <span>Phonetic Accuracy</span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-foreground/80">
                                <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center">✓</div>
                                <span>Stroke Order Guide</span>
                            </div>
                        </div>

                        <Link href="/letters" className="w-full mt-6">
                            <Button size="lg" variant="primary" className="w-full">
                                Start Free Lesson
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </Section>
    );
}
