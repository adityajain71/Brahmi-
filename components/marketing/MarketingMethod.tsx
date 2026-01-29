import { motion } from "framer-motion";

const STEPS = [
    {
        title: "Phase 1: Philosophy & Context.",
        desc: "An introduction to Jain philosophy and the role of Brahmi Lipi in preserving concepts such as Dharma, Ahimsa, Moksha, and spiritual discipline.",
        image: "/assets/mascot_2.png",
    },
    {
        title: "Phase 2: Swar & Vyanjan.",
        desc: "Learning vowels and consonants as they appear in Jain terms, sacred words, and philosophical expressions, with attention to accuracy and discipline.",
        image: "/assets/mascot_3.png",
    },
    {
        title: "Phase 3: The Art of Matras.",
        desc: "Understanding matras to correctly form Jain philosophical terms and expressions, ensuring clarity in reading and writing sacred concepts.",
        image: "/assets/mascot_1.png",
    }
];

export function MarketingMethod() {
    return (
        <section className="py-24 bg-[#1C1C1C] border-b border-[#3A3A3A]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="space-y-32 md:space-y-24">
                    {STEPS.map((step, index) => (
                        <div key={index} className={`flex flex-col md:flex-row items-center gap-16 md:gap-24 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                            <div className="flex-1 space-y-6 text-center md:text-left">
                                <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#D4AF37] leading-tight">{step.title}</h3>
                                <p className="text-xl text-[#A6B1C0] font-medium leading-relaxed max-w-md mx-auto md:mx-0">
                                    {step.desc}
                                </p>
                            </div>
                            <div className="flex-1 flex justify-center w-full">
                                <div className="w-full max-w-xs md:max-w-md aspect-square bg-[#2A2A2A] rounded-3xl shadow-2xl border border-[#3A3A3A] flex items-center justify-center overflow-hidden transform hover:scale-105 transition-transform duration-500">
                                    <img
                                        src={step.image}
                                        alt={step.title}
                                        className="w-3/4 h-3/4 object-contain drop-shadow-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
