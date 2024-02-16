import React, { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SuspensedView from 'src/app/routing/SuspensedView'

const WithdrawalHistoryPage = lazy(() => import('./pages/WithdrawalHistory'))

function WalletsPage(props) {
  return (
    <Routes>
      <Route index element={<Navigate to={`lich-su-rut-tien`} />} />
      <Route
        path='lich-su-rut-tien'
        element={
          <SuspensedView>
            <WithdrawalHistoryPage />
          </SuspensedView>
        }
      />
    </Routes>
  )
}

WalletsPage.propTypes = {}

export default WalletsPage
