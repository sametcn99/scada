import { ReactNode } from 'react'
import { SocketProvider } from './context/socketContext'
import { ItemProvider } from './context/itemContext'
import { ThemeProvider } from '@mui/material'
import theme from './theme'

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
