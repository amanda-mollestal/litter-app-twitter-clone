import { AvatarImage, AvatarFallback, Avatar } from '@/components/ui/avatar'
import Link from 'next/link'
import { Comment } from '@/lib/types'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import styles from './comment-component.module.css'
import { formatDistanceToNow, format } from 'date-fns'
import { LikeComponent } from '../like/like-component'

const timeAgo = (date: string | number | Date) =>
  formatDistanceToNow(new Date(date), { addSuffix: true })
const formattedDate = (date: string | number | Date) => format(new Date(date), 'HH:mm dd/MM/yyyy')

export const CommentComponent = ({ comment, session }: { comment: Comment; session: any }) => {
  return (
    <div
      className={`p-2 pt-4 pb-4 text-white max-w-xl mx-auto ${styles.comment} border-t border-t-background/10`}
    >
      <div className='flex flex-row min-w-xl w-full'>
        <Link className='hover:cursor-pointer flex' href={`/profile/${comment?.username}`}>
          <Avatar className='h-8 w-8 mt-auto mb-auto '>
            <AvatarImage alt={`@${comment?.username}`} src={comment?.avatar_url!} />
            <AvatarFallback>
              {comment?.full_name ? comment?.full_name.charAt(0) : 'U'}
            </AvatarFallback>
          </Avatar>
        </Link>

        <div className='flex flex-col justify-center'>
          <div className='ml-5 flex flex-row justify-between w-[26rem]'>
            <Link
              className='hover:cursor-pointer flex flex-row'
              href={`/profile/${comment?.username}`}
            >
              <div className='hover:underline text-primary/100 text-base'>
                {comment?.full_name || 'Unknown User'}
              </div>
              <div className='hover:underline text-primary/40 text-sm mt-0.5 ml-2'>
                @{comment?.username || 'unknown'}
              </div>
            </Link>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <span className=' text-xs text-gray-500'>
                    {comment.created_at ? timeAgo(comment.created_at) : 'Unknown time'}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {comment.created_at ? formattedDate(comment.created_at) : 'Unknown date'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className='flex ml-5 justify-between text-sm pl-0 flex-1'>
            <p className='flex-grow'>{comment?.content || 'No content available.'}</p>

            {session?.user?.id ? <LikeComponent session={session} id={comment.id} /> : <> <LikeComponent session={false} id={comment.id} /></>}

          </div>
        </div>
      </div>
    </div>
  )
}
