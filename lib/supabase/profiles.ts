import type { User } from '@supabase/supabase-js'
import { getSupabaseBrowserClient } from './client'

export type AppUserProfile = {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  provider: string | null
  preferred_language?: string | null
  daily_goal_minutes?: number | null
  last_sign_in_at: string | null
  updated_at: string
}

function pickName(user: User): string | null {
  const metadata = user.user_metadata || {}
  return metadata.full_name || metadata.name || metadata.display_name || null
}

function pickAvatar(user: User): string | null {
  const metadata = user.user_metadata || {}
  return metadata.avatar_url || metadata.picture || metadata.avatar || metadata.image || null
}

export async function fetchUserProfile(userId: string): Promise<AppUserProfile | null> {
  const supabase = getSupabaseBrowserClient()
  if (!supabase || !userId) return null

  const { data, error } = await (supabase.from('profiles') as any)
    .select('id, email, full_name, avatar_url, provider, preferred_language, daily_goal_minutes, last_sign_in_at, updated_at')
    .eq('id', userId)
    .maybeSingle()

  if (error || !data) return null
  return data as AppUserProfile
}

export async function upsertUserProfile(user: User): Promise<boolean> {
  const supabase = getSupabaseBrowserClient()
  if (!supabase) {
    return false
  }
  const provider = user.app_metadata?.provider || user.identities?.[0]?.provider || null

  const profile: AppUserProfile = {
    id: user.id,
    email: user.email || null,
    full_name: pickName(user),
    avatar_url: pickAvatar(user),
    provider,
    last_sign_in_at: user.last_sign_in_at || user.created_at || null,
    updated_at: new Date().toISOString()
  }

  const profilesTable = supabase.from('profiles') as any
  const { error } = await profilesTable.upsert(profile, { onConflict: 'id' })

  if (error) {
    console.warn('Failed to upsert user profile:', {
      message: error?.message || 'Unknown Supabase error',
      code: error?.code || null,
      details: error?.details || null,
      hint: error?.hint || null,
    })
    return false
  }

  return true
}

export async function updateUserProfileSettings(
  userId: string,
  settings: { preferred_language?: string; daily_goal_minutes?: number; full_name?: string }
): Promise<boolean> {
  const supabase = getSupabaseBrowserClient()
  if (!supabase || !userId) return false

  const payload: Record<string, any> = {
    updated_at: new Date().toISOString()
  }

  if (settings.preferred_language !== undefined) payload.preferred_language = settings.preferred_language
  if (settings.daily_goal_minutes !== undefined) payload.daily_goal_minutes = settings.daily_goal_minutes
  if (settings.full_name !== undefined) payload.full_name = settings.full_name

  const { error } = await (supabase.from('profiles') as any)
    .update(payload)
    .eq('id', userId)

  if (error) {
    console.warn('Failed to update user profile settings:', error.message)
    return false
  }

  return true
}
