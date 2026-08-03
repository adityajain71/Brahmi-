'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Globe, Award, Flame, BookOpen, Clock, LogOut, Check } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { fetchUserProfile, updateUserProfileSettings, type AppUserProfile } from '@/lib/supabase/profiles'
import { fetchUserStreak } from '@/lib/supabase/streaks'
import { fetchUserBadges } from '@/lib/supabase/badges'
import { loadAccountLessonProgress } from '@/lib/supabase/lessonProgress'
import { useLanguage } from '@/lib/LanguageContext'
import { getAvatarUrl } from '@/lib/getAvatarUrl'

export default function ProfilePage() {
  const router = useRouter()
  const { language, setLanguage, t } = useLanguage()

  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<AppUserProfile | null>(null)
  const [avatar, setAvatar] = useState<string | null>(null)
  const [stats, setStats] = useState({
    completedLessons: 0,
    currentStreak: 0,
    longestStreak: 0,
    unlockedBadges: 0,
  })
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const [dailyGoal, setDailyGoal] = useState<number>(10)

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = getSupabaseBrowserClient()
        if (!supabase) {
          setLoading(false)
          return
        }

        const { data: authData } = await supabase.auth.getUser()
        const user = authData.user

        if (!user) {
          router.push('/login?next=/profile')
          return
        }

        // Load profile from DB
        const userProfile = await fetchUserProfile(user.id)
        setProfile(userProfile)
        setAvatar(getAvatarUrl(user))
        if (userProfile?.daily_goal_minutes) {
          setDailyGoal(userProfile.daily_goal_minutes)
        }

        // Load statistics
        const [streakData, badgesData, progressData] = await Promise.all([
          fetchUserStreak(user.id),
          fetchUserBadges(user.id),
          loadAccountLessonProgress('module-swar', user.id)
        ])

        const completedCount = Object.values(progressData).filter(p => p.status === 'completed').length

        setStats({
          completedLessons: completedCount,
          currentStreak: streakData.currentStreak,
          longestStreak: streakData.longestStreak,
          unlockedBadges: badgesData.length,
        })
      } catch (err) {
        console.error('Error loading profile page data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const handleLanguageChange = async (newLang: 'hi' | 'en' | 'kn' | 'ta') => {
    setLanguage(newLang)
    if (profile?.id) {
      await updateUserProfileSettings(profile.id, { preferred_language: newLang })
    }
  }

  const handleDailyGoalChange = async (goalMins: number) => {
    setDailyGoal(goalMins)
    if (profile?.id) {
      setSaving(true)
      await updateUserProfileSettings(profile.id, { daily_goal_minutes: goalMins })
      setSaving(false)
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 2000)
    }
  }

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient()
    if (supabase) {
      await supabase.auth.signOut()
    }
    router.push('/')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1C1C1C] text-[#D4AF37]">
        <div className="flex flex-col items-center gap-3">
          <div className="text-3xl animate-pulse">✦</div>
          <p className="text-sm font-medium text-[#E6D8B8]/70">Loading profile...</p>
        </div>
      </div>
    )
  }

  const displayName = profile?.full_name || profile?.email?.split('@')[0] || 'Scholar'
  const initials = displayName.substring(0, 2).toUpperCase()

  return (
    <div className="min-h-screen w-full bg-[#1C1C1C] text-[#F5F1E8] flex flex-col items-center relative font-sans pb-16">
      {/* Header */}
      <div className="w-full border-b border-[#D4AF37]/20 py-4 px-6 bg-[#1C1C1C]/95 backdrop-blur-sm sticky top-0 z-50 flex items-center justify-between">
        <button
          onClick={() => router.push('/learn')}
          className="text-[#D4AF37] hover:text-[#E69A47] transition-colors text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
        <h1 className="text-lg font-serif font-bold text-[#F5F1E8]">My Profile</h1>
        <button
          onClick={handleSignOut}
          className="text-gray-400 hover:text-red-400 transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>

      <div className="w-full max-w-2xl px-4 mt-6 flex flex-col gap-6">
        {/* User Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-linear-to-br from-[#2a2420] to-[#1a1613] border border-[#D4AF37]/30 rounded-3xl p-6 shadow-2xl flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left"
        >
          {avatar ? (
            <Image
              src={avatar}
              alt={displayName}
              width={80}
              height={80}
              className="w-20 h-20 rounded-full border-2 border-[#D4AF37] object-cover shadow-lg"
              unoptimized
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-[#D4AF37] to-[#C5A059] text-[#1a1613] flex items-center justify-center font-bold text-2xl border-2 border-[#D4AF37] shadow-lg">
              {initials}
            </div>
          )}

          <div className="flex-1">
            <h2 className="text-2xl font-bold font-serif text-[#F5F1E8]">{displayName}</h2>
            <p className="text-sm text-gray-400 mt-0.5">{profile?.email || 'Authenticated User'}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold">
              <span>✦ Brahmi Script Scholar</span>
            </div>
          </div>

          <Link
            href="/achievements"
            className="bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] rounded-xl px-4 py-2.5 text-xs font-bold flex items-center gap-2 transition cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>Badges</span>
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          <div className="bg-[#2a2420]/80 border border-[#D4AF37]/20 rounded-2xl p-4 text-center">
            <BookOpen className="w-5 h-5 text-[#D4AF37] mx-auto mb-1" />
            <div className="text-2xl font-bold text-white font-serif">{stats.completedLessons}</div>
            <div className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold mt-0.5">Lessons Done</div>
          </div>

          <div className="bg-[#2a2420]/80 border border-[#D4AF37]/20 rounded-2xl p-4 text-center">
            <Flame className="w-5 h-5 text-[#E69A47] mx-auto mb-1" />
            <div className="text-2xl font-bold text-white font-serif">{stats.currentStreak} Days</div>
            <div className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold mt-0.5">Current Streak</div>
          </div>

          <div className="bg-[#2a2420]/80 border border-[#D4AF37]/20 rounded-2xl p-4 text-center">
            <Flame className="w-5 h-5 text-[#D4AF37] mx-auto mb-1 opacity-70" />
            <div className="text-2xl font-bold text-white font-serif">{stats.longestStreak} Days</div>
            <div className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold mt-0.5">Longest Record</div>
          </div>

          <Link href="/achievements" className="bg-[#2a2420]/80 border border-[#D4AF37]/20 hover:border-[#D4AF37] rounded-2xl p-4 text-center transition cursor-pointer">
            <Award className="w-5 h-5 text-[#D4AF37] mx-auto mb-1" />
            <div className="text-2xl font-bold text-white font-serif">{stats.unlockedBadges}</div>
            <div className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold mt-0.5">Badges Unlocked</div>
          </Link>
        </motion.div>

        {/* Preferences Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-[#2a2420]/90 border border-[#D4AF37]/30 rounded-3xl p-6 shadow-xl flex flex-col gap-6"
        >
          <h3 className="text-lg font-bold text-[#D4AF37] font-serif flex items-center gap-2">
            <Globe className="w-5 h-5" />
            <span>Learning Preferences</span>
          </h3>

          {/* Preferred Language */}
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
              Preferred Language
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { code: 'hi', name: 'Hindi (हिन्दी)' },
                { code: 'en', name: 'English' },
                { code: 'kn', name: 'Kannada (ಕನ್ನಡ)' },
                { code: 'ta', name: 'Tamil (தமிழ்)' },
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code as any)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                    language === lang.code
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                      : 'bg-[#1a1613] border-white/10 text-gray-400 hover:border-[#D4AF37]/40 hover:text-white'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Goal */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                <span>Daily Practice Goal</span>
              </label>
              {savedSuccess && (
                <span className="text-xs text-green-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Saved to Supabase
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 20].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleDailyGoalChange(mins)}
                  disabled={saving}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                    dailyGoal === mins
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                      : 'bg-[#1a1613] border-white/10 text-gray-400 hover:border-[#D4AF37]/40 hover:text-white'
                  }`}
                >
                  {mins} Mins/Day
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
