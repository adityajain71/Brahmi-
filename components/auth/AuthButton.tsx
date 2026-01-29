'use client';

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AuthButton() {
    const pathname = usePathname();

    // Hide the Sign In button if we are already on the login page
    if (pathname === '/login') {
        return null;
    }

    return (
        <div className="flex items-center gap-4">
            <SignedIn>
                <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
                <Link href="/login">
                    <button
                        className="text-sm font-bold text-[#EDEDED] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 px-4 py-2 rounded-md transition-all uppercase tracking-widest border border-transparent hover:border-[#D4AF37]/50"
                    >
                        Sign in
                    </button>
                </Link>
            </SignedOut>
        </div>
    );
}
