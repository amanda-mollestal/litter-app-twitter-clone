'use client'
import React, { useEffect, useRef } from 'react'
import { createReadReplicaSupabaseBrowser } from '@/lib/supabase/client'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { LitComponent } from '../lits/lit-component'
import { Lit } from '@/lib/types'
import { InfiniteData } from '@tanstack/react-query'
import { SkeletonFeed } from '../skeleton/skeleton-feed'

export default function ProfileFeed({ username, session }: { username: string; session: any }) {
  const supabase = createReadReplicaSupabaseBrowser()
  const queryClient = useQueryClient()
  const pageSize = 10
  const profile = username

  const fetchLits = async ({ pageParam }: { pageParam: any }) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_LITTER_URL}/api/lits/profile/?profile=${profile}&page=${pageParam}&size=${pageSize}`
    )
    return res.json()
  }

  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [`${username}-lits`, username],
      queryFn: fetchLits,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.nextCursor !== null ? lastPage.nextCursor / pageSize : undefined
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
      .channel(`${username}-lits`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'lits',
          filter: `username=eq.${username}`,
        },
        (payload) => {
          const lit = {
            id: payload.new.id,
            user_id: payload.new.user_id,
            username: payload.new.username,
            full_name: payload.new.full_name,
            avatar_url: payload.new.avatar_url,
            content: payload.new.content,
            created_at: payload.new.created_at,
            comment_count: payload.new.comment_count,
          } as Lit

          queryClient.setQueryData<InfiniteData<Array<Lit>>>(
            [`${username}-lits`, username],
            (prevLits: any) => {
              if (!prevLits) return prevLits

              const updatedFirstPageData = [lit, ...prevLits.pages[0].data]
              updatedFirstPageData.pop()

              const updatedPages = prevLits.pages.map((page: any, pageIndex: any) =>
                pageIndex === 0 ? { ...page, data: updatedFirstPageData } : page
              )

              return {
                ...prevLits,
                pages: updatedPages,
              }
            }
          )
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [supabase, queryClient])

  return (
    <div className='w-full'>
      <div className='flex flex-col w-full items-center'>
        {data?.pages?.map((group, i) => (
          <React.Fragment key={i}>
            {group.data.map((lit: Lit) => (
              <LitComponent session={session} key={lit.id} lit={lit} />
            ))}
          </React.Fragment>
        ))}

        <div ref={loadMoreRef} style={{ height: '1px' }}></div>
      </div>
      {isFetching && !isFetchingNextPage && data?.pages === undefined && (
        <div className='flex justify-center items-center  w-full'>
          <SkeletonFeed />
        </div>
      )}
    </div>
  )
}
