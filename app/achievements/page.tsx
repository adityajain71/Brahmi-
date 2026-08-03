'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Award, Lock, CheckCircle2, Sparkles, Flame, BookOpen } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { fetchUserBadges, type UserBadgeRecord } from '@/lib/supabase/badges'
import { loadAccountLessonProgress } from '@/lib/supabase/lessonProgress'
import { fetchUserStreak } from '@/lib/supabase/streaks'

export type AchievementDefinition = {
  id: string
  name: string
  titleDevanagari: string
  description: string
  icon: string
  moduleId: string
  totalRequired: number
}

const ALL_ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'wise_one',
    name: 'Wise One',
    titleDevanagari: 'ज्ञानवान',
    description: 'Complete your first Swar (Vowel) lesson.',
    icon: '✦',
    moduleId: 'module-swar',
    totalRequired: 1,
  },
  {
    id: 'samyak_pragya',
    name: 'Samyak Pragya',
    titleDevanagari: 'सम्यक् प्रज्ञा',
    description: 'Master all 12 Swar (Vowels) of Brahmi Script.',
    icon: 'अ',
    moduleId: 'module-swar',
    totalRequired: 12,
  },
  {
    id: 'script_master',
    name: 'Script Master',
    titleDevanagari: 'लिपि शिरोमणि',
    description: 'Complete 5 Vyanjan (Consonant) lessons.',
    icon: 'क',
    moduleId: 'module-vyanjan',
    totalRequired: 5,
  },
  {
    id: 'dedicated_scholar',
    name: 'Dedicated Scholar',
    titleDevanagari: 'निष्ठावान्',
    description: 'Maintain a 3-day daily learning streak.',
    icon: '🔥',
    moduleId: 'streak',
    totalRequired: 3,
  },
  {
    id: 'prakrit_pioneer',
    name: 'Prakrit Pioneer',
    titleDevanagari: 'प्राकृत साधक',
    description: 'Complete all 33 Vyanjan (Consonant) lessons.',
    icon: '𑀕',
    moduleId: 'module-vyanjan',
    totalRequired: 33,
  },
  {
    id: 'brahmi_scholar',
    name: 'Brahmi Scholar',
    titleDevanagari: 'ब्राह्मी विद्वान्',
    description: 'Complete all Matra (Vowel Sign) lessons.',
    icon: 'का',
    moduleId: 'module-matra',
    totalRequired: 11,
  },
]

