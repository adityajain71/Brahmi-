'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';

export default function AuthButton() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    if (user) {
        return (
            <div className="flex items-center gap-4">
                <button onClick={handleSignOut} className="text-sm font-bold text-[#EDEDED] hover:text-[#D4AF37]">
                    Sign Out
                </button>
                {user.user_metadata.avatar_url && (
                    <img src={user.user_metadata.avatar_url} alt="Profile" className="w-8 h-8 rounded-full" />
                )}
            </div>
        );
    }

    return (
        <Link href="/login">
            <button
                className="text-sm font-bold text-[#EDEDED] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 px-4 py-2 rounded-md transition-all uppercase tracking-widest border border-transparent hover:border-[#D4AF37]/50"
            >
                Sign in
            </button>
        </Link>
    );
}
