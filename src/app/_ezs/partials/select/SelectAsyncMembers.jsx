import MemberAPI from '../../api/member.api'
import AsyncSelect from 'react-select/async'

const SelectAsyncMembers = ({ StockID = 0, errorMessage, errorMessageForce, ...props }) => {
  const promiseOptions = (inputValue) =>
    new Promise((resolve) => {
      MemberAPI.memberSelect({
        Key: inputValue,
        StockID: StockID || 0
      }).then(({ data }) => {
        resolve(data?.data ? data?.data.map((x) => ({ ...x, label: x.text + ' - ' + x.suffix, value: x.id })) : [])
      })
    })

  return (
    <>
      <AsyncSelect
        cacheOptions
        defaultOptions
        loadOptions={promiseOptions}
        classNamePrefix='select'
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

export { SelectAsyncMembers }
