'use client'

import { useEffect, useState, FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Mail, Lock, User as UserIcon } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { getAppBaseUrl } from '@/lib/siteUrl'
import { useRouter } from 'next/navigation'

interface SignInPopupProps {
  isVisible: boolean
  onClose: () => void
}

export default function SignInPopup({ isVisible, onClose }: SignInPopupProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Auth Mode: 'google_first' | 'email_login' | 'email_signup'
  const [authMode, setAuthMode] = useState<'options' | 'email_login' | 'email_signup'>('options')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)
    
    try {
      const supabase = getSupabaseBrowserClient()
      if (!supabase) {
        setError('Google sign-in is not configured on this deployment yet.')
        setIsLoading(false)
        return
      }
      const appBaseUrl = getAppBaseUrl()
      const redirectTo = `${appBaseUrl}/auth/callback?next=${encodeURIComponent(window.location.pathname + window.location.search)}`
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo }
      })

      if (signInError) {
        throw signInError
      }
    } catch (err: any) {
      console.error('Google sign-in failed:', err)
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
        setError('Authentication client is not configured.')
        setIsLoading(false)
        return
      }

      if (authMode === 'email_signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName.trim() || undefined }
          }
        })
        if (signUpError) throw signUpError

        if (data.session) {
          setSuccessMessage('Account created successfully!')
          setTimeout(() => {
            onClose()
            router.push('/learn')
          }, 800)
        } else {
          setSuccessMessage('Account created! Please check your email inbox to verify your account.')
          setAuthMode('email_login')
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        if (signInError) throw signInError

        if (data.session) {
          setSuccessMessage('Signed in successfully!')
          setTimeout(() => {
            onClose()
            router.push('/learn')
          }, 800)
        }
      }
    } catch (err: any) {
      console.error('Email authentication error:', err)
      setError(err?.message || 'Authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-2000 bg-black/55 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Popup */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="fixed inset-0 z-2001 flex items-center justify-center overflow-hidden px-3 py-3 sm:px-6"
          >
            <div className="w-full max-w-sm sm:max-w-md max-h-[calc(100dvh-1.5rem)] overflow-y-auto bg-linear-to-br from-[#2a2420] to-[#1a1613] border border-[#D4AF37]/30 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-black/50">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" />
                <h2 className="text-xl sm:text-2xl font-bold text-[#D4AF37] leading-tight">
                  {authMode === 'email_signup' ? 'Create Account' : authMode === 'email_login' ? 'Email Sign In' : 'Save Your Progress'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10 ml-auto cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Error & Success Messages */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/40 text-red-400 p-3 rounded-lg mb-4 text-xs text-center font-medium">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="bg-green-500/10 border border-green-500/40 text-green-400 p-3 rounded-lg mb-4 text-xs text-center font-medium">
                  {successMessage}
                </div>
              )}

              {authMode === 'options' ? (
                <>
                  <div className="text-center mb-4 sm:mb-5">
                    <p className="text-sm sm:text-base text-gray-300 leading-6">
                      Sign in to automatically save your learning progress and access your lessons from any device.
                    </p>
                  </div>

                  {/* Google OAuth Button */}
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 bg-linear-to-r from-[#D4AF37] to-[#C5A059] text-[#1a1613] rounded-xl px-5 py-3.5 font-bold text-sm hover:scale-105 transition-all duration-300 shadow-lg shadow-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/40 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-[#1a1613] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 48 48" aria-hidden="true">
                          <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.652 32.657 29.397 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.967 3.039l5.657-5.657C34.533 6.053 29.612 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                          <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.967 3.039l5.657-5.657C34.533 6.053 29.612 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                          <path fill="#4CAF50" d="M24 44c5.515 0 10.332-1.835 14.156-4.977l-6.531-5.52C29.54 35.497 26.951 36 24 36c-5.379 0-9.624-3.322-11.286-7.918l-6.52 5.02C9.505 40.556 16.179 44 24 44z"/>
                          <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.19 3.347-3.71 5.975-6.678 7.503l.002-.001 6.531 5.52C34.69 40.96 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                        </svg>
                        <span>Continue with Google</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-3 my-3">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-xs text-gray-400">or</span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>

                  {/* Email Sign In / Sign Up buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAuthMode('email_login')}
                      className="flex-1 bg-[#2a2420] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-white rounded-xl py-2.5 px-3 font-medium text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Email Sign In</span>
                    </button>
                    <button
                      onClick={() => setAuthMode('email_signup')}
                      className="flex-1 bg-[#2a2420] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-[#D4AF37] rounded-xl py-2.5 px-3 font-medium text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Sign Up</span>
                    </button>
                  </div>

                  {/* Continue as Guest */}
                  <button
                    onClick={onClose}
                    className="w-full mt-3 text-gray-400 hover:text-white transition-colors text-xs py-1.5 cursor-pointer"
                  >
                    Continue as guest
                  </button>
                </>
              ) : (
                /* Inline Email Auth Form */
                <form onSubmit={handleEmailAuth} className="flex flex-col gap-3">
                  {authMode === 'email_signup' && (
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-[#1a1613] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#1a1613] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#1a1613] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-1 bg-linear-to-r from-[#D4AF37] to-[#C5A059] text-[#1a1613] rounded-xl py-3 font-bold text-sm hover:brightness-110 transition shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? 'Processing...' : authMode === 'email_signup' ? 'Create Account' : 'Sign In'}
                  </button>

                  <div className="flex items-center justify-between mt-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setAuthMode(authMode === 'email_signup' ? 'email_login' : 'email_signup')}
                      className="text-[#D4AF37] hover:underline cursor-pointer"
                    >
                      {authMode === 'email_signup' ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode('options')}
                      className="text-gray-400 hover:text-white cursor-pointer"
                    >
                      ← Back
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    , document.body)
}