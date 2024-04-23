import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { prefetchQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { createSupabaseServer } from '@/lib/supabase/server'
import { getLitById } from '@/lib/queries/get-lit'
import { LitWrapper } from '@/components/lits/lit-wrapper'
import { CreateComment } from '@/components/lits/comment/create-comment'
import { User } from '@supabase/supabase-js'
import CommentFeed from '@/components/lits/comment/comment-feed'

export default async function Page({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient()
  const supabase = createSupabaseServer()

  await prefetchQuery(queryClient, getLitById(supabase, params.id))
  const { data } = await supabase.auth.getSession()
  let user: User | undefined
  const session = data?.session

  if (data?.session?.user) {
    user = data.session.user
  }

  return (
    <div className='w-full flex flex-col justify-center items-center'>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <LitWrapper id={params.id} session={session} />
        {user && <CreateComment litId={params.id} user={user} />}
        <CommentFeed litId={params.id} session={session} />
      </HydrationBoundary>
    </div>
  )
}
