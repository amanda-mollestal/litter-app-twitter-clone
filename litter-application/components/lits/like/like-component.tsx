import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PawPrint } from 'lucide-react'
import styles from './like-component.module.css'
import { createSupabaseBrowser } from '@/lib/supabase/client'

const supabase = createSupabaseBrowser()

type LikeData = {
  likeCount: number
  isLiked: boolean
}

export const LikeComponent = ({ session, id }: { session: any; id: string }) => {
  let userId = session?.user?.id

  const queryClient = useQueryClient()

  const { data: likeData, isLoading } = useQuery<LikeData>({
    queryKey: [`likeData-${id}`, id],
    queryFn: async () => {
      const { data: likes, error: likesError } = await supabase
        .from('likes')
        .select('*')
        .eq('target_id', id)

      if (likesError) throw new Error(likesError.message)

      const isLiked = likes.some((like) => like.user_id === userId)

      const likeCount = likes.length

      return {
        likeCount,
        isLiked,
      }
    },
  })

  if (!session) {
    return (
      <div className='flex flex-row'>
        <span className={`text-xs pt-1 mr-1 text-gray-400`} >
          {likeData?.likeCount ?? 0}
        </span>{' '}
        <PawPrint
          className={`${styles.icon} pt-0.5 mr-2 w-[18px] h-auto`}
        />
      </div>
    )
  }


  const toggleLike = useMutation({
    mutationFn: async () => {
      if (likeData?.isLiked) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .match({ target_id: id, user_id: userId })
        if (error) throw new Error(error.message)
      } else {
        const { error } = await supabase
          .from('likes')
          .insert([{ target_id: id, user_id: userId, type: 'lit' }])
        if (error) throw new Error(error.message)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`likeData-${id}`, id] })
    },
  })

  return (
    <div className='flex flex-row'>
      <span
        className={`text-xs pt-1 mr-1 ${likeData?.isLiked ? 'text-yellow-500' : 'text-gray-400'}`}
      >
        {likeData?.likeCount ?? 0}
      </span>{' '}
      <PawPrint
        className={`${styles.icon} ${likeData?.isLiked ? styles.liked : ''} pt-0.5 mr-2 w-[18px] h-auto`}
        onClick={() => toggleLike.mutate()}
      />
    </div>
  )
}
