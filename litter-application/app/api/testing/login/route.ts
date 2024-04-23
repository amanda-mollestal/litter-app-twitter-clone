import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { CookieOptions } from '@supabase/ssr'

export async function GET(request: Request) {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // get(name: string) {
        //   return cookieStore.get(name)?.value
        // },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        // remove(name: string, options: CookieOptions) {
        //   cookieStore.set({ name, value: '', ...options })
        // },
      },
    }
  )

  const email = process.env.NEXT_PUBLIC_TEST_EMAIL as string
  const password = process.env.NEXT_PUBLIC_TEST_PASSWORD as string

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  })

  if (error) {
    console.error('Failed to login', error.message)
  }

  return NextResponse.redirect(process.env.NEXT_PUBLIC_LITTER_URL!)
}
