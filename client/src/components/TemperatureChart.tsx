import { CChart } from '@coreui/react-chartjs'
import { useTemperatureSocket } from '../hooks/useTemperatureSocket'
import { getAverage } from '../utils/utils'

export default function TemperatureChart() {
  const { data, error } = useTemperatureSocket()
  const currentTemperature = data.length ? data[data.length - 1] : 'N/A'

  return (
    <div className='flex flex-col items-center justify-center rounded-lg bg-black/40 p-6 shadow-lg'>
      <h1 className='mb-4 text-3xl font-bold'>Last 25 Temperature</h1>

      {/* Show error if exists */}
      {error && <div className='mb-4 font-semibold text-red-600'>Error: {error}</div>}

      {!error && (
        <div className='w-full max-w-3xl'>
          <CChart
            className='mt-4 h-[20rem] w-[30rem]'
            type='line'
            data={{
              labels: data.map((_, index) => `${index + 1}`),
              datasets: [
                {
                  label: 'Temperature',
                  backgroundColor: 'rgba(75,192,192,0.2)',
                  borderColor: 'rgba(75,192,192,1)',
                  pointBackgroundColor: 'rgba(75,192,192,1)',
                  pointBorderColor: '#fff',
                  data,
                },
              ],
            }}
          />
        </div>
      )}

      {/* Display average and current temperature */}
      <div className='text-white'>
        <p>Average Temperature: {getAverage(data)}°C</p>
        <p>Current Temperature: {Number(currentTemperature).toFixed(2)}°C</p>
      </div>
    </div>
  )
}
