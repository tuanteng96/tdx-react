import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import App from '../App'
import PrivateRoutes from './PrivateRoutes'
import { useAuth } from '../_ezs/core/Auth'

const { PUBLIC_URL } = import.meta.env

export default function AppRoutes() {
  const { CrStocks } = useAuth()
  
  return (
    <BrowserRouter basename={PUBLIC_URL}>
      <Routes>
        <Route element={<App />}>
          <Route path='/*' element={<PrivateRoutes />} />
          <Route
            path='/Admin/PageTele/index.html'
            element={<Navigate to={`/vi-dien-tu`} replace />}
          />
          <Route
            index
            element={<Navigate to={`/vi-dien-tu`} replace />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
