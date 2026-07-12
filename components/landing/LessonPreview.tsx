"use client";

import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function LessonPreview() {
    return (
        <Section className="bg-background">
            <div className="text-center space-y-8 mb-12">
                <h2 className="text-3xl md:text-4xl font-serif text-foreground">
                    जैन विरासत से प्रेरित, अनुशासन से निर्देशित
                </h2>
                <p className="text-foreground/70 max-w-2xl mx-auto">
                    ब्राह्मी लिपि का अध्ययन केवल ज्ञान नहीं, एक साधना है। प्रतिदिन कुछ समय देकर आप उस परंपरा से जुड़ते हैं जिसने सहस्राब्दियों तक ज्ञान को जीवित रखा।
                </p>
            </div>

            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-border overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Left: Lesson Content */}
                    <div className="p-8 md:p-12 flex flex-col justify-center items-center space-y-8 bg-card">
                        <div className="text-sm font-medium text-accent-gold uppercase tracking-widest">
                            स्वर • 'अ'
                        </div>
                        <div className="w-48 h-48 flex items-center justify-center border-2 border-dashed border-border rounded-xl bg-background">
                            <span className="text-8xl font-serif text-foreground">𑀅</span>
                        </div>
                        <p className="text-center text-foreground/60">
                            अक्षर का अनुरेखण करें और पाठ पूर्ण करें।
                        </p>
                    </div>

                    {/* Right: Context & Action */}
                    <div className="p-8 md:p-12 bg-accent-gold/5 flex flex-col justify-center space-y-6">
                        <h3 className="text-2xl font-serif text-foreground">
                            प्रथम ध्वनि
                        </h3>
                        <p className="text-foreground/70 leading-relaxed">
                            ब्राह्मी में 'अ' प्रत्येक व्यंजन में निहित स्वर है। यह सभी वाणी और ज्ञान का आरंभ प्रस्तुत करता है।
                        </p>

                        <div className="space-y-4 pt-4">
                            <div className="flex items-center space-x-4 text-sm text-foreground/80">
                                <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center">✓</div>
                                <span>ध्वन्यात्मक शुद्धता</span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-foreground/80">
                                <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center">✓</div>
                                <span>रेखा क्रम मार्गदर्शन</span>
                            </div>
                        </div>

                        <Link href="/learn/swar" className="w-full mt-6">
                            <Button size="lg" variant="primary" className="w-full">
                                अभ्यास प्रारंभ करें
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </Section>
    );
}
