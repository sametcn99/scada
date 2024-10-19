import Providers from './Providers.tsx'
import './index.css'
import MainLayout from './layouts/MainLayout.tsx'
import App from './pages/App.tsx'
import '@coreui/coreui/dist/css/coreui.min.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

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
