import { useEffect, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { useData } from './useData'

const SOCKET_URL = 'http://localhost:4020'

export const useSocket = (nodeId: string) => {
  const { data, totalDataCount, handleNewData } = useData(nodeId)
  const [error, setError] = useState<string | null>(null)
  const [iValue, setIValue] = useState('')

  useEffect(() => {
    const value =
      nodeId
        .split(';')
        .find((part) => part.startsWith('i='))
        ?.split('=')[1] || ''
    setIValue(value)
    console.log('iValue:', iValue)
  }, [iValue, nodeId])

  useEffect(() => {
    console.log('totalDataCount:', totalDataCount)
  }, [totalDataCount])

  const handleConnectionError = useCallback((error: Error) => {
    console.error('Socket.IO connection error:', error)
    setError(`Socket.IO connection error: ${error.message}`)
  }, [])

  useEffect(() => {
    const socket: Socket = io(SOCKET_URL)
    socket.on(iValue, handleNewData)
    socket.on('connect_error', handleConnectionError)
    return () => {
      socket.disconnect()
    }
  }, [handleNewData, handleConnectionError, iValue])

  return { data, error }
}
