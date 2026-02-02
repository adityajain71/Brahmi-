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
                        लिपि, भाषा नहीं।
                    </h2>
                    <p className="text-accent-gold text-lg font-medium tracking-widest uppercase">
                        — जैन परंपरा
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    {[
                        {
                            title: "लिपि का स्वरूप",
                            desc: "जैन परंपरा में ब्राह्मी को एक लिपि के रूप में समझा जाता है, न कि बोली जाने वाली भाषा के रूप में।"
                        },
                        {
                            title: "ज्ञान का माध्यम",
                            desc: "ब्राह्मी लिपि वह सटीक माध्यम है जिसके द्वारा जैन दार्शनिक सिद्धांत, आगम, और शिक्षाएँ लिखित रूप में संरक्षित की गईं।"
                        },
                        {
                            title: "परंपरा की निरंतरता",
                            desc: "आज उपलब्ध जैन ग्रंथ उसी परंपरा की निरंतरता हैं। भाषा बोली जाती है, जबकि लिपि लिखी जाती है।"
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
