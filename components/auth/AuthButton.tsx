"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCurrentIdentity, Identity } from '@/lib/guestIdentity';
import { getAvatarUrl } from '@/lib/getAvatarUrl';
import SignInPopup from './SignInPopup';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import Image from 'next/image';
import Link from 'next/link';

export default function AuthButton() {
    const router = useRouter();
    const [identity, setIdentity] = useState<Identity>({ type: 'none', id: null });
    const [showSignInPopup, setShowSignInPopup] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        const supabase = getSupabaseBrowserClient();

        const loadIdentity = async () => {
            const currentIdentity = await getCurrentIdentity();
            setIdentity(currentIdentity);

            if (!supabase) {
                setAvatarUrl(null);
                setUserName(null);
                return;
            }

            const { data } = await supabase.auth.getUser();
            const user = data.user;
            if (user) {
                setAvatarUrl(getAvatarUrl(user));
                setUserName(
                    user.user_metadata?.full_name ||
                    user.user_metadata?.name ||
                    user.email ||
                    'User'
                );
            } else {
                setAvatarUrl(null);
                setUserName(null);
            }
        };

        loadIdentity();

        if (!supabase) {
            return;
        }

        const { data: authListener } = supabase.auth.onAuthStateChange(() => {
            loadIdentity();
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const handleSignOut = async () => {
        const supabase = getSupabaseBrowserClient();
        if (!supabase) {
            setIdentity({ type: 'guest', id: 'guest_' + Math.random().toString(36) });
            setAvatarUrl(null);
            setUserName(null);
            router.push('/');
            return;
        }

        await supabase.auth.signOut();
        setIdentity({ type: 'guest', id: 'guest_' + Math.random().toString(36) });
        setAvatarUrl(null);
        setUserName(null);
        router.push('/');
    };

    if (identity.type === 'user') {
        return (
            <Link href="/profile" className="flex items-center gap-2 md:gap-3 group cursor-pointer">
                {avatarUrl ? (
                    <Image src={avatarUrl} alt={userName || 'User'} width={36} height={36} className="h-8 w-8 md:h-9 md:w-9 rounded-full border border-[#D4AF37]/40 group-hover:border-[#D4AF37] object-cover transition-all" unoptimized />
                ) : (
                    <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center font-bold text-xs">
                        {(userName || 'U').substring(0, 1).toUpperCase()}
                    </div>
                )}
                <div className="hidden sm:block text-left">
                    <div className="text-xs text-[#E6D8B8] font-semibold group-hover:text-[#D4AF37] transition-colors">{userName || 'Profile'}</div>
                    <div className="text-[10px] text-gray-400">View Profile</div>
                </div>
            </Link>
        )
    }

    return (
        <>
                <div className="flex items-center gap-2 md:gap-3">
                <span className="text-xs text-[#D4AF37]/70 hidden md:inline">
                    Sign in to save progress
                </span>
                <button
                    onClick={() => setShowSignInPopup(true)}
                    className="text-sm font-bold text-[#EDEDED] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 px-3 py-1.5 md:px-4 md:py-2 rounded-md transition-all uppercase tracking-widest border border-transparent hover:border-[#D4AF37]/50"
                >
                    Sign in
                </button>
            </div>
            <SignInPopup
                isVisible={showSignInPopup}
                onClose={() => setShowSignInPopup(false)}
            />
        </>
    );
}
