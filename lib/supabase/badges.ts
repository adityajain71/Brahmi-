import { getSupabaseBrowserClient } from './client'

export type UserBadgeRecord = {
  id?: number
  user_id: string
  badge_id: string
  badge_name: string
  module_id?: string | null
  unlocked_at?: string
}

export async function fetchUserBadges(userId: string): Promise<UserBadgeRecord[]> {
  const supabase = getSupabaseBrowserClient()
  if (!supabase || !userId) return []

  const { data, error } = await (supabase.from('user_badges') as any)
    .select('id, user_id, badge_id, badge_name, module_id, unlocked_at')
    .eq('user_id', userId)

  if (error) {
    console.warn('Failed to load user badges:', error.message)
    return []
  }

  return (data as UserBadgeRecord[]) || []
}

export async function saveUserBadge(
  userId: string,
  badgeId: string,
  badgeName: string,
  moduleId?: string
): Promise<boolean> {
  const supabase = getSupabaseBrowserClient()
  if (!supabase || !userId) return false

  const payload = {
    user_id: userId,
    badge_id: badgeId,
    badge_name: badgeName,
    module_id: moduleId || null,
    unlocked_at: new Date().toISOString(),
  }

  const { error } = await (supabase.from('user_badges') as any)
    .upsert(payload, { onConflict: 'user_id,badge_id' })

  if (error) {
    console.warn('Failed to save user badge:', error.message)
    return false
  }

  return true
}
