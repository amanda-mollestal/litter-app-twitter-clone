import { Skeleton } from '@/components/ui/skeleton'

export function SkeletonFeed() {
  const arr = Array.from({ length: 15 }, (_, i) => i)
  return (
    <div className='flex flex-col'>
      {arr.map((_, i) => (
        <div key={i} className='flex items-center  justify-center w-full space-x-4  p-4 '>
          <Skeleton className='h-12 w-12 rounded-full pt-4' />
          <div className='space-y-2'>
            <Skeleton className='h-4 w-[28rem]' />
            <Skeleton className='h-4 w-[14rem]' />
          </div>
        </div>
      ))}
    </div>
  )
}
