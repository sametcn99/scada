import Navbar from '../components/Navbar'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: LayoutProps) {
  return (
    <section className='min-h-screen w-full bg-zinc-300'>
      <Navbar />
      {children}
    </section>
  )
}
