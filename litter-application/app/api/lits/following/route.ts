import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = createSupabaseServer()
  const searchParams = new URL(request.url).searchParams

  const currentUserID = searchParams.get('id')
  const page = parseInt(searchParams.get('page') || '0', 10)
  const size = parseInt(searchParams.get('size') || '10', 10)
  const startIndex = page * size

  if (!currentUserID) {
    console.log('currentUserID is required')
    return new NextResponse(JSON.stringify({ error: 'currentUserID is required' }), { status: 400 })
  }

  const { data: follows, error: followsError } = await supabase
    .from('follows')
    .select('followed_id')
    .eq('follower_id', currentUserID)
    .throwOnError()

  if (followsError || !follows) {
    console.error(followsError)
    return new NextResponse(JSON.stringify({ error: followsError?.message }), { status: 500 })
  }

  const followedIds = follows.map((follow) => follow.followed_id)

  if (followedIds.length === 0) {
    return NextResponse.json({ data: [], nextCursor: null })
  }

  const {
    data: lits,
    error: litsError,
    count,
  } = await supabase
    .from('lits')
    .select('*', { count: 'exact' })
    .in('user_id', followedIds)
    .order('created_at', { ascending: false })
    .range(startIndex, startIndex + size - 1)

  if (litsError) {
    console.error(litsError)
    return new NextResponse(JSON.stringify({ error: litsError.message }), { status: 500 })
  }

  const hasNextPage = startIndex + size < count!
  const nextCursor = hasNextPage ? startIndex + size : null

  return NextResponse.json({
    data: lits,
    nextCursor: nextCursor,
  })
}
