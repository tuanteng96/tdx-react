import { AdjustmentsVerticalIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { createContext, useContext, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useRoles } from 'src/app/_ezs/hooks/useRoles'

const ManageContext = createContext()

const useManage = () => {
  return useContext(ManageContext)
}

function ManageLayout() {
  let [total, setTotal] = useState({
    Members: 0,
    Order: 0
  })
  let [open, setOpen] = useState(false)

  const onHide = () => setOpen(false)

  const { quan_ly_khach_hang, quan_ly_don_hang, quan_ly_tien } = useRoles([
    'quan_ly_khach_hang',
    'quan_ly_don_hang',
    'quan_ly_tien'
  ])

  const { pathname } = useLocation()

  return (
    <ManageContext.Provider value={{ open, onHide, setTotal }}>
      <div className='h-full flex flex-col'>
        <div className='px-4 py-3 flex justify-between bg-white'>
          <div className='flex'>
            {quan_ly_khach_hang?.hasRight && (
              <NavLink
                className={({ isActive }) =>
                  clsx(
                    'block md:px-4 px-2 rounded pt-3 pb-2.5 hover:text-primary hover:bg-[#f5f5f9] font-medium md:mr-2 text-[13px] md:text-[14px] transition-all',
                    isActive ? 'bg-[#f5f5f9] text-primary' : 'text-[#6c7293]'
                  )
                }
                to='khach-hang'
              >
                <span className='hidden md:inline-block'>Khách hàng</span>
                <span className='md:hidden'>K.Hàng</span>
                {total.Members > 0 && (
                  <span className='bg-danger text-white text-[10px] px-1 rounded ml-1'>{total.Members}</span>
                )}
              </NavLink>
            )}

            {quan_ly_don_hang?.hasRight && (
              <NavLink
                className={({ isActive }) =>
                  clsx(
                    'block md:px-4 px-2 rounded pt-3 pb-2.5 hover:text-primary hover:bg-[#f5f5f9] font-medium md:mr-2 text-[13px] md:text-[14px] transition-all',
                    isActive ? 'bg-[#f5f5f9] text-primary' : 'text-[#6c7293]'
                  )
                }
                to='don-hang'
              >
                <span className='hidden md:inline-block'>Đơn hàng</span>
                <span className='md:hidden'>Đ.Hàng</span>

                {total.Orders > 0 && (
                  <span className='bg-danger text-white text-[10px] px-1 rounded ml-1'>{total.Orders}</span>
                )}
              </NavLink>
            )}

            {quan_ly_tien?.hasRight && (
              <NavLink
                className={({ isActive }) =>
                  clsx(
                    'block md:px-4 px-2 rounded pt-3 pb-2.5 hover:text-primary hover:bg-[#f5f5f9] font-medium md:mr-2 text-[13px] md:text-[14px] transition-all',
                    isActive ? 'bg-[#f5f5f9] text-primary' : 'text-[#6c7293]'
                  )
                }
                to='hoa-hong'
              >
                Tiền
              </NavLink>
            )}
            {quan_ly_khach_hang?.hasRight && (
              <NavLink
                className={({ isActive }) =>
                  clsx(
                    'block md:px-4 px-2 rounded pt-3 pb-2.5 hover:text-primary hover:bg-[#f5f5f9] font-medium md:mr-2 text-[13px] md:text-[14px] transition-all',
                    isActive ? 'bg-[#f5f5f9] text-primary' : 'text-[#6c7293]'
                  )
                }
                to='tong-hop'
              >
                <span className='hidden md:inline-block'>Tổng hợp</span>
                <span className='md:hidden'>T.Hợp</span>
                {/* {total.Members > 0 && (
                  <span className='bg-danger text-white text-[10px] px-1 rounded ml-1'>{total.Members}</span>
                )} */}
              </NavLink>
            )}
            {quan_ly_don_hang?.hasRight && (
              <NavLink
                className={({ isActive }) =>
                  clsx(
                    'block md:px-4 px-2 rounded pt-3 pb-2.5 hover:text-primary hover:bg-[#f5f5f9] font-medium md:mr-2 text-[13px] md:text-[14px] transition-all',
                    isActive ? 'bg-[#f5f5f9] text-primary' : 'text-[#6c7293]'
                  )
                }
                to='doanh-so'
              >
                <span className='hidden md:inline-block'>Doanh số</span>
                <span className='md:hidden'>D.Số</span>
                {/* {total.Members > 0 && (
                  <span className='bg-danger text-white text-[10px] px-1 rounded ml-1'>{total.Members}</span>
                )} */}
              </NavLink>
            )}
          </div>
          {pathname !== '/quan-ly/doanh-so' && (
            <div>
              <button
                type='button'
                className='block px-3 rounded pt-3 pb-2.5 bg-[#F3F6F9] transition-all hover:bg-primary hover:text-white border'
                onClick={() => setOpen(!open)}
              >
                <AdjustmentsVerticalIcon className='w-6' />
              </button>
            </div>
          )}
        </div>
        <div className='grow'>
          <Outlet />
        </div>
      </div>
    </ManageContext.Provider>
  )
}

export { ManageLayout, useManage }
