import Select from 'react-select'
import { useQuery } from 'react-query'
import ManageAPI from '../../api/manage.api'

function SelectProvince({ errorMessage, errorMessageForce, ...props }) {
  const { data, isLoading } = useQuery({
    queryKey: ['ListProvince'],
    queryFn: async () => {
      const { data } = await ManageAPI.getProvince()
      return data?.lst ? data?.lst.map((x) => ({ ...x, label: x.Title, value: x.ID })) : []
    }
  })

  return (
    <>
      <Select
        isLoading={isLoading}
        classNamePrefix='select'
        options={data || []}
        placeholder='Chọn Tỉnh / Thành phố'
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

export { SelectProvince }
