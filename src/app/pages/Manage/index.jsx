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
  const { quan_ly_khach_hang, quan_ly_don_hang, quan_ly_tien } = useRoles([
    'quan_ly_khach_hang',
    'quan_ly_don_hang',
    'quan_ly_tien'
  ])

  const checkFirstRouter = () => {
    if (quan_ly_khach_hang?.hasRight) {
      return 'khach-hang'
    } else if (quan_ly_don_hang?.hasRight) {
      return 'don-hang'
    } else {
      return 'hoa-hong'
    }
  }

  return (
    <Routes>
      <Route
        element={
          <RoleAccess roles={quan_ly_khach_hang?.hasRight || quan_ly_don_hang?.hasRight || quan_ly_tien?.hasRight} />
        }
      >
        <Route element={<ManageLayout />}>
          <Route index element={<Navigate to={checkFirstRouter()} />} />
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
