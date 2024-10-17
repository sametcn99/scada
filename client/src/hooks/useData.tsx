import { useState, useCallback } from 'react'
import { SupportedDataTypes } from '../lib/supported-data-types'

const MAX_DATA_POINTS = 25

type DataType = {
  type: string
  value: number
}

export const useData = () => {
  const [data, setData] = useState<DataType[]>([])
  const [totalDataCount, setTotalDataCount] = useState(0)

  const handleNewData = useCallback((newData: string) => {
    console.log('newData:', newData)
    const regex = /Variant\((Scalar<(\w+)>), value: (.+)\)/
    const match = newData.match(regex)

    if (match) {
      const type = match[2]
      let value: number // Declare value as a number
      console.log('type:', type)

      // Tipine göre değeri dönüştür
      switch (type) {
        case SupportedDataTypes.Int32:
          value = parseInt(match[3], 10)
          break
        case SupportedDataTypes.Float:
          value = parseFloat(match[3])
          break
        case SupportedDataTypes.Double:
          value = parseFloat(match[3])
          break
        default:
          throw new Error('Unsupported type')
      }

      const result: DataType = {
        type: `Scalar<${type}>`,
        value: value,
      }

      setData((prevData) => {
        const updatedData = [...prevData, result]
        console.log('updatedData:', updatedData)
        return updatedData.slice(-MAX_DATA_POINTS)
      })
      setTotalDataCount((prevCount) => prevCount + 1)
    } else {
      console.error('Invalid format')
    }
  }, [])

  return { data, totalDataCount, handleNewData }
}
