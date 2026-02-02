import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-foreground text-background py-12 border-t border-white/10">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-xl font-serif text-accent-gold">ब्राह्मी लिपि</h3>
                        <p className="text-white/60 text-sm">
                            आधुनिक तकनीक के माध्यम से प्राचीन ज्ञान का संरक्षण।
                        </p>
                    </div>

                    <div>
                        <h4 className="font-medium mb-4 text-white">सीखें</h4>
                        <ul className="space-y-2 text-sm text-white/60">
                            <li><Link href="/letters" className="hover:text-accent-gold">पाठ्यक्रम</Link></li>
                            <li><Link href="/letters" className="hover:text-accent-gold">अभ्यास</Link></li>
                            <li><Link href="#" className="hover:text-accent-gold">शब्दकोश</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium mb-4 text-white">दर्शन</h4>
                        <ul className="space-y-2 text-sm text-white/60">
                            <li><Link href="#philosophy" className="hover:text-accent-gold">जैन सिद्धांत</Link></li>
                            <li><Link href="#" className="hover:text-accent-gold">इतिहास</Link></li>
                            <li><Link href="#" className="hover:text-accent-gold">हस्तलेख</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium mb-4 text-white">संपर्क</h4>
                        <ul className="space-y-2 text-sm text-white/60">
                            <li><Link href="#about" className="hover:text-accent-gold">हमारे बारे में</Link></li>
                            <li><Link href="#" className="hover:text-accent-gold">संपर्क करें</Link></li>
                            <li><Link href="#" className="hover:text-accent-gold">समुदाय</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-white/40">
                    © {new Date().getFullYear()} ब्राह्मी लिपि शिक्षण मंच। सर्वाधिकार सुरक्षित।
                </div>
            </div>
        </footer>
    );
}
