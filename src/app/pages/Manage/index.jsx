import React, { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SuspensedView from 'src/app/routing/SuspensedView'
import { ManageLayout } from './ManageLayout'

const MembersPage = lazy(() => import('./pages/Members'))
const OrdersPage = lazy(() => import('./pages/Orders'))
const RosesPage = lazy(() => import('./pages/Roses'))

function ManagePage(props) {
  return (
    <Routes>
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
    </Routes>
  )
}

ManagePage.propTypes = {}

export default ManagePage
