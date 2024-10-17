import React, { createContext, useState, ReactNode } from 'react'

// Define the type for the context value
interface ItemContextType {
  items: string[]
  addItem: (item: string) => void
}

// Create the context with a default value
const ItemContext = createContext<ItemContextType | undefined>(undefined)

// Define the provider component
const ItemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<string[]>([])

  const addItem = (item: string) => {
    setItems([...items, item])
  }

  return <ItemContext.Provider value={{ items, addItem }}>{children}</ItemContext.Provider>
}

export { ItemProvider, ItemContext }
