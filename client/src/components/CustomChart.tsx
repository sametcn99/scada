import { CChart } from '@coreui/react-chartjs'
import { useSocket } from '../hooks/useSocket'
import { getAverage } from '../utils/utils'

export default function CustomChart({ nodeId }: { nodeId: string }) {
  const { data, error } = useSocket(nodeId)

  const filteredData = data.filter((item) => item.nodeId === nodeId)

  const currentTemperature = filteredData.length ? filteredData[filteredData.length - 1].value : 'N/A'

  const _data = filteredData.map((item) => item.value)

  return (
    <div className='flex max-w-[30rem] flex-col items-center justify-center rounded-lg bg-black/40 shadow-lg'>
      <h1 className='text-3xl font-bold'>Last 25 Data</h1>
      <h2>Type: {filteredData.length ? filteredData[0].type : 'N/A'}</h2>

      {/* Show error if exists */}
      {error && <div className='mb-4 font-semibold text-red-600'>Error: {error}</div>}

      {!error && (
        <CChart
          type='line'
          data={{
            labels: filteredData.map((_, index) => `${index + 1}`),
            datasets: [
              {
                label: 'Data',
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: 'rgba(75,192,192,1)',
                pointBorderColor: '#fff',
                data: _data, // Corrected property name
              },
            ],
          }}
        />
      )}

      {/* Display average and current temperature */}
      <div className='text-white'>
        <p>Average: {getAverage(filteredData)}°C</p> {/* Use getAverage function */}
        <p>Current: {currentTemperature}°C</p> {/* Display currentTemperature directly */}
      </div>
    </div>
  )
}
