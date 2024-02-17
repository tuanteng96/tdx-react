import { pickBy } from 'lodash-es'
import moment from 'moment'
import { Controller, useForm } from 'react-hook-form'
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { Button } from 'src/app/_ezs/partials/button'
import { InputDatePicker } from 'src/app/_ezs/partials/forms/input/InputDatePicker'
import { SelectMembers, SelectStatusWallet } from 'src/app/_ezs/partials/select'
import { Checkbox } from 'src/app/_ezs/partials/forms'

function Sidebar({ defaultValues }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      ...defaultValues,
      Status: defaultValues?.Status,
      from: defaultValues.from ? moment(defaultValues.from).toDate() : '',
      to: defaultValues.to ? moment(defaultValues.to).toDate() : '',
      MemberID: defaultValues.MemberID ? Number(defaultValues.MemberID) : ''
    }
  })

  const onSubmit = async (values) => {
    const newQueryConfig = {
      ...values,
      From: values.From ? moment(values.From).format('YYYY-MM-DD') : '',
      To: values.To ? moment(values.To).format('YYYY-MM-DD') : '',
      Status: values.Status,
      pi: 1,
      ps: 15
    }
    navigate({
      pathname: pathname,
      search: createSearchParams(pickBy(newQueryConfig, (v) => v)).toString()
    })
  }

  const onResetFilters = () => {
    navigate({
      pathname: pathname,
      search: createSearchParams(
        pickBy(
          {
            pi: 1,
            ps: 15,
            from: new Date(),
            to: new Date(),
            HasBill: false
          },
          (v) => v
        )
      ).toString()
    })
    reset({
      pi: 1,
      ps: 15,
      from: new Date(),
      to: new Date(),
      MemberID: '',
      Status: '',
      HasBill: false
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='h-full bg-white w-[320px] hidden lg:flex flex-col'>
      <div className='relative flex justify-between px-5 py-5 border-b border-light'>
        <div className='text-2xl font-bold'>Bộ lọc</div>
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
        <div>
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
        </div>
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
        <div
          className='cursor-pointer text-info hover:border-black bg-white border border-[#d5d7da] h-12 px-3 rounded flex items-center justify-center'
          onClick={onResetFilters}
        >
          Xóa bộ lọc
        </div>
        <Button
          type='submit'
          className='relative flex items-center justify-center h-12 px-5 ml-3 text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70 flex-1'
        >
          Thực hiện
        </Button>
      </div>
    </form>
  )
}

export default Sidebar
