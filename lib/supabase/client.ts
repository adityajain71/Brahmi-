import { createClient } from '@supabase/supabase-js'

const DEFAULT_SUPABASE_URL = 'https://qtnyyxgkxjbfzdtslukw.supabase.co'
const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0bnl5eGdreGpiZnpkdHNsdWt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3MzU4MjMsImV4cCI6MjEwMTMxMTgyM30.hLudAWDIIXv61JvNxS9TzAoBzi-YyrguKGtYCzIJiSM'

let browserClient: ReturnType<typeof createClient> | null = null

export function getSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || DEFAULT_SUPABASE_KEY

  if (!supabaseUrl || !supabaseKey) {
    return null
  }

  if (!browserClient) {
    browserClient = createClient(supabaseUrl, supabaseKey)
  }

  return browserClient
}
