import { AnimatePresence, LayoutGroup, m } from 'framer-motion'
import { FloatingPortal } from '@floating-ui/react'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Button } from 'src/app/_ezs/partials/button'
import { Controller, useForm } from 'react-hook-form'
import { InputDatePicker } from 'src/app/_ezs/partials/forms/input/InputDatePicker'
import { SelectAsyncMembers } from 'src/app/_ezs/partials/select'

function Filter({ visible, onHide, initialValues, onSubmit, onReset, onExport, loading }) {
  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      ...initialValues
    }
  })

  return (
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
              <form
                onSubmit={handleSubmit(onSubmit)}
                className='fixed inset-0 flex items-center justify-center z-[1003]'
                autoComplete='off'
              >
                <m.div
                  className='absolute flex flex-col justify-center h-full py-8 w-[500px] max-w-full px-3 md:px-0'
                  initial={{ opacity: 0, top: '60%' }}
                  animate={{ opacity: 1, top: 'auto' }}
                  exit={{ opacity: 0, top: '60%' }}
                >
                  <Dialog.Panel tabIndex={0} className='bg-white max-w-full max-h-full flex flex-col rounded shadow-lg'>
                    <Dialog.Title className='relative flex justify-between px-5 py-5 border-b border-light'>
                      <div className='text-2xl font-bold'>Bộ lọc</div>
                      <div
                        className='absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4'
                        onClick={onHide}
                      >
                        <XMarkIcon className='w-8' />
                      </div>
                    </Dialog.Title>
                    <div className='p-5 overflow-auto grow'>
                      <div className='mb-4'>
                        <div>Khách hàng</div>
                        <div className='mt-1'>
                          <Controller
                            name='MemberID'
                            control={control}
                            render={({ field: { ref, ...field }, fieldState }) => (
                              <SelectAsyncMembers
                                isClearable
                                className='select-control'
                                value={field.value}
                                onChange={(val) => field.onChange(val)}
                                placeholderText='Nhập tên khách hàng'
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div className='mb-4'>
                        <div>Từ ngày</div>
                        <div className='mt-1'>
                          <Controller
                            name='from'
                            control={control}
                            render={({ field: { ref, ...field }, fieldState }) => (
                              <InputDatePicker
                                placeholderText='Chọn ngày'
                                autoComplete='off'
                                onChange={field.onChange}
                                selected={field.value ? new Date(field.value) : null}
                                {...field}
                                dateFormat='dd/MM/yyyy'
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div>
                        <div>Đến ngày</div>
                        <div className='mt-1'>
                          <Controller
                            name='to'
                            control={control}
                            render={({ field: { ref, ...field }, fieldState }) => (
                              <InputDatePicker
                                placeholderText='Chọn ngày'
                                autoComplete='off'
                                onChange={field.onChange}
                                selected={field.value ? new Date(field.value) : null}
                                {...field}
                                dateFormat='dd/MM/yyyy'
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center justify-between p-5 border-t border-light'>
                      <div className='flex'>
                        <button
                          className='relative flex items-center h-12 px-5 transition border rounded border-light hover:border-success focus:outline-none cursor-pointer text-success disabled:opacity-50'
                          onClick={onExport}
                          type='button'
                          disabled={loading}
                        >
                          Xuất Excel
                          {loading && (
                            <svg
                              aria-hidden='true'
                              role='status'
                              className='inline w-6 h-6 text-gray-200 animate-spin ml-2'
                              viewBox='0 0 100 101'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                                fill='currentColor'
                              />
                              <path
                                d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                                className='fill-success'
                              />
                            </svg>
                          )}
                        </button>
                        <div
                          className='cursor-pointer text-info rounded h-12 px-5 flex items-center ml-2 border border-light w-[90px] md:w-auto'
                          onClick={() => {
                            onReset()
                            reset()
                          }}
                        >
                          <span className='truncate'>Xóa bộ lọc</span>
                        </div>
                      </div>
                      <div className='flex justify-end'>
                        <button
                          type='button'
                          className='relative hidden md:flex items-center h-12 px-5 transition border rounded shadow-lg border-light hover:border-gray-800 focus:outline-none focus:shadow-none'
                          onClick={onHide}
                        >
                          Đóng
                        </button>
                        <Button
                          type='submit'
                          className='relative flex items-center h-12 px-5 ml-2 text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70'
                        >
                          <span>Thực hiện</span>
                        </Button>
                      </div>
                    </div>
                  </Dialog.Panel>
                </m.div>
              </form>
            </Dialog>
          </LayoutGroup>
        </FloatingPortal>
      )}
    </AnimatePresence>
  )
}

export default Filter
