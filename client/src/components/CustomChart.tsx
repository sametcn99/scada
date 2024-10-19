import { useSocket } from '../hooks/useSocket'
import { getAverage } from '../utils/utils'
import { Card } from '@mui/material'
import { LineChart } from '@mui/x-charts'

export default function CustomChart({ nodeId }: { nodeId: string }) {
  const { data, error } = useSocket(nodeId)

  const filteredData = data.filter((item) => item.nodeId === nodeId)

  const currentTemperature = filteredData.length ? filteredData[filteredData.length - 1].value : 'N/A'

  const _data = filteredData.map((item) => item.value)

  return (
    <>
      {error && <Card className='mx-10 mb-4 text-wrap font-semibold text-red-600'>{error}</Card>}
      {data.length > 0 && !error && (
        <Card
          sx={{
            p: 2,
            m: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <>
            <h1 className='text-3xl font-bold'>{nodeId}</h1>
            <h2 className='text-base'>Type: {filteredData.length ? filteredData[0].type : 'N/A'}</h2>
            <LineChart
              xAxis={[{ data: filteredData.map((_, index) => `${index + 1}`) }]}
              series={[
                {
                  data: _data,
                  label: 'Data',
                },
              ]}
              width={500}
              height={300}
            />
            {/* Display average and current temperature */}
            <div className='text-white'>
              <p>Average: {getAverage(filteredData)}°C</p> {/* Use getAverage function */}
              <p>Current: {currentTemperature}°C</p> {/* Display currentTemperature directly */}
            </div>
          </>
        </Card>
      )}
    </>
  )
}
