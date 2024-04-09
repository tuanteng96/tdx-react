import React, { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SuspensedView from 'src/app/routing/SuspensedView'

const HomePage = lazy(() => import('./pages/home'))

function SynthesisReportPage(props) {
  return (
    <Routes>
      <Route
      // element={
      //   <RoleAccess roles={quan_ly_khach_hang?.hasRight || quan_ly_don_hang?.hasRight || quan_ly_tien?.hasRight} />
      // }
      >
        <Route index element={<Navigate to='danh-sach' />} />
        <Route
          path='danh-sach'
          element={
            <SuspensedView>
              <HomePage />
            </SuspensedView>
          }
        />
      </Route>
    </Routes>
  )
}

export default SynthesisReportPage
