import Select from 'react-select'

const StatusList = [
  {
    label: 'Đang chờ',
    value: 'DANG_CHO'
  },
  {
    label: 'Hoàn thành',
    value: 'HOAN_THANH'
  }
]

function SelectStatusWallet({ value, ...props }) {
  return (
    <Select
      classNamePrefix='select'
      options={StatusList}
      placeholder='Chọn trạng thái'
      value={value ? StatusList.filter((x) => x.value === value) : null}
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
  )
}

export { SelectStatusWallet }
