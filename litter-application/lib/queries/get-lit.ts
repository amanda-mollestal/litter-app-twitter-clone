import { TypedSupabaseClient } from '@/lib/types/supabase'

export function getLitById(client: TypedSupabaseClient, id: string) {
  return client.from('lits').select('*').eq('id', id).throwOnError().single()
}
