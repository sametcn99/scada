import { useEffect, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'

const SOCKET_URL = 'http://localhost:4020'
const MAX_DATA_POINTS = 25

export const useTemperatureSocket = (nodeId: string) => {
  const [totalDataCount, setTotalDataCount] = useState(0)
  const [data, setData] = useState<number[]>([])
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

  const handleNewTemperatureData = useCallback((newData: string) => {
    const match = newData.match(/value:\s([\d.]+)/)
    const value = match ? parseFloat(match[1]) : 0

    setData((prevData) => {
      const updatedData = [...prevData, value]
      console.log('updatedData:', updatedData)
      return updatedData.slice(-MAX_DATA_POINTS)
    })
    setTotalDataCount((prevCount) => prevCount + 1)
  }, [])

  const handleConnectionError = useCallback((error: Error) => {
    console.error('Socket.IO connection error:', error)
    setError(`Socket.IO connection error: ${error.message}`)
  }, [])

  useEffect(() => {
    const socket: Socket = io(SOCKET_URL)
    socket.on(iValue, handleNewTemperatureData)
    socket.on('connect_error', handleConnectionError)
    return () => {
      socket.disconnect()
    }
  }, [handleNewTemperatureData, handleConnectionError, iValue])

  return { data, error }
}
