'use client'

import React, { useEffect, useRef } from 'react'
import { createReadReplicaSupabaseBrowser } from '@/lib/supabase/client'
import { useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { CommentComponent } from './comment-component'
import { Comment } from '@/lib/types'
import { LoadingSpinner } from '../../ui/spinner'
import { InfiniteData } from '@tanstack/react-query'

export default function CommentFeed({ litId, session }: { litId: string; session: any }) {
  const supabase = createReadReplicaSupabaseBrowser()
  const queryClient = useQueryClient()
  const pageSize = 10
  const id = litId

  const fetchComments = async ({ pageParam = 0 }: { pageParam?: number; litId: string }) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_LITTER_URL}/api/comments/?id=${id}&page=${pageParam}&size=${pageSize}`
    )
    return res.json()
  }

  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [`comments-${litId}`, litId],
      queryFn: ({ pageParam }) => fetchComments({ pageParam, litId }),
      getNextPageParam: (lastPage) => {
        return lastPage.nextCursor !== null ? lastPage.nextCursor : undefined
      },
      initialPageParam: 0,
    })

  const loadMoreRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      {
        rootMargin: '200px',
      }
    )
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }
    return () => observer.disconnect()
  }, [hasNextPage, fetchNextPage, isFetchingNextPage])

  useEffect(() => {
    const channel = supabase
      .channel(`realtime-comments:${litId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `parent_lit_id=eq.${litId}`,
        },
        (payload) => {
          if (payload.new && payload.new.parent_lit_id === litId) {
            const comment = {
              id: payload.new.id,
              user_id: payload.new.user_id,
              username: payload.new.username,
              full_name: payload.new.full_name,
              avatar_url: payload.new.avatar_url,
              content: payload.new.content,
              created_at: payload.new.created_at,
              like_count: payload.new.like_count,
              parent_lit_id: payload.new.parent_lit_id,
            } as Comment

            queryClient.setQueryData<InfiniteData<Array<Comment>>>(
              [`comments-${litId}`, litId],
              (prevComments: any) => {
                if (!prevComments) return prevComments

                const updatedFirstPageData = [comment, ...prevComments.pages[0].data]
                // updatedFirstPageData.pop()

                const updatedPages = prevComments.pages.map((page: any, pageIndex: number) =>
                  pageIndex === 0 ? { ...page, data: updatedFirstPageData } : page
                )

                return {
                  ...prevComments,
                  pages: updatedPages,
                }
              }
            )
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [supabase, queryClient, litId])

  return status === 'pending' ? (
    <div className='flex justify-center items-center mt-16'>
      <LoadingSpinner className='' />
    </div>
  ) : status === 'error' ? (
    <p>Error: {error.message}</p>
  ) : (
    <>
      <div className='flex flex-col items-center pt-4 '>
        {data?.pages?.map((group, i) => (
          <React.Fragment key={i}>
            {group?.data?.map((comment: Comment) => (
              <CommentComponent session={session} key={comment.id} comment={comment} />
            ))}
          </React.Fragment>
        ))}
        <div ref={loadMoreRef} style={{ height: '20px' }}></div>
      </div>
      {isFetching && !isFetchingNextPage && (
        <div className='flex justify-center items-center mt-5'>
          <LoadingSpinner className='' />
        </div>
      )}
    </>
  )
}
