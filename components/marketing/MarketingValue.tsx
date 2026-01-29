import { Button } from "@/components/ui/Button";

export function MarketingValue() {
    return (
        <section className="py-24 bg-[#1C1C1C] border-b border-[#3A3A3A]">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="flex justify-center">
                    <img
                        src="/assets/mascot_1.png"
                        alt="Brahmi Mascot"
                        className="w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-xl opacity-90"
                    />
                </div>
                <div className="space-y-6 text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#EDEDED]">
                        Lipi, Not Language.
                    </h2>
                    <p className="text-lg text-[#A6B1C0] font-medium leading-relaxed">
                        In Jain tradition, Brahmi is understood as a <strong>Lipi</strong>—a script, not a spoken language.
                        It serves as a precise medium for recording and preserving Jain philosophical concepts, scriptures, and teachings.
                    </p>
                    <Button variant="ghost" className="text-[#D4AF37] font-bold uppercase tracking-widest hover:bg-[#D4AF37]/10">
                        Understand the Foundation
                    </Button>
                </div>
            </div>
        </section>
    );
}
