import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './pages/App.tsx'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout.tsx'
import '@coreui/coreui/dist/css/coreui.min.css'
import Providers from './Providers.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Providers>
        <MainLayout>
          <Routes>
            <Route
              path='/'
              element={<App />}
            />
          </Routes>
        </MainLayout>
      </Providers>
    </BrowserRouter>
  </StrictMode>
)
