import { GeistSans } from 'geist/font/sans'
import './globals.css'
import { Nav } from '@/components/nav/nav'
import { ReactQueryClientProvider } from '@/components/query-provider'
import { Toaster } from '@/components/ui/toaster'
import { Suspense } from 'react'
import { SkeletonFeed } from '@/components/skeleton/skeleton-feed'

const url = process.env.NEXT_PUBLIC_LITTER_URL || 'somethingwentwrong'

export const metadata = {
  metadataBase: new URL(url),
  title: 'litter',
  description: 'Your purr-fect source of daily, pawsome mews',
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className={GeistSans.className} suppressHydrationWarning>
      <head>
        <link rel='icon' href='/favicon.ico' sizes='any' />
      </head>
      <body className='bg-foreground text-background  relative'>
        <ReactQueryClientProvider>
          <Nav />
          <div className='flex flex-col flex-grow justify-center items-center '>
            <div className='w-full sm:w-[37rem] min-h-custom bg-[#1a1a1a]'>
              <main className='flex flex-col items-center justify-center ml-auto mr-auto'>
                {children}
              </main>
            </div>
          </div>
        </ReactQueryClientProvider>
        <Toaster />
      </body>
    </html>
  )
}
