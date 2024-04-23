import { AvatarImage, AvatarFallback, Avatar } from '@/components/ui/avatar'
import Link from 'next/link'
import { Lit } from '@/lib/types'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { MessageCircle } from 'lucide-react'
import styles from './lit-component.module.css'
import { formatDistanceToNow, format, intlFormatDistance } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import { LikeComponent } from './like/like-component'
import { createReadReplicaSupabaseBrowser } from '@/lib/supabase/client'

const isMobile = () => (typeof window !== 'undefined' ? window.innerWidth < 640 : false)

const timeAgo = (date: string | number | Date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

const timeAgoMobile = (date: string | number | Date) => {
  const now = new Date()
  const dateToCompare = new Date(date)

  return intlFormatDistance(dateToCompare, now)
}

const formattedDate = (date: string | number | Date) => format(new Date(date), 'HH:mm dd/MM/yyyy')

export const LitComponent = ({ lit, session }: { lit: Lit; session: any }) => {
  const supabase = createReadReplicaSupabaseBrowser()

  const { data: commentCount } = useQuery({
    queryKey: [`commentCount-${lit.id}`, lit.id],
    queryFn: async () => {
      const { count } = await supabase
        .from('comments')
        .select('*', { count: 'exact' })
        .eq('parent_lit_id', lit.id)

      return count
    },
  })

  return (
    <div className='p-2  sm:p-4 text-white w-full mx-auto'>
      <div className='pr-2 pl-2 sm:pr-6 sm:pl-6 flex flex-row w-full'>
        <Link className='hover:cursor-pointer' href={`/profile/${lit?.username}`}>
          <Avatar className='h-10 w-10 sm:h-12 sm:w-12 mt-auto mb-auto'>
            <AvatarImage alt={`@${lit?.username}`} src={lit?.avatar_url!} />
            <AvatarFallback>{lit?.full_name ? lit?.full_name.charAt(0) : 'U'}</AvatarFallback>
          </Avatar>
        </Link>

        <div className='flex flex-col justify-center w-full'>
          <div className='ml-5  flex flex-row justify-between w-full'>
            <Link className='hover:cursor-pointer flex flex-row' href={`/profile/${lit?.username}`}>
              <div className='hover:underline text-primary/100 text-sm sm:text-base'>
                {lit?.full_name || 'Unknown User'}
              </div>
              <div className='hover:underline text-primary/40 text-xs sm:text-sm mt-0.5 ml-2'>
                @{lit?.username || 'unknown'}
              </div>
            </Link>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className='mr-5 text-xs    text-gray-500'>
                    {/* {timeAgoMobile(lit.created_at)} */}
                    {isMobile()
                      ? lit.created_at
                        ? timeAgoMobile(lit.created_at)
                        : 'Unknown time'
                      : lit.created_at
                        ? timeAgo(lit.created_at)
                        : 'Unknown time'}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {lit.created_at ? formattedDate(lit.created_at) : 'Unknown date'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className='flex ml-5 justify-between text-sm pl-0 flex-1'>
            <Link className='hover:cursor-pointer flex-grow' href={`/lit/${lit?.id}`}>
              <p className='flex-grow'>{lit?.content || 'No content available.'}</p>
            </Link>

            <div>
              <div className='flex flex-row  mt-1 text-sm gap-2'>
                {session?.user?.id ? <LikeComponent session={session} id={lit.id} /> : <> <LikeComponent session={false} id={lit.id} /></>}

                <Link className='hover:cursor-pointer ' href={`/lit/${lit?.id}`}>
                  <div className='flex flex-row'>
                    <span className='text-xs pt-1 text-gray-400 mr-[4px]'>
                      {commentCount ? commentCount : lit.comment_count}
                    </span>

                    <MessageCircle className={`${styles.icon} pt-1 w-[18px] h-auto `} />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
