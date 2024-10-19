import Add from '../components/Add'
import CustomChart from '../components/CustomChart'
import { useItemContext } from '../hooks/useItemContext'
import { CircularProgress } from '@mui/material'

function App() {
  const { items, loading } = useItemContext()

  return (
    <main className='flex flex-col place-items-center gap-4'>
      <div className='className= flex flex-row flex-wrap place-items-center justify-center gap-4'>
        {loading && (
          <div className='flex flex-col place-items-center justify-center py-4'>
            <CircularProgress />
            <p>Checking items...</p>
          </div>
        )}
        {!loading &&
          items &&
          items.map((item, index) => {
            return (
              <CustomChart
                key={index}
                nodeId={item}
              />
            )
          })}
      </div>
      {!loading && <Add />}
    </main>
  )
}

export default App
