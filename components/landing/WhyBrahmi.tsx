"use client";

import { Section } from "@/components/ui/Section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Scroll, Landmark, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    {
        icon: Landmark,
        title: "The Mother of Scripts",
        description: "Brahmi is the ancestor of nearly all Indian scripts, including Devanagari, Tamil, and Telugu. Learning it connects you to the roots of South Asian literacy."
    },
    {
        icon: Scroll,
        title: "Preserved in Stone",
        description: "From the Edicts of Ashoka to ancient cave inscriptions, Brahmi carries the voice of history. Read the words exactly as they were carved millennia ago."
    },
    {
        icon: BookOpen,
        title: "Gateway to Wisdom",
        description: "Unlock original texts and manuscripts in their authentic form. Experience the profound depth of Jain and Buddhist philosophy without translation layers."
    }
];

export function WhyBrahmi() {
    return (
        <Section id="about" className="bg-transparent relative z-10">
            <div className="text-center mb-16 space-y-4">
                <h2 className="text-3xl md:text-4xl font-serif text-foreground">Why Learn Brahmi?</h2>
                <p className="text-foreground/70 max-w-2xl mx-auto">
                    More than just a script, Brahmi is a bridge to the past.
                    Rediscover the elegance of ancient communication.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                    >
                        <Card className="h-full border border-white/20 shadow-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:scale-[1.02] transition-all duration-300">
                            <CardHeader>
                                <div className="w-14 h-14 rounded-2xl bg-accent-gold/20 flex items-center justify-center mb-4 text-accent-gold ring-1 ring-accent-gold/30">
                                    <feature.icon className="w-7 h-7" />
                                </div>
                                <CardTitle className="mb-2 text-xl">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-foreground/80 leading-relaxed font-light">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </Section>
    );
}
