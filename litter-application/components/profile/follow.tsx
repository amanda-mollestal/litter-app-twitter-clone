'use client'
import { Button } from '@/components/ui/button'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export function FollowButton({
  currentUserID,
  profileUserID,
}: {
  currentUserID: string
  profileUserID: string
}) {
  const supabase = createSupabaseBrowser()
  const router = useRouter()
  const queryClient = useQueryClient()

  const handleFollow = async () => {
    try {
      const { error } = await supabase.from('follows').insert([
        {
          follower_id: currentUserID,
          followed_id: profileUserID,
        },
      ])

      if (error) throw error

      router.refresh()
      queryClient.invalidateQueries()
    } catch (error: any) {
      console.log(error)
    }
  }

  return (
    <Button onClick={handleFollow} className='bg-[#F6AE28] rounded-3xl w-24 text-black'>
      Follow
    </Button>
  )
}
