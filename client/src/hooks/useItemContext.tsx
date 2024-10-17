import { useContext } from 'react'
import { ItemContext } from '../context/itemContext'

// Custom hook to use the ItemContext
const useItemContext = () => {
  const context = useContext(ItemContext)
  if (context === undefined) {
    throw new Error('useItemContext must be used within an ItemProvider')
  }
  return context
}

export { useItemContext }
