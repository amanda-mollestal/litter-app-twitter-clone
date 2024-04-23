import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/lib/types/supabase'
import type { TypedSupabaseClient } from '@/lib/types/supabase'

let client: TypedSupabaseClient | undefined


export const createSupabaseBrowser = () => {
  if (client) {
    return client
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL! as string
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! as string

  return createBrowserClient<Database>(
    url,
    key,
  );
}

export const createReadReplicaSupabaseBrowser = () => {
  if (client) {
    return client
  }

  const url = process.env.NEXT_PUBLIC_READ_REPLICA_SUPABASE_URL! as string
  const key = process.env.NEXT_PUBLIC_READ_REPLICA_SUPABASE_ANON_KEY! as string

  return createBrowserClient<Database>(
    url,
    key,
  );
}
