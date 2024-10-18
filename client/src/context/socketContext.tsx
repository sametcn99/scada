import React, { createContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

const SOCKET_URL = 'http://localhost:4020'

interface SocketContextProps {
  socket: Socket | null
  message: string
}

const SocketContext = createContext<SocketContextProps>({ socket: null, message: '' })

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [message, setMessage] = useState<string>('Trying to connect to socket...')

  useEffect(() => {
    const socketInstance: Socket = io(SOCKET_URL)
    setSocket(socketInstance)

    socketInstance.on('connect', () => {
      setMessage('Socket connected')
    })

    socketInstance.on('connect_error', (error) => {
      setMessage(`Socket Connection failed: ${error.message}`)
    })

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return <SocketContext.Provider value={{ socket, message }}>{children}</SocketContext.Provider>
}

export { SocketContext }
