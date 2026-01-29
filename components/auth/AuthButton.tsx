'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function AuthButton() {
    const { data: session } = useSession();
    const pathname = usePathname();

    if (session) {
        return (
            <button
                onClick={() => signOut()}
                className="text-sm font-bold text-[#EDEDED] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 px-4 py-2 rounded-md transition-all uppercase tracking-widest border border-transparent hover:border-[#D4AF37]/50"
            >
                Sign out
            </button>
        );
    }

    // Hide the Sign In button if we are already on the login page
    if (pathname === '/login') {
        return null;
    }

    return (
        <button
            onClick={() => signIn()}
            className="text-sm font-bold text-[#EDEDED] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 px-4 py-2 rounded-md transition-all uppercase tracking-widest border border-transparent hover:border-[#D4AF37]/50"
        >
            Sign in
        </button>
    );
}
