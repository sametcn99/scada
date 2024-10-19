import { API_URL } from '../config'
import React, { createContext, useEffect, useState } from 'react'
import { Socket, io } from 'socket.io-client'

interface SocketContextProps {
  socket: Socket | null
  message: string
  isConnected?: boolean
}

const SocketContext = createContext<SocketContextProps>({ socket: null, message: '' })

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [message, setMessage] = useState<string>('Trying to connect to socket...')
  const [isConnected, setIsConnected] = useState<boolean>(false)

  useEffect(() => {
    const socketInstance: Socket = io(API_URL.origin)
    setSocket(socketInstance)

    socketInstance.on('connect', () => {
      setMessage('Socket connected')
      setIsConnected(true)
    })

    socketInstance.on('connect_error', (error) => {
      setMessage(`Socket Connection failed: ${error.message}`)
    })

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return <SocketContext.Provider value={{ socket, message, isConnected }}>{children}</SocketContext.Provider>
}

export { SocketContext }
