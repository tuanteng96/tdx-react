import React, { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SuspensedView from 'src/app/routing/SuspensedView'
import { ManageLayout } from './ManageLayout'
import { RoleAccess } from 'src/app/_ezs/layout/RoleAccess'
import { useRoles } from 'src/app/_ezs/hooks/useRoles'

const MembersPage = lazy(() => import('./pages/Members'))
const OrdersPage = lazy(() => import('./pages/Orders'))
const RosesPage = lazy(() => import('./pages/Roses'))

function ManagePage(props) {
  const { pos_mng } = useRoles(['pos_mng'])
  return (
    <Routes>
      <Route element={<RoleAccess roles={pos_mng?.hasRight} />}>
        <Route element={<ManageLayout />}>
          <Route index element={<Navigate to='khach-hang' />} />
          <Route
            path='khach-hang'
            element={
              <SuspensedView>
                <MembersPage />
              </SuspensedView>
            }
          />
          <Route
            path='don-hang'
            element={
              <SuspensedView>
                <OrdersPage />
              </SuspensedView>
            }
          />
          <Route
            path='hoa-hong'
            element={
              <SuspensedView>
                <RosesPage />
              </SuspensedView>
            }
          />
        </Route>
      </Route>
    </Routes>
  )
}

ManagePage.propTypes = {}

export default ManagePage
