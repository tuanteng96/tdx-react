import React, { useState } from 'react'
import { AnimatePresence, LayoutGroup, m } from 'framer-motion'
import { FloatingPortal } from '@floating-ui/react'
import { Dialog } from '@headlessui/react'
import { ArrowDownIcon, ArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline'
import moment from 'moment'
import { formatString } from 'src/app/_ezs/utils/formatString'
import clsx from 'clsx'

function PickerCard({ children, rowData, data }) {
  const [visible, setVisible] = useState(false)

  const onHide = () => {
    setVisible(false)
  }

  return (
    <>
      {children({
        open: () => setVisible(true),
        close: () => setVisible(false)
      })}
      <AnimatePresence>
        {visible && (
          <FloatingPortal>
            <LayoutGroup>
              <Dialog open={visible} onClose={onHide}>
                <m.div
                  className='fixed inset-0 bg-black/[.2] z-[1003]'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                ></m.div>
                <div className='fixed inset-0 flex items-center justify-center z-[1003]'>
                  <m.div
                    className='absolute flex flex-col justify-center h-full py-8'
                    initial={{ opacity: 0, top: '60%' }}
                    animate={{ opacity: 1, top: 'auto' }}
                    exit={{ opacity: 0, top: '60%' }}
                  >
                    <Dialog.Panel
                      tabIndex={0}
                      className='bg-white max-w-full w-[500px] max-h-full flex flex-col rounded shadow-lg'
                    >
                      <Dialog.Title className='relative flex justify-between px-5 py-5 border-b border-light'>
                        <div className='text-2xl font-bold'>Lịch sử thẻ tiền - {rowData?.FullName}</div>
                        <div
                          className='absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4'
                          onClick={onHide}
                        >
                          <XMarkIcon className='w-8' />
                        </div>
                      </Dialog.Title>
                      <div className='overflow-auto grow'>
                        {data &&
                          data
                            .sort((a, b) => moment(b.CreateDate).valueOf() - moment(a.CreateDate).valueOf())
                            .map((item, index) => (
                              <div className='p-5 flex items-center border-b last:border-0' key={index}>
                                <div>
                                  {item.Value > 0 ? (
                                    <div className='w-12 h-12 bg-successlight text-success rounded-full flex items-center justify-center'>
                                      <ArrowUpIcon className='w-6' />
                                    </div>
                                  ) : (
                                    <div className='w-12 h-12 bg-dangerlight text-danger rounded-full flex items-center justify-center'>
                                      <ArrowDownIcon className='w-6' />
                                    </div>
                                  )}
                                </div>
                                <div className='flex-1 px-4'>
                                  <div className='text-[#6c7293] text-[14px] mb-px'>
                                    {moment(item.CreateDate).format('HH:mm DD-MM-YYYY')}
                                  </div>
                                  <div className='font-medium'>
                                    {item.Value < 0 ? 'Thanh toán đơn hàng' : item.MoneyTitle}
                                  </div>
                                </div>
                                <div>
                                  <div className='font-semibold'>
                                    {item.Value > 0 && '+'}
                                    {formatString.formatVND(item.Value)}
                                  </div>
                                </div>
                              </div>
                            ))}
                      </div>
                      <div className='flex items-center justify-end p-5 border-t border-light'>
                        <button
                          type='button'
                          className='relative flex items-center h-12 px-5 transition border rounded shadow-lg border-light hover:border-gray-800 focus:outline-none focus:shadow-none'
                          onClick={onHide}
                        >
                          Đóng
                        </button>
                      </div>
                    </Dialog.Panel>
                  </m.div>
                </div>
              </Dialog>
            </LayoutGroup>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </>
  )
}

export default PickerCard
