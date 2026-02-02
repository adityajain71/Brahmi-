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
                        लिपि, भाषा नहीं।
                    </h2>
                    <p className="text-lg text-[#A6B1C0] font-medium leading-relaxed">
                        जैन परंपरा में ब्राह्मी को एक <strong>लिपि</strong> के रूप में समझा जाता है, न कि बोली जाने वाली भाषा के रूप में।
                        यह जैन दार्शनिक सिद्धांत, आगम, और शिक्षाओं को लिखित रूप में संरक्षित करने का सटीक माध्यम है।
                    </p>
                    <Button variant="ghost" className="text-[#D4AF37] font-bold uppercase tracking-widest hover:bg-[#D4AF37]/10">
                        मूल आधार को समझिए
                    </Button>
                </div>
            </div>
        </section>
    );
}
