"use client";

import { Section } from "@/components/ui/Section";
import { motion } from "framer-motion";
import { PenTool, Repeat, Brain, Trophy } from "lucide-react";

const steps = [
    {
        icon: PenTool,
        title: "Interactive Writing",
        description: "Trace each letter on our digital canvas. Feel the flow of the strokes as you master the form."
    },
    {
        icon: Repeat,
        title: "Spaced Repetition",
        description: "Review characters at optimal intervals. Our algorithm ensures you remember what you learn."
    },
    {
        icon: Brain,
        title: "Deep Understanding",
        description: "Learn the phonetics and philosophical significance behind each vowel and consonant."
    },
    {
        icon: Trophy,
        title: "Gradual Mastery",
        description: "Progress from simple letters to complex conjuncts and full sentences. Earn your proficiency."
    }
];

export function HowItWorks() {
    return (
        <Section className="bg-white/50 border-y border-border/50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-4xl font-serif text-foreground">
                            A Disciplined Approach
                        </h2>
                        <p className="text-foreground/70 text-lg leading-relaxed">
                            Learning Brahmi is not just about memorization; it is a practice of mindfulness.
                            Our platform guides you through a structured path of discovery.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="flex flex-col space-y-3"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 rounded-lg bg-accent-saffron/10 text-accent-saffron">
                                        <step.icon className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-serif font-semibold text-lg">{step.title}</h3>
                                </div>
                                <p className="text-sm text-foreground/70 pl-12">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="relative h-[500px] bg-background rounded-2xl border border-border shadow-lg p-8 flex items-center justify-center overflow-hidden"
                >
                    {/* Abstract representation of the learning interface */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent-gold/5 to-transparent" />

                    <div className="text-center space-y-6 z-10">
                        <div className="text-9xl font-serif text-foreground/80 animate-pulse">
                            𑀅
                        </div>
                        <p className="text-accent-gold tracking-widest uppercase text-sm">
                            The Letter &apos;A&apos;
                        </p>
                        <div className="flex justify-center space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-2 h-2 rounded-full bg-border" />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </Section>
    );
}
