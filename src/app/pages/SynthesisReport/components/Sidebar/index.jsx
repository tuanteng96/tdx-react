import { XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import moment from 'moment'
import { Controller, useForm } from 'react-hook-form'
import { Button } from 'src/app/_ezs/partials/button'
import { InputDatePicker } from 'src/app/_ezs/partials/forms/input/InputDatePicker'
import { SelectMembers } from 'src/app/_ezs/partials/select'

function Sidebar({ defaultValues, onExport, loading, onChange, onHide, isFilter }) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      ...defaultValues,
      from: defaultValues.from ? moment(defaultValues.from).toDate() : '',
      to: defaultValues.to ? moment(defaultValues.to).toDate() : '',
      MemberID: defaultValues.MemberID ? Number(defaultValues.MemberID) : ''
    }
  })

  const onSubmit = (values) => {
    const newQueryConfig = {
      ...values,
      From: values.From ? moment(values.From).format('YYYY-MM-DD') : '',
      To: values.To ? moment(values.To).format('YYYY-MM-DD') : '',
      Status: values.Status,
      pi: 1,
      ps: 20
    }
    onChange(newQueryConfig)
  }

  const onResetFilters = () => {
    onChange({
      pi: 1,
      ps: 20,
      MemberID: '',
      Include: false
    })
    reset({
      pi: 1,
      ps: 20,
      MemberID: '',
      Include: false
    })
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={clsx(
          'h-full bg-white w-[320px] lg:flex flex-col absolute md:relative top-0 left-0 z-50',
          isFilter ? 'flex' : 'hidden'
        )}
      >
        <div className='relative flex justify-between px-5 py-5 border-b border-light'>
          <div className='text-2xl font-bold'>Bộ lọc</div>
          <div
            className='absolute md:hidden flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4'
            onClick={onHide}
          >
            <XMarkIcon className='w-8' />
          </div>
        </div>
        <div className='p-5 overflow-auto grow'>
          <div className='mb-3.5 grid grid-cols-1'>
            <div className='mb-3.5'>
              <div className='font-light'>Từ ngày</div>
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
              <div className='font-light'>Đến ngày</div>
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
          <div className='mb-3.5'>
            <div className='font-light'>Khách hàng</div>
            <div className='mt-1'>
              <Controller
                name='MemberID'
                control={control}
                render={({ field: { ref, ...field }, fieldState }) => (
                  <SelectMembers
                    isClearable
                    className='select-control'
                    value={field.value}
                    onChange={(val) => field.onChange(val?.value || '')}
                  />
                )}
              />
            </div>
          </div>
          {/* <div>
          <div className='font-light'>Trạng thái</div>
          <div className='mt-1'>
            <Controller
              name='Status'
              control={control}
              render={({ field: { ref, ...field }, fieldState }) => (
                <SelectStatusWallet
                  isClearable
                  className='select-control'
                  placeholder='Chọn trạng thái'
                  onChange={(val) => field.onChange(val ? val.value : '')}
                  value={field.value}
                />
              )}
            />
          </div>
        </div> */}
          {/* <div>
          <Controller
            name='HasBill'
            control={control}
            render={({ field: { ref, ...field }, fieldState }) => (
              <Checkbox
                labelClassName='pl-2.5'
                labelText='Đã có ảnh Bill'
                htmlFor='HasBill'
                {...field}
                checked={field.value}
              />
            )}
          />
        </div> */}
        </div>
        <div className='flex items-center justify-between p-5 border-t border-light'>
          <button
            className='relative flex items-center h-12 px-2 transition border rounded border-light hover:border-success focus:outline-none cursor-pointer text-success disabled:opacity-50'
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
            className='cursor-pointer text-info hover:border-black bg-white border border-[#d5d7da] h-12 px-2 ml-2 rounded flex items-center justify-center'
            onClick={onResetFilters}
          >
            Xóa bộ lọc
          </div>
          <Button
            type='submit'
            className='relative flex items-center justify-center h-12 px-2 ml-2 text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70 flex-1 truncate'
            loading={loading}
            hideText={loading}
          >
            Thực hiện
          </Button>
        </div>
      </form>
      {isFilter && (
        <div className='md:hidden absolute z-30 bg-black/[.2] top-0 left-0 w-full h-full' onClick={onHide}></div>
      )}
    </>
  )
}

export default Sidebar
