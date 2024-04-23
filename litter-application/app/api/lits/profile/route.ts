import { createSupabaseServer } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createSupabaseServer()
  const url = new URL(request.url)
  const { searchParams } = url

  const username = searchParams.get('profile')

  const page = parseInt(searchParams.get('page') || '0', 10)
  const size = parseInt(searchParams.get('size') || '10', 10)

  const startIndex = page * size

  const { data, error, count } = await supabase
    .from('lits')
    .select('*', { count: 'exact' })
    .eq('username', username!)
    .order('created_at', { ascending: false })
    .range(startIndex, startIndex + size - 1)

  const hasNextPage = startIndex + size < count!
  const nextCursor = hasNextPage ? startIndex + size : null

  return NextResponse.json({
    data: data,
    nextCursor: nextCursor ? nextCursor : null,
  })
}
