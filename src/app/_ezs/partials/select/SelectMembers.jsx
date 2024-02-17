import Select from 'react-select'
import MemberAPI from '../../api/member.api'
import { useQuery } from 'react-query'

const SelectMembers = ({ value, StockID = 0, isSome = false, errorMessage, errorMessageForce, ...props }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['ListMemberSelect'],
    queryFn: async () => {
      const { data } = await MemberAPI.memberSelect({
        Key: '',
        StockID: StockID || 0
      })
      return data?.data ? data?.data.map((x) => ({ ...x, label: x.text, value: x.id })) : []
    }
  })

  return (
    <>
      <Select
        key={StockID}
        isLoading={isLoading}
        value={
          isSome
            ? data && data.length > 0
              ? data.filter((x) => value && value.some((k) => k === x.value))
              : null
            : data && data.filter((x) => x.value === value)
        }
        classNamePrefix='select'
        options={data || []}
        placeholder='Chọn khách hàng'
        noOptionsMessage={() => 'Không có dữ liệu'}
        menuPortalTarget={document.body}
        menuPosition='fixed'
        styles={{
          menuPortal: (base) => ({
            ...base,
            zIndex: 9999
          })
        }}
        {...props}
      />
      {errorMessage && errorMessageForce && <div className='mt-1.5 text-sm text-danger'>{errorMessage}</div>}
    </>
  )
}

export { SelectMembers }
