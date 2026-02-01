"use client";

import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import Link from "next/link";
import AuthButton from "@/components/auth/AuthButton";
import { usePathname } from "next/navigation";

export function Header() {
    const pathname = usePathname();
    // Hide header on App routes (Journey, Lesson, etc.)
    const isAppPage = pathname?.startsWith('/letters') || pathname?.startsWith('/lesson');

    if (isAppPage) return null;

    return (
        <>
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between bg-[#1C1C1C] border-b border-[#3A3A3A] shadow-md"
            >
                {/* Left: Logo & Brand */}
                <Link href="/" className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full overflow-hidden border border-[#D4AF37]/30">
                        <img
                            src="/assets/jain_foundation_logo.jpg"
                            alt="Good Life Jain Foundation"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg md:text-xl font-serif font-bold text-[#D4AF37] leading-none tracking-wide">Good Life Jain Foundation</span>
                        <span className="text-[10px] md:text-xs font-medium text-[#A6B1C0] tracking-wider">Reviving Brahmi Script</span>
                    </div>
                </Link>

                {/* Right: Actions */}
                <div className="flex items-center gap-4">
                    <AuthButton />
                    <Link href="/courses">
                        <Button className="h-10 px-6 text-sm font-bold bg-[#D4AF37] text-[#1C1C1C] rounded-md hover:bg-[#D4AF37]/90 transition-all uppercase tracking-wide border border-[#9F8224] shadow-sm">
                            Start Learning
                        </Button>
                    </Link>
                </div>
            </motion.header>
            {/* Spacer to prevent content from hiding behind fixed header */}
            <div className="h-[72px]" aria-hidden="true" />
        </>
    );
}
