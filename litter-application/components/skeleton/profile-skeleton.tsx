import { ProfileHeaderSkeleton } from './profile-header-skeleton'
import { SkeletonFeed } from './skeleton-feed'

export function ProfileSkeleton() {
  return (
    <div className=''>
      <ProfileHeaderSkeleton />
      <SkeletonFeed />
    </div>
  )
}
