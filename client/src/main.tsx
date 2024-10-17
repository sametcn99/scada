import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './pages/App.tsx'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout.tsx'
import '@coreui/coreui/dist/css/coreui.min.css'
import { ItemProvider } from './context/itemContext.tsx'
import { SocketProvider } from './context/socketContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SocketProvider>
        <ItemProvider>
          <MainLayout>
            <Routes>
              <Route
                path='/'
                element={<App />}
              />
            </Routes>
          </MainLayout>
        </ItemProvider>
      </SocketProvider>
    </BrowserRouter>
  </StrictMode>
)
