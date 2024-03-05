import { AdjustmentsVerticalIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { createContext, useContext, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const ManageContext = createContext()

const useManage = () => {
  return useContext(ManageContext)
}

function ManageLayout() {
  let [open, setOpen] = useState(false)

  const onHide = () => setOpen(false)

  return (
    <ManageContext.Provider value={{ open, onHide }}>
      <div className='h-full flex flex-col'>
        <div className='px-4 py-3 flex justify-between bg-white'>
          <div className='flex'>
            <NavLink
              className={({ isActive }) =>
                clsx(
                  'block px-4 rounded pt-3 pb-2.5 hover:text-primary hover:bg-[#f5f5f9] font-medium mr-2 text-[14px] transition-all',
                  isActive ? 'bg-[#f5f5f9] text-primary' : 'text-[#6c7293]'
                )
              }
              to='khach-hang'
            >
              Khách hàng
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                clsx(
                  'block px-4 rounded pt-3 pb-2.5 hover:text-primary hover:bg-[#f5f5f9] font-medium mr-2 text-[14px] transition-all',
                  isActive ? 'bg-[#f5f5f9] text-primary' : 'text-[#6c7293]'
                )
              }
              to='don-hang'
            >
              Đơn hàng
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                clsx(
                  'block px-4 rounded pt-3 pb-2.5 hover:text-primary hover:bg-[#f5f5f9] font-medium mr-2 text-[14px] transition-all',
                  isActive ? 'bg-[#f5f5f9] text-primary' : 'text-[#6c7293]'
                )
              }
              to='hoa-hong'
            >
              Hoa hồng
            </NavLink>
          </div>
          <div>
            <button
              type='button'
              className='block px-3 rounded pt-3 pb-2.5 bg-[#F3F6F9] transition-all hover:bg-primary hover:text-white border'
              onClick={() => setOpen(!open)}
            >
              <AdjustmentsVerticalIcon className='w-6' />
            </button>
          </div>
        </div>
        <div className='grow'>
          <Outlet />
        </div>
      </div>
    </ManageContext.Provider>
  )
}

export { ManageLayout, useManage }
