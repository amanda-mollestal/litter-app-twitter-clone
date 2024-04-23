'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { AvatarImage, AvatarFallback, Avatar } from '@/components/ui/avatar'
import { Form, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { PostLitButton } from '@/components/home/post-lit-button'
import { useQueryClient } from '@tanstack/react-query'

const CommentFormSchema = z.object({
  content: z
    .string()
    .min(1, {
      message: 'Comment cannot be empty.',
    })
    .max(42, {
      message: 'Comment must not be longer than 42 characters.',
    }),
})

export type CommentData = {
  user_id: string
  username: string
  full_name: string
  avatar_url: string
  content: string
  parent_lit_id: string
}

export function CreateComment({ user, litId }: { user: User; litId: string }) {
  const supabase = createSupabaseBrowser()
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof CommentFormSchema>>({
    resolver: zodResolver(CommentFormSchema),
  })

  const username = user.email?.split('@')[0]
  const fullName = user.email === 'test@test.com' ? 'Test Testsson' : user.user_metadata?.full_name

  const avatarUrl = user.user_metadata?.avatar_url

  const postComment = async (formData: z.infer<typeof CommentFormSchema>) => {
    if (formData.content.length > 42) {
      throw new Error('Lit content exceeds 42 characters')
    }

    const { error } = await supabase.from('comments').insert([
      {
        user_id: user.id,
        username: username,
        full_name: fullName,
        avatar_url: avatarUrl,
        content: formData.content,
        parent_lit_id: litId,
      },
    ])

    if (error) {
      console.error(error)
      return
    }

    queryClient.invalidateQueries({ queryKey: [`commentCount-${litId}`, litId] })

    form.reset()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(postComment)}
        className='w-full flex flex-col justify-center items-center pb-4'
      >
        <div className='flex space-x-3 ml-2'>
          <Avatar className='mt-10 mr-2'>
            <AvatarImage alt='User avatar' src={avatarUrl} />
            <AvatarFallback>{fullName ? fullName.charAt(0) : 'U'}</AvatarFallback>
          </Avatar>
          <div className='flex h-12'>
            <FormItem className='mt-1'>
              <FormLabel className='text-sm'>Post a comment!</FormLabel>

              <FormControl>
                <Textarea
                  placeholder={`Share your thoughts on this lit!`}
                  className='resize-none w-80 h-14  text-black'
                  {...form.register('content')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      form.handleSubmit(postComment)()
                    }
                  }}
                />
              </FormControl>
              <FormMessage>
                {form.formState.errors.content ? (
                  <p className="text-red-500 text-xs mt-1 ">{form.formState.errors.content.message}</p>
                ) : <span></span>}
              </FormMessage>

            </FormItem>
            <div className='flex justify-center items-center ml-4 mt-16'>
              <PostLitButton />
            </div>
          </div>
        </div>
        <div className='flex flex-row justify-end'>
          <div className='flex flex-col'></div>
        </div>
        <div className='mx-auto'></div>
      </form>
    </Form>
  )
}
