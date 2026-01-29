import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-foreground text-background py-12 border-t border-white/10">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-xl font-serif text-accent-gold">Brahmi Lipi</h3>
                        <p className="text-white/60 text-sm">
                            Preserving ancient wisdom through modern technology.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-medium mb-4 text-white">Learn</h4>
                        <ul className="space-y-2 text-sm text-white/60">
                            <li><Link href="/courses" className="hover:text-accent-gold">Courses</Link></li>
                            <li><Link href="/courses/brahmi-introduction/lesson/trace-a" className="hover:text-accent-gold">Practice</Link></li>
                            <li><Link href="#" className="hover:text-accent-gold">Dictionary</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium mb-4 text-white">Philosophy</h4>
                        <ul className="space-y-2 text-sm text-white/60">
                            <li><Link href="#philosophy" className="hover:text-accent-gold">Jain Principles</Link></li>
                            <li><Link href="#" className="hover:text-accent-gold">History</Link></li>
                            <li><Link href="#" className="hover:text-accent-gold">Manuscripts</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium mb-4 text-white">Connect</h4>
                        <ul className="space-y-2 text-sm text-white/60">
                            <li><Link href="#about" className="hover:text-accent-gold">About Us</Link></li>
                            <li><Link href="#" className="hover:text-accent-gold">Contact</Link></li>
                            <li><Link href="#" className="hover:text-accent-gold">Community</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-white/40">
                    © {new Date().getFullYear()} Brahmi Lipi Learning Platform. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
