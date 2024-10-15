import Navbar from './Navbar'

import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <section className='min-h-screen w-full bg-zinc-900'>
      <Navbar />
      {children}
    </section>
  )
}
