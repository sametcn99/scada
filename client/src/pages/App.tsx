import Add from '../components/Add'
import TemperatureChart from '../components/TemperatureChart'
import { useItemContext } from '../hooks/useItemContext'

function App() {
  const { items } = useItemContext()
  return (
    <main className='flex flex-col place-items-center gap-4'>
      <div className='className= flex flex-row place-items-center justify-center gap-4'>
        {items.length > 0 &&
          items.map((item, index) => (
            <TemperatureChart
              key={index}
              nodeId={item}
            />
          ))}
      </div>
      <Add />
    </main>
  )
}

export default App
