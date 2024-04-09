import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import SuspensedView from './SuspensedView'

const TelesalesPage = lazy(() => import('../pages/Telesales'))
const WalletsPage = lazy(() => import('../pages/Wallets'))
const ManagePage = lazy(() => import('../pages/Manage'))
const SynthesisReportPage = lazy(() => import('../pages/SynthesisReport'))
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
        path='quan-ly/*'
        element={
          <SuspensedView>
            <ManagePage />
          </SuspensedView>
        }
      />
      <Route
        path='bao-cao-tong-hop/*'
        element={
          <SuspensedView>
            <SynthesisReportPage />
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
