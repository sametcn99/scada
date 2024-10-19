import { SupportedDataTypes } from '../lib/supported-data-types'
import { useCallback, useState } from 'react'

export const useData = (nodeId: string) => {
  const [data, setData] = useState<DataType[]>([])
  const [totalDataCount, setTotalDataCount] = useState(0)

  const handleNewData = useCallback(
    (newData: string) => {
      console.log('newData:', newData, nodeId)
      const regex = /Variant\((Scalar<(\w+)>), value: (.+)\)/
      const match = newData.match(regex)

      if (match) {
        const type = match[2]
        let value: number // Declare value as a number

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
          nodeId: nodeId,
          type: `Scalar<${type}>`,
          value: value,
        }

        setData((prevData) => {
          return [...prevData, result]
        })
        setTotalDataCount((prevCount) => prevCount + 1)
      } else {
        console.error('Invalid format')
      }
    },
    [nodeId]
  )

  return { data, totalDataCount, handleNewData }
}
