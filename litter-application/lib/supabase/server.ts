import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/lib/types/supabase'

export const createSupabaseServer = () => {
  const cookieStore = cookies()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL! as string
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! as string

  return createServerClient<Database>(url, key, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      }
    },
  })
}



export const createReadReplicaSupabaseServer = () => {
  const cookieStore = cookies()
  const url = process.env.NEXT_PUBLIC_READ_REPLICA_SUPABASE_URL! as string
  const key = process.env.NEXT_PUBLIC_READ_REPLICA_SUPABASE_ANON_KEY! as string

  return createServerClient<Database>(url, key, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      }
    },
  })
}
