import Select from 'react-select'
import { useQuery } from 'react-query'
import ManageAPI from '../../api/manage.api'

function SelectWard({ ProvinceID, DistrictID, errorMessage, errorMessageForce, ...props }) {
  const { data, isLoading } = useQuery({
    queryKey: ['ListWard', DistrictID],
    queryFn: async () => {
      const { data } = await ManageAPI.getWard({ ProvinceID, DistrictID })
      return data?.lst ? data?.lst.map((x) => ({ ...x, label: x.Title, value: x.ID })) : []
    },
    enabled: Boolean(Number(DistrictID) > 0)
  })

  return (
    <>
      <Select
        key={ProvinceID}
        isLoading={isLoading}
        classNamePrefix='select'
        options={data || []}
        placeholder='Chọn Phường / Xã'
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

export { SelectWard }
