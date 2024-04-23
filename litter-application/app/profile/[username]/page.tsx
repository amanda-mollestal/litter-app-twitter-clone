import Profile from '@/components/profile/profile'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { prefetchQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { createSupabaseServer } from '@/lib/supabase/server'
import { getProfileByUsername } from '@/lib/queries/get-profile'
import { User } from '@supabase/supabase-js'
import { checkIfUserFollows } from '@/lib/queries/check-follow'
import { getFollowCounts } from '@/lib/queries/get-follow-counts'

export default async function Page({ params }: { params: { username: string } }) {
  const queryClient = new QueryClient()
  const supabase = createSupabaseServer()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  let user: User | undefined

  if (session?.user !== null) {
    user = session?.user
  }

  const profileUsername = params.username

  await prefetchQuery(queryClient, getProfileByUsername(supabase, profileUsername))

  if (user?.id) {
    await queryClient.prefetchQuery({
      queryKey: ['followStatus', user?.id, profileUsername],
      queryFn: () => checkIfUserFollows(user?.id ?? '', profileUsername),
    })
  }

  await queryClient.prefetchQuery({
    queryKey: [`${profileUsername}-followCounts`, profileUsername],
    queryFn: () => getFollowCounts(profileUsername),
  })

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Profile
          session={session}
          profileUsername={profileUsername}
          currentUserID={user ? user.id : ''}
        />
      </HydrationBoundary>
    </div>
  )
}
