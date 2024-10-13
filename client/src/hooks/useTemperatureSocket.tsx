import { useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"

const socketUrl = "http://localhost:4020"

export const useTemperatureSocket = () => {
  const [data, setData] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const socket: Socket = io(socketUrl)

    socket.on("temperature", (newData) => {
      const value = parseFloat(newData.match(/value:\s([\d.]+)/)?.[1] || "0")
      setData((prevData) => {
        const updatedData = [...prevData, value]
        // Keep only the last 20 elements
        return updatedData.slice(-25)
      })
    })

    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error: ", error)
      setError("Socket.IO connection error: " + error.message)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return { data, error }
}
