"use client";

import { Section } from "@/components/ui/Section";
import { motion } from "framer-motion";

export function Philosophy() {
    return (
        <Section id="philosophy" className="bg-foreground text-background relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto text-center space-y-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-5xl font-serif leading-tight mb-6">
                        &quot;Knowledge is the soul&apos;s intrinsic nature.&quot;
                    </h2>
                    <p className="text-accent-gold text-lg font-medium tracking-widest uppercase">
                        — Jain Philosophy
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    {[
                        {
                            title: "Right Perception",
                            desc: "Seeing the script not just as shapes, but as a vessel of truth."
                        },
                        {
                            title: "Right Knowledge",
                            desc: "Understanding the structure, phonetics, and history accurately."
                        },
                        {
                            title: "Right Conduct",
                            desc: "Practicing with discipline, consistency, and respect."
                        }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                            viewport={{ once: true }}
                            className="p-6 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                        >
                            <h3 className="text-accent-saffron font-serif text-xl mb-3">{item.title}</h3>
                            <p className="text-white/70 text-sm leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Section>
    );
}
