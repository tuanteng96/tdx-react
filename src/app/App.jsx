import { Outlet } from 'react-router-dom'
import { LazyMotion, domAnimation } from 'framer-motion'
import { ToastContainer } from 'react-toastify'

function App() {
  return (
    <LazyMotion features={domAnimation}>
      <Outlet />
      <ToastContainer theme='light' />
    </LazyMotion>
  )
}

export default App
