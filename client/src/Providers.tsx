import { ReactNode } from 'react'
import { SocketProvider } from './context/socketContext'
import { ItemProvider } from './context/itemContext'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <SocketProvider>
        <ItemProvider>{children}</ItemProvider>
      </SocketProvider>
    </>
  )
}
