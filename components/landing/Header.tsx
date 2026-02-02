"use client";

import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import AuthButton from "@/components/auth/AuthButton";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Header() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Hide header on App routes (Journey, Lesson, etc.)
    const isAppPage = pathname?.startsWith('/letters') || pathname?.startsWith('/lesson');

    if (isAppPage) return null;

    return (
        <>
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="fixed top-0 left-0 right-0 z-50 bg-[#1C1C1C] border-b border-[#3A3A3A] shadow-md"
            >
                <div className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
                    {/* Left: Logo & Brand */}
                    <Link href="/" className="flex items-center gap-3">
                        <div className="h-10 w-10 md:h-12 md:w-12 rounded-full overflow-hidden border border-[#D4AF37]/30 shrink-0">
                            <img
                                src="/assets/jain_foundation_logo.jpg"
                                alt="Good Life Jain Foundation"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <span className="text-base md:text-xl font-serif font-bold text-[#D4AF37] leading-tight tracking-wide">
                                Good Life Jain Foundation
                            </span>
                            <span className="text-[10px] md:text-xs font-medium text-[#A6B1C0] tracking-wider leading-none mt-0.5">
                                ब्राह्मी लिपि का पुनरुद्धार
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <AuthButton />
                        <Link href="/letters">
                            <Button className="h-10 px-6 text-sm font-bold bg-[#D4AF37] text-[#1C1C1C] rounded-md hover:bg-[#D4AF37]/90 transition-all uppercase tracking-wide border border-[#9F8224] shadow-sm">
                                अध्ययन प्रारंभ करें
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-[#2C2C2C] border border-[#D4AF37]/20 text-[#D4AF37]"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden border-t border-[#3A3A3A] bg-[#1C1C1C] overflow-hidden"
                        >
                            <div className="flex flex-col gap-4 p-6 items-center">
                                <AuthButton />
                                <Link href="/letters" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button className="w-full h-12 text-sm font-bold bg-[#D4AF37] text-[#1C1C1C] rounded-md hover:bg-[#D4AF37]/90 transition-all uppercase tracking-wide border border-[#9F8224] shadow-sm">
                                        अध्ययन प्रारंभ करें
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>
            {/* Spacer to prevent content from hiding behind fixed header */}
            <div className="h-[72px]" aria-hidden="true" />
        </>
    );
}
