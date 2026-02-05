import { Button } from "@/components/ui/Button";
import Link from 'next/link';

export function MarketingHero() {
    return (
        <section className="bg-[#1C1C1C] min-h-screen flex items-center justify-center pt-28 pb-12 px-6 border-b border-[#3A3A3A] overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">

                {/* Left: Copy (Order 2 on Mobile, Order 1 on Desktop) */}
                <div className="text-center lg:text-left space-y-6 md:space-y-8 order-2 lg:order-1 relative z-10">
                    <h1 className="text-5xl md:text-7xl font-serif text-[#EDEDED] font-bold leading-tight tracking-wide drop-shadow-xl">
                        प्राचीन ज्ञान की प्रतिध्वनि: <br className="hidden lg:block" />
                        <span className="text-[#D4AF37]">ब्राह्मी लिपि में</span> जैन दर्शन
                    </h1>
                    <h2 className="text-xl md:text-2xl text-[#EDEDED] font-semibold">
                        ब्राह्मी लिपि के माध्यम से संरक्षित शाश्वत जैन ज्ञान।
                    </h2>
                    <p className="text-lg md:text-xl text-[#A6B1C0] font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
                        यह पाठ्यक्रम ब्राह्मी लिपि को उस माध्यम के रूप में प्रस्तुत करता है जिसके द्वारा जैन दर्शन, मूल्य और आध्यात्मिक सिद्धांत पीढ़ी दर पीढ़ी सुरक्षित रहे हैं।
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <Link href="/learn" className="w-full sm:w-auto">
                            <Button className="w-full sm:w-auto h-14 md:h-16 px-10 text-lg md:text-xl font-bold bg-[#D4AF37] text-[#1C1C1C] rounded-2xl shadow-[0_4px_0_0_#9F8224] hover:bg-[#D4AF37]/90 active:translate-y-1 active:shadow-none transition-all uppercase tracking-wider">
                                अध्ययन प्रारंभ करें
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Right: Mascot (Order 1 on Mobile, Order 2 on Desktop) */}
                <div className="flex justify-center lg:justify-end order-1 lg:order-2">
                    <div className="relative w-64 h-64 md:w-[600px] md:h-[600px] animate-float">
                        <img
                            src="/assets/mascot_hero.png"
                            alt="Brahmi Scholar Mascot"
                            className="w-full h-full object-contain drop-shadow-2xl"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
