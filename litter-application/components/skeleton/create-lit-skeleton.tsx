import { Skeleton } from '@/components/ui/skeleton'

export function CreateLitSkeleton() {
  return (
    <div className='flex flex-col justify-center items-center bg-[#1a1a1a]'>
      <div className='w-[25rem]'>
        <div className='flex space-x-3 pt-5'>
          <Skeleton className='h-10 w-10 rounded-full' />
          <div className='flex-1'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-20 w-full mt-2' />
          </div>
        </div>
        <div className='flex justify-end mt-2 mb-2 '>
          <Skeleton className='h-8 w-32' />
        </div>
      </div>
    </div>
  )
}
