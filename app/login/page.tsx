'use client'

import { useEffect, useState, FormEvent, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { getAppBaseUrl } from '@/lib/siteUrl'
import { motion } from 'framer-motion'

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectToPath = searchParams.get('next') || '/learn'

    const [isSignUp, setIsSignUp] = useState(false)
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [hasGuestProgress, setHasGuestProgress] = useState(false)

    useEffect(() => {
        try {
            const guestProgress = sessionStorage.getItem('brahmi_guest_progress')
            setHasGuestProgress(!!guestProgress)
        } catch {
            setHasGuestProgress(false)
        }
    }, [])

    const handleGoogleLogin = async () => {
        setIsLoading(true)
        setError(null)
        setSuccessMessage(null)

        try {
            const supabase = getSupabaseBrowserClient()
            if (!supabase) {
                setError('Authentication client is not configured on this deployment.')
                setIsLoading(false)
                return
            }

            const redirectTo = `${getAppBaseUrl()}/auth/callback?next=${encodeURIComponent(redirectToPath)}`
            const { error: oauthError } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo }
            })

            if (oauthError) throw oauthError
        } catch (err: any) {
            console.error('Google login failed:', err)
            setError(err?.message || 'Google sign-in failed. Please try again.')
            setIsLoading(false)
        }
    }

    const handleEmailAuth = async (e: FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccessMessage(null)

        if (!email || !password) {
            setError('Please enter both email and password.')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.')
            return
        }

        setIsLoading(true)

        try {
            const supabase = getSupabaseBrowserClient()
            if (!supabase) {
                setError('Authentication client is not configured on this deployment.')
                setIsLoading(false)
                return
            }

            if (isSignUp) {
                // Email Sign Up
                const { data, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName.trim() || undefined
                        }
                    }
                })

                if (signUpError) throw signUpError

                if (data.session) {
                    // Auto-logged in after sign up
                    setSuccessMessage('Account created successfully! Redirecting...')
                    setTimeout(() => router.push(redirectToPath), 1000)
                } else {
                    // Email verification required
                    setSuccessMessage('Account created! Please check your email inbox to verify your account, then sign in.')
                    setIsSignUp(false)
                }
            } else {
                // Email Sign In
                const { data, error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password
                })

                if (signInError) throw signInError

                if (data.session) {
                    setSuccessMessage('Signed in successfully! Redirecting...')
                    setTimeout(() => router.push(redirectToPath), 800)
                }
            }
        } catch (err: any) {
            console.error('Email authentication error:', err)
            setError(err?.message || 'Authentication failed. Please check your credentials.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md rounded-3xl bg-[#1a1613] border border-[#D4AF37]/30 shadow-2xl p-6 sm:p-8 flex flex-col"
        >
            {/* Header Title */}
            <div className="text-center mb-6">
                <span className="text-3xl text-[#D4AF37] mb-2 block">✦</span>
                <h2 className="text-2xl font-bold text-[#D4AF37] font-serif">
                    {isSignUp ? 'Create an Account' : 'Welcome Back'}
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                    {isSignUp ? 'Sign up to start tracking your Brahmi learning journey' : 'Sign in to sync and track your progress'}
                </p>
            </div>

            {hasGuestProgress && (
                <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] p-3 rounded-xl mb-4 text-xs text-center font-medium">
                    ✨ Your guest progress will be saved to your account
                </div>
            )}

            {/* Notifications */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/40 text-red-400 p-3 rounded-xl mb-4 text-xs text-center font-medium">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="bg-green-500/10 border border-green-500/40 text-green-400 p-3 rounded-xl mb-4 text-xs text-center font-medium">
                    {successMessage}
                </div>
            )}

            {/* Google OAuth Button */}
            <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-[#2a2420] border border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-xl px-4 py-3 font-medium text-white shadow transition text-sm disabled:opacity-50 disabled:cursor-not-allowed mb-4 cursor-pointer"
            >
                <svg className="w-5 h-5" viewBox="0 0 48 48" aria-hidden="true">
                    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.652 32.657 29.397 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.967 3.039l5.657-5.657C34.533 6.053 29.612 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.967 3.039l5.657-5.657C34.533 6.053 29.612 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                    <path fill="#4CAF50" d="M24 44c5.515 0 10.332-1.835 14.156-4.977l-6.531-5.52C29.54 35.497 26.951 36 24 36c-5.379 0-9.624-3.322-11.286-7.918l-6.52 5.02C9.505 40.556 16.179 44 24 44z"/>
                    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.19 3.347-3.71 5.975-6.678 7.503l.002-.001 6.531 5.52C34.69 40.96 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                </svg>
                <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">or with email</span>
                <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Email Auth Form */}
            <form onSubmit={handleEmailAuth} className="flex flex-col gap-3.5">
                {isSignUp && (
                    <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">Full Name</label>
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-[#2a2420] border border-[#D4AF37]/30 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition"
                        />
                    </div>
                )}

                <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">Email Address</label>
                    <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#2a2420] border border-[#D4AF37]/30 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">Password</label>
                    <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#2a2420] border border-[#D4AF37]/30 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-linear-to-r from-[#D4AF37] to-[#C5A059] text-[#1a1613] rounded-xl py-3 px-4 font-bold text-sm hover:brightness-110 transition shadow-lg shadow-[#D4AF37]/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2 cursor-pointer"
                >
                    {isLoading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
                </button>
            </form>

            {/* Mode Switcher */}
            <div className="mt-6 text-center text-xs text-gray-400">
                {isSignUp ? (
                    <p>
                        Already have an account?{' '}
                        <button
                            type="button"
                            onClick={() => { setIsSignUp(false); setError(null); setSuccessMessage(null); }}
                            className="text-[#D4AF37] font-bold hover:underline cursor-pointer ml-1"
                        >
                            Sign In
                        </button>
                    </p>
                ) : (
                    <p>
                        Don't have an account?{' '}
                        <button
                            type="button"
                            onClick={() => { setIsSignUp(true); setError(null); setSuccessMessage(null); }}
                            className="text-[#D4AF37] font-bold hover:underline cursor-pointer ml-1"
                        >
                            Sign Up
                        </button>
                    </p>
                )}
            </div>
        </motion.div>
    )
}

export default function LoginPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#1C1C1C] px-4 py-12 text-[#E6D8B8]">
            <Suspense fallback={
                <div className="text-center text-[#D4AF37]">
                    <div className="text-3xl animate-pulse mb-2">✦</div>
                    <p className="text-sm">Loading login...</p>
                </div>
            }>
                <LoginForm />
            </Suspense>
        </div>
    )
}
