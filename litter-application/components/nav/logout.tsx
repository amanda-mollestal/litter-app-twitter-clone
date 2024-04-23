'use client'
import { Button } from '../ui/button'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { GitlabIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const Logout = () => {
  const supabase = createSupabaseBrowser()
  const router = useRouter()

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <Button className='text-foreground hover:bg-primary/70' onClick={logout}>
      Logout &nbsp; <GitlabIcon />
    </Button>
  )
}
