"use client";

import { Section } from "@/components/ui/Section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Scroll, Landmark, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    {
        icon: Landmark,
        title: "पवित्र उत्पत्ति",
        description: "जैन परंपरा के अनुसार, ब्राह्मी लिपि की रचना भगवान ऋषभदेव — प्रथम तीर्थंकर — द्वारा की गई। उन्होंने यह विद्या अपनी पुत्री ब्रह्मी को प्रदान की।"
    },
    {
        icon: Scroll,
        title: "लिपियों की जननी",
        description: "ब्राह्मी लिपि प्राचीन भारत की अनेक लिपियों की जननी है। एक ही लिपि से अनेक भाषाएँ लिखी जा सकती हैं।"
    },
    {
        icon: BookOpen,
        title: "जैन आगमों की मूल लिपि",
        description: "ब्राह्मी का अध्ययन हमें जैन दर्शन को उसकी जड़ों से समझने का अवसर देता है। यह जैन आगमों की मूल लिपि रही है।"
    }
];

export function WhyBrahmi() {
    return (
        <Section id="about" className="bg-transparent relative z-10">
            <div className="text-center mb-16 space-y-4">
                <h2 className="text-3xl md:text-4xl font-serif text-foreground">आज ब्राह्मी का अध्ययन क्यों आवश्यक है?</h2>
                <p className="text-foreground/70 max-w-2xl mx-auto">
                    ब्राह्मी लिपि जैन आगमों की मूल लिपि रही है। इसका अध्ययन हमें परंपरा से जोड़ता है।
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
