'use client'

import { getProfileByUsername } from '@/lib/queries/get-profile'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import ProfileFeed from './profile-feed'
import { ProfileHeader, UserProfile } from './profile-header'

const Profile = ({
  profileUsername,
  currentUserID,
  session,
}: {
  profileUsername: string
  currentUserID: string
  session: any
}) => {
  const supabase = createSupabaseBrowser()
  const { data: profile } = useQuery(getProfileByUsername(supabase, profileUsername))

  return (
    <div>
      <ProfileHeader profile={profile as UserProfile} currentUserID={currentUserID} />
      <ProfileFeed session={session} username={profileUsername} />
    </div>
  )
}

export default Profile
