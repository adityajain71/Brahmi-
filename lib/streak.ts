import { fetchUserStreak, syncUserStreak } from './supabase/streaks'

export type StreakData = {
    currentStreak: number
    longestStreak: number
    lastLoginDate: string | null
    isNewStreak: boolean
}

/**
 * Check and update user's login streak
 */
export async function updateLoginStreak(userId: string): Promise<StreakData> {
    if (!userId) {
        return {
            currentStreak: 0,
            longestStreak: 0,
            lastLoginDate: null,
            isNewStreak: false
        }
    }
    return await syncUserStreak(userId)
}

/**
 * Get user's streak data without updating
 */
export async function getLoginStreak(userId: string): Promise<StreakData> {
    if (!userId) {
        return {
            currentStreak: 0,
            longestStreak: 0,
            lastLoginDate: null,
            isNewStreak: false
        }
    }
    return await fetchUserStreak(userId)
}
