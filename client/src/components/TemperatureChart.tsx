import { CChart } from '@coreui/react-chartjs'
import { useTemperatureSocket } from '../hooks/useTemperatureSocket'
import { getAverage } from '../utils/utils'

export default function TemperatureChart({ nodeId }: { nodeId: string }) {
  const { data, error } = useTemperatureSocket(nodeId)
  const currentTemperature = data.length ? data[data.length - 1] : 'N/A'

  return (
    <div className='flex max-w-[30rem] flex-col items-center justify-center rounded-lg bg-black/40 shadow-lg'>
      <h1 className='text-3xl font-bold'>Last 25 Data</h1>

      {/* Show error if exists */}
      {error && <div className='mb-4 font-semibold text-red-600'>Error: {error}</div>}

      {!error && (
        <CChart
          type='line'
          data={{
            labels: data.map((_, index) => `${index + 1}`),
            datasets: [
              {
                label: 'Data',
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: 'rgba(75,192,192,1)',
                pointBorderColor: '#fff',
                data,
              },
            ],
          }}
        />
      )}

      {/* Display average and current temperature */}
      <div className='text-white'>
        <p>Average: {getAverage(data)}°C</p>
        <p>Current: {Number(currentTemperature).toFixed(2)}°C</p>
      </div>
    </div>
  )
}
