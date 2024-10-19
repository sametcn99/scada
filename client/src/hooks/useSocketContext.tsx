import { SocketContext } from '../context/socketContext'
import { useContext } from 'react'

export const useSocketContext = () => useContext(SocketContext)
