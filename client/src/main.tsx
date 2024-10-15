import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './pages/App.tsx'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.tsx'
import '@coreui/coreui/dist/css/coreui.min.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route
            path='/'
            element={<App />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  </StrictMode>
)
