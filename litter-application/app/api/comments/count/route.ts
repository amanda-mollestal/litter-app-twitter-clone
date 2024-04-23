import { createSupabaseServer } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createSupabaseServer()

  const searchParams = new URL(request.url).searchParams
  const litId = searchParams.get('id')

  const { error, count } = await supabase
    .from('comments')
    .select('*', { count: 'exact' })
    .eq('parent_lit_id', litId)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message })
  }

  return NextResponse.json({
    count: count || 0,
  })
}
