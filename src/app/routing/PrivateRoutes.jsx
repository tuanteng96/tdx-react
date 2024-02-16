import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import SuspensedView from './SuspensedView'

const TelesalesPage = lazy(() => import('../pages/Telesales'))
const WalletsPage = lazy(() => import('../pages/Wallets'))
const UnauthorizedPage = lazy(() => import('../pages/Unauthorized'))

function PrivateRoutes() {
  return (
    <Routes>
      <Route
        path='telesales/*'
        element={
          <SuspensedView>
            <TelesalesPage />
          </SuspensedView>
        }
      />
      <Route
        path='vi-dien-tu/*'
        element={
          <SuspensedView>
            <WalletsPage />
          </SuspensedView>
        }
      />
      <Route
        path='unauthorized'
        element={
          <SuspensedView>
            <UnauthorizedPage />
          </SuspensedView>
        }
      />
    </Routes>
  )
}

export default PrivateRoutes
