import Image from 'next/image'
import litter from '@/public/litter.svg'
import Link from 'next/link'
import { Login } from '@/components/nav/login'
import { Logout } from '@/components/nav/logout'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function Nav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const supabase = createSupabaseServer()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) console.log(session.user.email + ' is authenticated')

  return (
    <div
      className={` flex justify-between items-center h-16 px-4 border-b border-b-background/10`}
      {...props}
    >
      <div className='flex-initial pr-1'>
        <Link className='flex flex-row text-center cursor-pointer' href='/'>
          <Image priority={true} className='w-[2.5rem] h-auto' src={litter} alt='Litter Logo' />
          <h2 className='text-center text-3xl pl-4 items-center text-primary pt-1'>litter</h2>
        </Link>
      </div>

      <div className='flex-initial'>{session ? <Logout /> : <Login />}</div>
    </div>
  )
}
