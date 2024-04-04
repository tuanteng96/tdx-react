import React, { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useRoles } from 'src/app/_ezs/hooks/useRoles'
import { RoleAccess } from 'src/app/_ezs/layout/RoleAccess'
import SuspensedView from 'src/app/routing/SuspensedView'

const WithdrawalHistoryPage = lazy(() => import('./pages/WithdrawalHistory'))

function WalletsPage(props) {
  const { rut_tien } = useRoles(['rut_tien'])
  return (
    <Routes>
      <Route element={<RoleAccess roles={rut_tien?.hasRight} />}>
        <Route index element={<Navigate to={`lich-su-rut-tien`} />} />
        <Route
          path='lich-su-rut-tien'
          element={
            <SuspensedView>
              <WithdrawalHistoryPage />
            </SuspensedView>
          }
        />
      </Route>
    </Routes>
  )
}

WalletsPage.propTypes = {}

export default WalletsPage