export default function AchievementsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [unlockedBadges, setUnlockedBadges] = useState<Record<string, UserBadgeRecord>>({})
  const [progressMetrics, setProgressMetrics] = useState({
    swarCompleted: 0,
    vyanjanCompleted: 0,
    matraCompleted: 0,
    currentStreak: 0,
  })

  useEffect(() => {
    async function loadAchievementsData() {
      try {
        const supabase = getSupabaseBrowserClient()
        if (!supabase) {
          setLoading(false)
          return
        }

        const { data: authData } = await supabase.auth.getUser()
        const user = authData.user

        if (!user) {
          router.push('/login?next=/achievements')
          return
        }

        // Fetch badges & user metrics
        const [badges, streak, swarProg, vyanjanProg, matraProg] = await Promise.all([
          fetchUserBadges(user.id),
          fetchUserStreak(user.id),
          loadAccountLessonProgress('module-swar', user.id),
          loadAccountLessonProgress('module-vyanjan', user.id),
          loadAccountLessonProgress('module-matra', user.id),
        ])

        const badgeMap: Record<string, UserBadgeRecord> = {}
        badges.forEach((b) => {
          badgeMap[b.badge_id] = b
        })

        setUnlockedBadges(badgeMap)

        setProgressMetrics({
          swarCompleted: Object.values(swarProg).filter((p) => p.status === 'completed').length,
          vyanjanCompleted: Object.values(vyanjanProg).filter((p) => p.status === 'completed').length,
          matraCompleted: Object.values(matraProg).filter((p) => p.status === 'completed').length,
          currentStreak: streak.currentStreak,
        })
      } catch (err) {
        console.error('Error loading achievements:', err)
      } finally {
        setLoading(false)
      }
    }

    loadAchievementsData()
  }, [router])

  const getProgressForAchievement = (ach: AchievementDefinition): { current: number; total: number; percent: number } => {
    let current = 0
    if (ach.id === 'wise_one' || ach.id === 'samyak_pragya') {
      current = progressMetrics.swarCompleted
    } else if (ach.id === 'script_master' || ach.id === 'prakrit_pioneer') {
      current = progressMetrics.vyanjanCompleted
    } else if (ach.id === 'brahmi_scholar') {
      current = progressMetrics.matraCompleted
    } else if (ach.id === 'dedicated_scholar') {
      current = progressMetrics.currentStreak
    }

    const total = ach.totalRequired
    const percent = Math.min(100, Math.round((current / total) * 100))
    return { current, total, percent }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1C1C1C] text-[#D4AF37]">
        <div className="flex flex-col items-center gap-3">
          <div className="text-3xl animate-pulse">✦</div>
          <p className="text-sm font-medium text-[#E6D8B8]/70">Loading achievements...</p>
        </div>
      </div>
    )
  }

  const unlockedCount = Object.keys(unlockedBadges).length

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
        <h1 className="text-lg font-serif font-bold text-[#F5F1E8]">Achievements & Badges</h1>
        <div className="text-xs font-bold text-[#D4AF37] flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{unlockedCount} / {ALL_ACHIEVEMENTS.length}</span>
        </div>
      </div>

      <div className="w-full max-w-3xl px-4 mt-6 flex flex-col gap-6">
        {/* Banner */}
        <div className="bg-linear-to-r from-[#2a2420] via-[#1a1613] to-[#2a2420] border border-[#D4AF37]/30 rounded-3xl p-6 shadow-2xl flex items-center justify-between">
          <div>
            <div className="text-[#E69A47] font-bold text-xs uppercase tracking-widest mb-1">Scholar Badges</div>
            <h2 className="text-2xl font-bold font-serif text-[#D4AF37]">Brahmi Achievements</h2>
            <p className="text-sm text-gray-400 mt-1 max-w-md">
              Complete lessons, maintain practice streaks, and master the script to unlock ancient honors.
            </p>
          </div>
          <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center text-3xl text-[#D4AF37] shadow-lg shrink-0">
            🏆
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ALL_ACHIEVEMENTS.map((ach, idx) => {
            const isUnlocked = Boolean(unlockedBadges[ach.id])
            const badgeRecord = unlockedBadges[ach.id]
            const progress = getProgressForAchievement(ach)

            return (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-linear-to-br from-[#2a2420] to-[#1a1613] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                    : 'bg-[#1a1613]/60 border-white/10 opacity-80'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Badge Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center font-serif text-2xl font-bold shrink-0 border ${
                      isUnlocked
                        ? 'bg-linear-to-br from-[#D4AF37] to-[#C5A059] text-[#1a1613] border-[#D4AF37] shadow-md'
                        : 'bg-[#2a2420] text-gray-500 border-white/10'
                    }`}
                  >
                    {ach.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-bold font-serif text-base ${isUnlocked ? 'text-[#D4AF37]' : 'text-gray-300'}`}>
                        {ach.name} <span className="text-xs font-normal text-[#E69A47] ml-1">({ach.titleDevanagari})</span>
                      </h3>
                      {isUnlocked ? (
                        <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      ) : (
                        <Lock className="w-4 h-4 text-gray-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">{ach.description}</p>
                  </div>
                </div>

                {/* Progress / Unlocked Status Footer */}
                <div className="mt-4 pt-3 border-t border-white/5">
                  {isUnlocked ? (
                    <div className="text-[11px] text-[#D4AF37] font-medium flex items-center justify-between">
                      <span>✓ Unlocked Achievement</span>
                      {badgeRecord?.unlocked_at && (
                        <span className="text-gray-500">
                          {new Date(badgeRecord.unlocked_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{progress.current} / {progress.total}</span>
                      </div>
                      <div className="w-full bg-[#2a2420] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-linear-to-r from-[#D4AF37] to-[#E69A47] h-full rounded-full transition-all duration-500"
                          style={{ width: `${progress.percent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
