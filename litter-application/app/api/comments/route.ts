import { createSupabaseServer } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createSupabaseServer()

  const searchParams = new URL(request.url).searchParams
  const litId = searchParams.get('id')
  const page = parseInt(searchParams.get('page') || '0', 10)
  const size = parseInt(searchParams.get('size') || '10', 10)

  const startIndex = page * size

  const { data, error, count } = await supabase
    .from('comments')
    .select('*', { count: 'exact' })
    .eq('parent_lit_id', litId)
    .order('created_at', { ascending: false })
    .range(startIndex, startIndex + size - 1)

  if (error) {
    return NextResponse.json({ error: error.message })
  }

  const hasNextPage = startIndex + size < count!
  const nextCursor = hasNextPage ? page + 1 : null

  return NextResponse.json({
    data: data,
    nextCursor: nextCursor,
  })
}
