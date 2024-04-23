import { createReadReplicaSupabaseBrowser } from '../supabase/client'
export const getFollowCounts = async (username: string) => {
  const supabase = createReadReplicaSupabaseBrowser()

  const { data: userProfile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single()

  if (profileError) throw profileError
  if (!userProfile) return false

  const profileUserID = userProfile.id

  const { data: followersData, error: followersError } = await supabase
    .from('follows')
    .select('*', { count: 'exact' })
    .eq('followed_id', profileUserID)

  const { data: followingData, error: followingError } = await supabase
    .from('follows')
    .select('*', { count: 'exact' })
    .eq('follower_id', profileUserID)

  if (followersError || followingError) {
    console.error('Error fetching follow counts:', followersError || followingError)
    return { followers: 0, following: 0 }
  }

  return {
    followers: followersData.length,
    following: followingData.length,
  }
}
