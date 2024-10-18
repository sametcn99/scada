import { useEffect, useState, useCallback } from 'react'
import { useData } from './useData'
import { useSocketContext } from './useSocketContext'

export const useSocket = (nodeId: string) => {
  const { data, handleNewData } = useData(nodeId)
  const { socket, isConnected } = useSocketContext()
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

  const handleConnectionError = useCallback((error: Error) => {
    console.error('Socket.IO connection error:', error)
    setError(`Socket.IO connection error: ${error.message}`)
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on(nodeId, handleNewData)
      socket.on('connect_error', handleConnectionError)
    }

    return () => {
      if (socket) {
        socket.off(nodeId, handleNewData)
        socket.off('connect_error', handleConnectionError)
      }
    }
  }, [socket, handleNewData, handleConnectionError, nodeId])

  return { data, error, isConnected }
}
