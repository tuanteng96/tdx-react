import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import App from '../App'
import PrivateRoutes from './PrivateRoutes'
import { useAuth } from '../_ezs/core/Auth'

const { PUBLIC_URL } = import.meta.env

const DetectRoute = () => {
  let { search } = window.location
  if (search.indexOf('manage') > -1) {
    return <Navigate to={`/quan-ly`} replace />
  }
  return <Navigate to={`/vi-dien-tu`} replace />
}

export default function AppRoutes() {
  return (
    <BrowserRouter basename={PUBLIC_URL}>
      <Routes>
        <Route element={<App />}>
          <Route path='/*' element={<PrivateRoutes />} />
          <Route path='/Admin/PageTele/index.html' element={<DetectRoute />} />
          {/* <Route
            index
            element={<Navigate to={`/vi-dien-tu`} replace />}
          /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
