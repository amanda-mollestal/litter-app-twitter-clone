import { Skeleton } from '@/components/ui/skeleton'

export function ProfileHeaderSkeleton() {
  return (
    <div className='p-4 pb-0 rounded-lg mx-auto flex h-[13rem] w-[37rem] flex-row items-center justify-center '>
      <div className='flex flex-col h-[13rem] flex-grow items-center justify-center w-full'>
        <div className='h-[5rem] w-[5rem]'>
          <Skeleton className='h-[5rem] w-[5rem] rounded-full' />
        </div>

        <div className='flex flex-col justify-end ml-4  mt-4 h-[52px]'>
          <Skeleton className='h-4 w-[200px] mb-2' />
          <Skeleton className='h-4 w-[100px]' />
        </div>
      </div>

      <div className='flex flex-col flex-grow items-center justify-center w-full h-[13rem]  text-gray-400'>
        <div className='flex flex-grow items-center justify-center flex-col pt-6 '>
          <span className='h-8 w-[100px]' />
        </div>
        <div className='text-center flex flex-col justify-between  p-6 pt-0'>
          <div className='flex flex-col items-center'>
            <Skeleton className='h-4 w-[150px] mb-2' />
            <div className='flex space-x-4'>
              <Skeleton className='h-4 w-[100px]' />
              <Skeleton className='h-4 w-[100px]' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
