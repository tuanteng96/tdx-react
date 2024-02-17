import { FloatingPortal } from '@floating-ui/react'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, LayoutGroup, m } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import WalletsAPI from 'src/app/_ezs/api/wallet.api'
import { Button } from 'src/app/_ezs/partials/button'
import { UploadFile } from 'src/app/_ezs/partials/files'
import { SelectStatusWallet } from 'src/app/_ezs/partials/select'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from 'react-toastify'

const SchemaUpdate = yup
  .object({
    BillSrc: yup.string().required('Vui lòng chọn Bill hóa đơn')
  })
  .required()

function PickerFinish({ children, rowData }) {
  const [visible, setVisible] = useState(false)

  const queryClient = useQueryClient()

  const { control, handleSubmit, reset } = useForm({
    defaultValues: { ID: 0, Status: '', BillSrc: '' },
    resolver: yupResolver(SchemaUpdate)
  })

  useEffect(() => {
    reset({
      ID: rowData.ID,
      Status: rowData.Status === 'HOAN_THANH' ? 'HOAN_THANH' : 'DANG_CHO',
      BillSrc: rowData.BillSrc
    })
  }, [rowData, visible, reset])

  const updateMutation = useMutation({
    mutationFn: (data) => WalletsAPI.updateHistory(data)
  })

  const onHide = () => setVisible(false)

  const onSubmit = (values) => {
    let dataPost = {
      draw: {
        ...values
      },
      IsPending: 0
    }

    updateMutation.mutate(dataPost, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ListWalletHistory'] }).then(() => {
          reset()
          onHide()
          toast.success('Cập nhập thành công.')
        })
      },
      onError: (error) => {
        console.log(error)
      }
    })
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
                      className='bg-white max-w-full w-[450px] max-h-full flex flex-col rounded shadow-lg'
                    >
                      <Dialog.Title className='relative flex justify-between px-5 py-5 border-b border-light'>
                        <div className='text-2xl font-bold'>Duyệt thanh toán</div>
                        <div
                          className='absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4'
                          onClick={onHide}
                        >
                          <XMarkIcon className='w-8' />
                        </div>
                      </Dialog.Title>
                      <div className='p-5 overflow-auto grow'>
                        <table className='w-full mb-5'>
                          <tbody>
                            <tr>
                              <td className='border border-[#e2e8f0] w-2/4 px-3 pt-3 pb-2.5'>Số tài khoản</td>
                              <td className='border border-[#e2e8f0] w-2/4 px-3 pt-3 pb-2.5 font-medium'>
                                {JSON.parse(rowData.Member.BankInfo).STK}
                              </td>
                            </tr>
                            <tr>
                              <td className='border border-[#e2e8f0] w-2/4 px-3 pt-3 pb-2.5'>Chủ tài khoản</td>
                              <td className='border border-[#e2e8f0] px-3 pt-3 pb-2.5 font-medium'>
                                {JSON.parse(rowData.Member.BankInfo).CTK}
                              </td>
                            </tr>
                            <tr>
                              <td className='border border-[#e2e8f0] w-2/4 px-3 pt-3 pb-2.5'>Ngân hàng</td>
                              <td className='border border-[#e2e8f0] px-3 pt-3 pb-2.5 font-medium'>
                                {JSON.parse(rowData.Member.BankInfo).NH}
                              </td>
                            </tr>
                            <tr>
                              <td className='border border-[#e2e8f0] w-2/4 px-3 pt-3 pb-2.5'>Chi nhánh</td>
                              <td className='border border-[#e2e8f0] px-3 pt-3 pb-2.5 font-medium'>
                                {JSON.parse(rowData.Member.BankInfo).CN}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <div className='mb-4'>
                          <div className='font-light'>Trạng thái</div>
                          <div className='mt-1'>
                            <Controller
                              name='Status'
                              control={control}
                              render={({ field: { ref, ...field }, fieldState }) => (
                                <SelectStatusWallet
                                  className='select-control'
                                  placeholder='Chọn trạng thái'
                                  onChange={(val) => field.onChange(val ? val.value : '')}
                                  value={field.value}
                                />
                              )}
                            />
                          </div>
                        </div>
                        <div>
                          <div className='font-light'>Ảnh Bill hóa đơn</div>
                          <div className='mt-1'>
                            <Controller
                              name='BillSrc'
                              control={control}
                              render={({ field, fieldState }) => (
                                <UploadFile
                                  size='xs'
                                  width='w-[130px]'
                                  height='h-[130px]'
                                  value={field.value}
                                  placeholder='Các tệp cho phép: png, jpg, jpeg.'
                                  onChange={field.onChange}
                                  errorMessageForce={fieldState?.invalid}
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>
                      <div className='flex justify-end p-5 border-t border-light'>
                        <button
                          type='button'
                          className='relative flex items-center h-12 px-5 transition border rounded shadow-lg border-light hover:border-gray-800 focus:outline-none focus:shadow-none'
                          onClick={onHide}
                        >
                          Đóng
                        </button>
                        <Button
                          disabled={updateMutation.isLoading}
                          loading={updateMutation.isLoading}
                          type='submit'
                          className='relative flex items-center h-12 px-5 ml-2 text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70'
                        >
                          Thực hiện
                        </Button>
                      </div>
                    </Dialog.Panel>
                  </m.div>
                </form>
              </Dialog>
            </LayoutGroup>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </>
  )
}

export default PickerFinish
