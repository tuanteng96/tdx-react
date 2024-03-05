import React from 'react'
import { AnimatePresence, LayoutGroup, m } from 'framer-motion'
import { FloatingPortal } from '@floating-ui/react'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Button } from 'src/app/_ezs/partials/button'
import { Controller, useForm } from 'react-hook-form'
import { Input } from 'src/app/_ezs/partials/forms'
import Select from 'react-select'
import { SelectAsyncMembers } from 'src/app/_ezs/partials/select'
import { InputDatePicker } from 'src/app/_ezs/partials/forms/input/InputDatePicker'

function Filter({ visible, onHide, initialValues, onSubmit, onReset }) {
  const { control, handleSubmit, reset } = useForm({
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
                      <div className='text-2xl font-bold'>Bộ lọc đơn hàng</div>
                      <div
                        className='absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4'
                        onClick={onHide}
                      >
                        <XMarkIcon className='w-8' />
                      </div>
                    </Dialog.Title>
                    <div className='p-5 overflow-auto grow'>
                      <div className='mb-4'>
                        <div>Từ khóa</div>
                        <div className='mt-1'>
                          <Controller
                            name='key'
                            control={control}
                            render={({ field: { ref, ...field }, fieldState }) => (
                              <Input
                                placeholder='Họ tên, ID, Số điện thoại'
                                value={field.value}
                                onChange={field.onChange}
                                errorMessageForce={fieldState?.invalid}
                                errorMessage={fieldState?.error?.message}
                              />
                            )}
                          />
                        </div>
                      </div>
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
                      <div className='mb-4'>
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
                      <div>
                        <div>Trạng thái</div>
                        <div className='mt-1'>
                          <Controller
                            name='status'
                            control={control}
                            render={({ field: { ref, ...field }, fieldState }) => (
                              <Select
                                isClearable
                                className='select-control'
                                classNamePrefix='select'
                                options={[
                                  {
                                    label: 'Hoàn thành',
                                    value: 'finish'
                                  },
                                  {
                                    label: 'Đang xử lý',
                                    value: 'user_sent'
                                  },
                                  {
                                    label: 'Hủy',
                                    value: 'cancel'
                                  }
                                ]}
                                placeholder='Chọn trạng thái'
                                value={field.value}
                                onChange={(val) => field.onChange(val)}
                                menuPortalTarget={document.body}
                                menuPosition='fixed'
                                styles={{
                                  menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999
                                  })
                                }}
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center justify-between p-5 border-t border-light'>
                      <div
                        className='cursor-pointer text-info rounded h-12 px-5 flex items-center'
                        onClick={() => {
                          onReset()
                          reset()
                        }}
                      >
                        Xóa bộ lọc
                      </div>
                      <div className='flex justify-end'>
                        <button
                          type='button'
                          className='relative flex items-center h-12 px-5 transition border rounded shadow-lg border-light hover:border-gray-800 focus:outline-none focus:shadow-none'
                          onClick={onHide}
                        >
                          Đóng
                        </button>
                        <Button
                          type='submit'
                          className='relative flex items-center h-12 px-5 ml-2 text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70'
                        >
                          Thực hiện
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
