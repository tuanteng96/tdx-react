import Select from 'react-select'
import { useQuery } from 'react-query'
import ManageAPI from '../../api/manage.api'

function SelectDistrict({ ProvinceID, errorMessage, errorMessageForce, ...props }) {
  const { data, isLoading } = useQuery({
    queryKey: ['ListDistrict', ProvinceID],
    queryFn: async () => {
      const { data } = await ManageAPI.getDistrict({ ProvinceID })
      return data?.lst ? data?.lst.map((x) => ({ ...x, label: x.Title, value: x.ID })) : []
    },
    enabled: Boolean(Number(ProvinceID) > 0)
  })

  return (
    <>
      <Select
        key={ProvinceID}
        isLoading={isLoading}
        classNamePrefix='select'
        options={data || []}
        placeholder='Chọn Quận / Huyện'
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

export { SelectDistrict }
