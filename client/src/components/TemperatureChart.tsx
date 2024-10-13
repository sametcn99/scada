import { CChart } from "@coreui/react-chartjs"
import { useTemperatureSocket } from "../hooks/useTemperatureSocket"
import { getAverage } from "../utils/utils"

export default function TemperatureChart() {
  const { data, error } = useTemperatureSocket()
  const currentTemperature = data.length ? data[data.length - 1] : "N/A"

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-black/20 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-4">Last 25 Temperature</h1>

      {/* Show error if exists */}
      {error && <div className="text-red-600 font-semibold mb-4">Error: {error}</div>}

      {!error && (
        <div className="w-full max-w-3xl">
          <CChart
            className="w-[30rem] h-[20rem] mt-4"
            type="line"
            data={{
              labels: data.map((_, index) => `${index + 1}`),
              datasets: [
                {
                  label: "Temperature",
                  backgroundColor: "rgba(75,192,192,0.2)",
                  borderColor: "rgba(75,192,192,1)",
                  pointBackgroundColor: "rgba(75,192,192,1)",
                  pointBorderColor: "#fff",
                  data,
                },
              ],
            }}
          />
        </div>
      )}

      {/* Display average and current temperature */}
      <div className="text-white">
        <p>Average Temperature: {getAverage(data)}°C</p>
        <p>Current Temperature: {Number(currentTemperature).toFixed(2)}°C</p>
      </div>
    </div>
  )
}
