import { Button } from "@/components/ui/Button";
import Link from 'next/link';

export function MarketingCTA() {
    return (
        <section className="py-32 bg-[#1C1C1C] text-center px-6">
            <div className="max-w-3xl mx-auto space-y-8">
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#EDEDED]">
                    Begin the Study of Jain Wisdom.
                </h2>
                <p className="text-xl text-[#A6B1C0] font-medium leading-relaxed">
                    Learn Brahmi Lipi as a sacred script for understanding and preserving Jain philosophy through structured and traditional learning.
                </p>
                <div className="pt-4">
                    <Link href="/courses">
                        <Button className="w-full sm:w-auto h-16 px-12 text-xl font-bold bg-[#D4AF37] text-[#1C1C1C] rounded-2xl shadow-[0_4px_0_0_#9F8224] hover:bg-[#D4AF37]/90 active:translate-y-1 active:shadow-none transition-all uppercase tracking-wider">
                            Start Learning Now
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
