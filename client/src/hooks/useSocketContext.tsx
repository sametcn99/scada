import { useContext } from 'react'
import { SocketContext } from '../context/socketContext'

export const useSocketContext = () => useContext(SocketContext)