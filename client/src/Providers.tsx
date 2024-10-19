import { ItemProvider } from './context/itemContext'
import { SocketProvider } from './context/socketContext'
import theme from './theme'
import { ThemeProvider } from '@mui/material'
import { ReactNode } from 'react'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <SocketProvider>
          <ItemProvider>{children}</ItemProvider>
        </SocketProvider>
      </ThemeProvider>
    </>
  )
}
