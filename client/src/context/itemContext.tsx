import React, { createContext, useState, ReactNode, useEffect } from 'react'
import { API_URL } from '../config'

// Define the type for the context value
interface ItemContextType {
  items: string[]
  addItem: (item: string) => void
  loading: boolean
}

// Create the context with a default value
const ItemContext = createContext<ItemContextType | undefined>(undefined)

// Define the provider component
const ItemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true)
      try {
        API_URL.pathname = '/api/nodeId'
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        if (Array.isArray(data.totalMonitoredItems)) {
          setItems(data.totalMonitoredItems)
        } else {
          throw new TypeError('Expected an array for totalMonitoredItems')
        }
      } catch (error) {
        console.error('Error fetching items:', error)
        setItems([]) // Set to an empty array or handle it as needed
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [])

  const addItem = (item: string) => {
    setItems([...items, item])
  }

  return <ItemContext.Provider value={{ items, addItem, loading }}>{children}</ItemContext.Provider>
}

export { ItemProvider, ItemContext }
