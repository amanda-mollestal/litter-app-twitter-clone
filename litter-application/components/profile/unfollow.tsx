'use client'
import { Button } from '@/components/ui/button'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'

export function UnfollowButton({
  currentUserID,
  profileUserID,
}: {
  currentUserID: string
  profileUserID: string
}) {
  const supabase = createSupabaseBrowser()
  const router = useRouter()
  const queryClient = useQueryClient()

  const handleUnfollow = async () => {
    try {
      const { error } = await supabase
        .from('follows')
        .delete()
        .match({ follower_id: currentUserID, followed_id: profileUserID })

      if (error) throw error

      router.refresh()
      queryClient.invalidateQueries()
    } catch (error: any) {
      console.error(error)
    }
  }

  return (
    <>
      <Button
        onClick={() => {
          handleUnfollow()
        }}
        className='bg-[#F6AE28] rounded-3xl w-24 text text-black'
      >
        Unfollow
      </Button>
    </>
  )
}
