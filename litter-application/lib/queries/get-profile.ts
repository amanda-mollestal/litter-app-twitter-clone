import { TypedSupabaseClient } from '@/lib/types/supabase'

export function getProfileByUsername(client: TypedSupabaseClient, username: string) {
  return client.from('profiles').select('*').eq('username', username).throwOnError().single()
}
