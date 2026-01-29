"use client"

import * as React from "react"
import { signIn } from "next-auth/react"
import { Sparkles, ArrowRight, User, Key, Mail, Smartphone, Users } from "lucide-react"

const SignIn1 = () => {
    const [authMethod, setAuthMethod] = React.useState<'email' | 'mobile'>('email');
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [otp, setOtp] = React.useState("");
    const [error, setError] = React.useState("");

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSignIn = async () => {
        if (authMethod === 'email') {
            if (!email || !password) {
                setError("Please enter both email and password.");
                return;
            }
            if (!validateEmail(email)) {
                setError("Please enter a valid email address.");
                return;
            }
        } else {
            if (!phone) {
                setError("Please enter your mobile number.");
                return;
            }
            // Mock Mobile Sign In
            try {
                console.log("Attempting mobile sign in...", { phone });
                const result = await signIn('credentials', {
                    action: 'mobile',
                    phone: phone,
                    callbackUrl: '/',
                    redirect: false, // Handle redirect manually to see response
                });
                console.log("Mobile sign in result:", result);
                if (result?.error) {
                    setError("Sign in failed: " + result.error);
                } else if (result?.ok) {
                    window.location.href = '/';
                }
            } catch (err) {
                console.error("Sign in exception:", err);
                setError("An unexpected error occurred.");
            }
            return;
        }

        setError("");
        alert("This is a demo! Please use Google Sign In.");
    };

    const handleGoogleSignIn = async () => {
        try {
            console.log("Attempting google sign in...");
            await signIn('google', { callbackUrl: '/' });
        } catch (err) {
            console.error("Google sign in exception:", err);
        }
    };

    const handleGuestSignIn = async () => {
        try {
            console.log("Attempting guest sign in...");
            const result = await signIn('credentials', {
                action: 'guest',
                callbackUrl: '/',
                redirect: false
            });
            console.log("Guest sign in result:", result);
            if (result?.error) {
                setError("Sign in failed: " + result.error);
            } else if (result?.ok) {
                window.location.href = '/';
            }
        } catch (err) {
            console.error("Guest sign in exception:", err);
            setError("An unexpected error occurred during guest sign in.");
        }
    };

    return (
        <div className="w-full flex flex-col items-center justify-center min-h-[calc(100vh-72px)] py-12 relative overflow-hidden font-serif bg-[#1C1C1C]">
            {/* Background Image Removed - Solid Dark Theme */}

            {/* Centered glass card */}
            <div className="relative z-10 w-full max-w-sm rounded-3xl bg-white/5 backdrop-blur-xl border border-[#D4AF37]/30 shadow-2xl p-8 flex flex-col items-center">
                {/* Logo */}
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#D4AF37] mb-6 shadow-lg shadow-[#D4AF37]/20">
                    <img
                        src="/assets/jain_foundation_logo.jpg"
                        alt="Brahmi Logo"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#E6D8B8] mb-2 text-center">
                    Brahmi
                </h2>
                <p className="text-[#E6D8B8]/60 text-sm mb-6 text-center font-sans tracking-wide">
                    Unlock the wisdom of the ancients
                </p>

                {/* Tabs */}
                <div className="flex w-full mb-6 bg-[#1C1C1C]/50 rounded-xl p-1 border border-[#D4AF37]/20">
                    <button
                        onClick={() => setAuthMethod('email')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${authMethod === 'email' ? 'bg-[#D4AF37] text-[#1C1C1C] shadow-md' : 'text-[#E6D8B8]/60 hover:text-[#E6D8B8]'}`}
                    >
                        <Mail className="w-4 h-4" />
                        Email
                    </button>
                    <button
                        onClick={() => setAuthMethod('mobile')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${authMethod === 'mobile' ? 'bg-[#D4AF37] text-[#1C1C1C] shadow-md' : 'text-[#E6D8B8]/60 hover:text-[#E6D8B8]'}`}
                    >
                        <Smartphone className="w-4 h-4" />
                        Mobile
                    </button>
                </div>

                {/* Form */}
                <div className="flex flex-col w-full gap-4 font-sans">
                    <div className="w-full flex flex-col gap-3">
                        {authMethod === 'email' ? (
                            <>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-3.5 w-4 h-4 text-[#E6D8B8]/50 group-focus-within:text-[#D4AF37] transition-colors" />
                                    <input
                                        id="email"
                                        name="email"
                                        autoComplete="email"
                                        placeholder="Email address"
                                        type="email"
                                        value={email}
                                        className="w-full pl-11 pr-5 py-3 rounded-xl bg-white/5 border border-white/10 text-[#E6D8B8] placeholder-[#E6D8B8]/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 transition-all"
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="relative group">
                                    <Key className="absolute left-4 top-3.5 w-4 h-4 text-[#E6D8B8]/50 group-focus-within:text-[#D4AF37] transition-colors" />
                                    <input
                                        id="password"
                                        name="password"
                                        autoComplete="current-password"
                                        placeholder="Password"
                                        type="password"
                                        value={password}
                                        className="w-full pl-11 pr-5 py-3 rounded-xl bg-white/5 border border-white/10 text-[#E6D8B8] placeholder-[#E6D8B8]/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 transition-all"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="relative group">
                                <Smartphone className="absolute left-4 top-3.5 w-4 h-4 text-[#E6D8B8]/50 group-focus-within:text-[#D4AF37] transition-colors" />
                                <input
                                    id="phone"
                                    name="phone"
                                    autoComplete="tel"
                                    placeholder="Mobile Number"
                                    type="tel"
                                    value={phone}
                                    className="w-full pl-11 pr-5 py-3 rounded-xl bg-white/5 border border-white/10 text-[#E6D8B8] placeholder-[#E6D8B8]/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 transition-all"
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        )}

                        {error && (
                            <div className="text-sm text-[#C97A63] text-center bg-[#C97A63]/10 py-2 rounded-lg">{error}</div>
                        )}
                    </div>

                    <button
                        onClick={handleSignIn}
                        className="w-full bg-[#1C1C1C] hover:bg-[#2C2C2C] text-[#E6D8B8] font-medium px-5 py-3 rounded-xl transition-all mb-2 text-sm border border-[#D4AF37]/30 hover:border-[#D4AF37]/50 flex items-center justify-center gap-2 group"
                    >
                        <span>{authMethod === 'email' ? 'Sign in with Email' : 'Send OTP'}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    <div className="relative flex items-center gap-4 my-2">
                        <div className="h-px bg-white/10 flex-1"></div>
                        <span className="text-xs text-[#E6D8B8]/40 uppercase tracking-widest">or</span>
                        <div className="h-px bg-white/10 flex-1"></div>
                    </div>

                    {/* Google Sign In */}
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center gap-3 bg-[#1C1C1C] hover:bg-[#2C2C2C] text-[#D4AF37] rounded-xl px-5 py-3 font-bold shadow-lg shadow-[#1C1C1C]/50 border border-[#D4AF37]/50 hover:border-[#D4AF37] transition-all transform hover:-translate-y-0.5 text-sm"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Continue with Google
                    </button>

                    {/* Guest Sign In */}
                    <button
                        onClick={handleGuestSignIn}
                        className="w-full flex items-center justify-center gap-2 mt-2 py-2 text-[#E6D8B8]/60 hover:text-[#D4AF37] text-xs font-medium uppercase tracking-widest transition-colors group"
                    >
                        <Users className="w-4 h-4 group-hover:text-[#D4AF37] transition-colors" />
                        Continue as Guest
                    </button>

                </div>
            </div>
        </div>
    );
};

export { SignIn1 };
