import moment from 'moment'
import { useMemo, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { toast } from 'react-toastify'
import ConfigAPI from 'src/app/_ezs/api/config.api'
import ManageAPI from 'src/app/_ezs/api/manage.api'
import { Popover } from 'src/app/_ezs/partials/popover'
import ReactBaseTable from 'src/app/_ezs/partials/table'
import { formatString } from 'src/app/_ezs/utils/formatString'
import Swal from 'sweetalert2'
import Filter from './components/Filter'
import { useManage } from '../../ManageLayout'
import PickerWallet from './components/PickerWallet'
import PickerCard from './components/PickerCard'
import PickerPoint from './components/PickerPoint'
import { useWindowSize } from '@uidotdev/usehooks'
import { LockClosedIcon } from '@heroicons/react/24/outline'
import { useRoles } from 'src/app/_ezs/hooks/useRoles'

function MembersPage() {
  const { adminTools } = useRoles(['adminTools'])
  const { open, onHide } = useManage()
  const [filters, setFilters] = useState({
    pi: 1,
    ps: 20,
    key: '',
    frootid: 0,
    ProvinceID: '',
    DistrictID: '',
    WardID: '',
    FActive: '',
    from: '',
    to: ''
  })

  const { width } = useWindowSize()

  const Packages = useQuery({
    queryKey: ['Packages', filters],
    queryFn: async () => {
      let { data } = await ConfigAPI.getName('tdx_reg_money')
      let Package = []
      if (data?.data) {
        let { Value } = data?.data[0]
        let ValueSplit = Value.split(';')
        for (const k of ValueSplit) {
          Package.push(Number(k.split(':')[0]))
        }
      }
      return Package || []
    },
    keepPreviousData: true
  })

  const { data, isLoading, isPreviousData, refetch } = useQuery({
    queryKey: ['ListMembers', filters],
    queryFn: () => {
      return ManageAPI.getMembers({
        ...filters,
        ProvinceID: filters?.ProvinceID ? filters?.ProvinceID?.value : '',
        DistrictID: filters?.DistrictID ? filters?.DistrictID?.value : '',
        WardID: filters?.WardID ? filters?.WardID?.value : '',
        FActive: filters?.FActive ? filters?.FActive?.value : '',
        from: filters.from ? moment(filters.from).format('YYYY-MM-DD') : '',
        to: filters.to ? moment(filters.to).format('YYYY-MM-DD') : ''
      })
    },
    keepPreviousData: true
  })

  const activedMutation = useMutation({
    mutationFn: (body) => ManageAPI.FActive(body)
  })

  const resetPwdMutation = useMutation({
    mutationFn: (body) => ManageAPI.resetPwdMember(body)
  })

  const onChangeActived = ({ Mid, Value }) => {
    Swal.fire({
      customClass: {
        confirmButton: '!bg-success'
      },
      title: 'Kích hoạt tài khoản',
      html: `Gói <span class="font-bold">${formatString.formatVND(
        Value
      )}</span> sẽ được kích hoạt cho ID <span class="font-bold">#${Mid}</span>. Xác nhận kích hoạt ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Kích hoạt ngay',
      cancelButtonText: 'Đóng',
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const data = await activedMutation.mutateAsync({
          Mid,
          Value
        })
        await refetch()
        return data
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        toast.success('Kích hoạt thành công.')
      }
    })
  }

  const onResetPassword = (rowData) => {
    Swal.fire({
      title: 'Nhật mật khẩu bảo mật',
      input: 'password',
      inputLabel: 'Bạn cần nhập mật khẩu bảo mật trước khi thực hiện reset mật khẩu.',
      inputPlaceholder: 'Nhập mật khẩu',
      inputAttributes: {
        maxlength: '10',
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      cancelButtonText: 'Đóng',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      preConfirm: async (value) => {
        if (value !== '9@0!') {
          return Swal.showValidationMessage(`Mật khẩu không chính xác`)
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          customClass: {
            confirmButton: '!bg-success'
          },
          title: 'Reset mật khẩu',
          html: `Khách hàng <span class="font-bold">${rowData.FullName} - ${rowData.MobilePhone}</span> sẽ được reset mật khẩu. Xác nhận reset ?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Reset Mật khẩu',
          cancelButtonText: 'Đóng',
          reverseButtons: true,
          showLoaderOnConfirm: true,
          preConfirm: async () => {
            var bodyFormData = new FormData()
            bodyFormData.append('cmd', 'setpwd_member')
            bodyFormData.append('MemberID', rowData.ID)

            const data = await resetPwdMutation.mutateAsync(bodyFormData)
            await refetch()
            return data
          },
          allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              icon: 'success',
              html: `<div class="text-[18px]"><div class="mb-3">Khách hàng <span class="font-bold">${rowData.FullName} - ${rowData.MobilePhone}</span> đã được reset mật khẩu.</div>Mật khẩu mới : <span class="text-danger font-bold">${result?.value?.data?.newpass}</span></div>`
            })
          }
        })
      }
    })
    
  }

  const columns = useMemo(
    () => [
      // {
      //   key: 'ID',
      //   title: 'ID',
      //   dataKey: 'ID',
      //   cellRenderer: ({ rowData }) => rowData.ID,
      //   width: 100,
      //   sortable: false
      // },
      {
        key: 'CreateDate',
        title: 'Ngày tạo',
        dataKey: 'CreateDate',
        cellRenderer: ({ rowData }) => moment(rowData?.CreateDate).format('DD-MM-YYYY'),
        width: 135,
        sortable: false
      },
      {
        key: 'FullName',
        title: 'Họ tên',
        dataKey: 'FullName',
        cellRenderer: ({ rowData }) => (
          <div>
            <div>
              [{rowData.ID}] {rowData.FullName}
            </div>
            <div>{rowData?.MobilePhone}</div>
            <div>
              {rowData.HomeAddress}
              <div>
                {rowData?.WardTitle} - {rowData?.DistrictTitle} - {rowData?.ProvinceTitle}
              </div>
            </div>
          </div>
        ),
        width: 280,
        sortable: false
      },
      // {
      //   key: 'MobilePhone',
      //   title: 'Số điện thoại',
      //   dataKey: 'MobilePhone',
      //   width: 150,
      //   sortable: false
      // },
      {
        key: 'Gender',
        title: 'Giới tính',
        dataKey: 'Gender',
        cellRenderer: ({ rowData }) => (rowData.Gender === 1 ? 'Nam' : rowData.Gender === 0 ? 'Nữ' : 'Chưa xác định'),
        width: 100,
        sortable: false
      },
      // {
      //   key: 'HomeAddress',
      //   title: 'Địa chỉ',
      //   dataKey: 'HomeAddress',
      //   cellRenderer: ({ rowData }) => (
      //     <div>
      //       {rowData.HomeAddress}
      //       <div>
      //         {rowData?.WardTitle} - {rowData?.DistrictTitle} - {rowData?.ProvinceTitle}
      //       </div>
      //     </div>
      //   ),
      //   width: 320,
      //   sortable: false
      // },
      {
        key: 'His',
        title: 'Trạng thái',
        dataKey: 'His',
        cellRenderer: ({ rowData }) =>
          rowData?.FActive === 1 ? (
            <span className='bg-success text-white px-2 py-1 rounded text-sm'>Đã kích hoạt</span>
          ) : (
            <span className='bg-danger text-white px-2 py-1 rounded text-sm'>Chưa kích hoạt</span>
          ),
        width: 135,
        sortable: false
      },
      {
        key: 'MoneyKinds.Vi',
        title: 'Ví',
        dataKey: 'MoneyKinds.Vi',
        headerClassName: '!px-[12px] !py-[15px]',
        cellRenderer: ({ rowData }) => (
          <PickerWallet rowData={rowData} data={rowData?.MoneyKinds?.['[Ví]'] || []}>
            {({ open }) => (
              <div onClick={open} className='px-[12px] py-[15px] w-full h-full flex items-center'>
                {formatString.formatVND(rowData.MoneyKinds['Ví'] || 0)}
              </div>
            )}
          </PickerWallet>
        ),
        width: 150,
        sortable: false,
        style: {
          fontWeight: 600,
          cursor: 'pointer',
          padding: 0
        }
      },
      {
        key: 'MoneyKinds.["Kích hoạt tài khoản "]',
        title: 'Thẻ tiền',
        dataKey: 'MoneyKinds.["Kích hoạt tài khoản "]',
        headerClassName: '!px-[12px] !py-[15px]',
        cellRenderer: ({ rowData }) => (
          <PickerCard rowData={rowData} data={rowData?.MoneyKinds?.['[Kích hoạt tài khoản ]'] || []}>
            {({ open }) => (
              <div onClick={open} className='px-[12px] py-[15px]'>
                {formatString.formatVND(rowData.MoneyKinds['Kích hoạt tài khoản '] || 0)}
              </div>
            )}
          </PickerCard>
        ),
        width: 150,
        sortable: false,
        style: {
          fontWeight: 600,
          cursor: 'pointer',
          padding: 0
        }
      },
      {
        key: 'MoneyKinds.["Tặng điểm"]',
        title: 'Điểm',
        dataKey: 'MoneyKinds.["Tặng điểm"]',
        headerClassName: '!px-[12px] !py-[15px]',
        cellRenderer: ({ rowData }) => (
          <PickerPoint rowData={rowData} data={rowData?.MoneyKinds?.['[Tặng điểm]'] || []}>
            {({ open }) => (
              <div onClick={open} className='px-[12px] py-[15px]'>
                {formatString.formatPoint(rowData.MoneyKinds['Tặng điểm'] || 0)}
              </div>
            )}
          </PickerPoint>
        ),
        width: 150,
        sortable: false,
        style: {
          fontWeight: 600,
          cursor: 'pointer',
          padding: 0
        }
      },
      {
        key: '',
        title: '#',
        dataKey: '',
        width: 180,
        sortable: false,
        headerClassName: 'justify-center',
        frozen: width > 767 ? 'right' : false,
        cellRenderer: ({ rowData }) => (
          <div className='flex justify-center w-full'>
            {rowData?.FActive !== 1 && (
              <>
                {Packages && Packages?.data?.length > 1 && (
                  <Popover>
                    {({ onClose }) => (
                      <div className='bg-white shadow-lg py-2.5 min-w-[150px]'>
                        {Packages?.data?.map((x, i) => (
                          <div
                            key={i}
                            className='text-[#3f4254] py-2.5 px-3 hover:bg-[#f3f6f9] cursor-pointer'
                            onClick={() => {
                              onClose()
                              onChangeActived({
                                Value: x,
                                Mid: rowData.ID
                              })
                            }}
                          >
                            Gói {formatString.formatVND(x)}
                          </div>
                        ))}
                      </div>
                    )}
                  </Popover>
                )}
                {Packages &&
                  Packages?.data?.length === 1 &&
                  Packages?.data?.map((x, i) => (
                    <button
                      key={i}
                      type='button'
                      className='bg-primary hover:bg-primaryhv text-white mx-[2px] rounded cursor-pointer px-4 py-3 transition text-[14px] flex items-center'
                      onClick={() =>
                        onChangeActived({
                          Value: x,
                          Mid: rowData.ID
                        })
                      }
                    >
                      Kích hoạt
                    </button>
                  ))}
              </>
            )}
            <button
              type='button'
              className='bg-success hover:bg-successhv text-white mx-[2px] rounded cursor-pointer px-3 py-3 transition text-[14px] flex items-center'
              onClick={() => onResetPassword(rowData)}
            >
              <LockClosedIcon className='w-6' />
            </button>
          </div>
        ),
        hidden: !adminTools?.hasRight
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [Packages, width, adminTools]
  )

  return (
    <div className='h-full p-4 flex flex-col'>
      <ReactBaseTable
        pagination
        wrapClassName='grow'
        rowKey='ID'
        columns={columns}
        data={data?.data?.lst || []}
        estimatedRowHeight={96}
        isPreviousData={isPreviousData}
        loading={isLoading || isPreviousData}
        pageCount={data?.data?.pCount}
        pageOffset={Number(filters.pi)}
        pageSizes={Number(filters.ps)}
        onChange={({ pageIndex, pageSize }) => {
          setFilters((prevState) => ({
            ...prevState,
            pi: pageIndex,
            ps: pageSize
          }))
        }}
      />
      <Filter
        initialValues={filters}
        visible={open}
        onHide={onHide}
        onSubmit={(values) => {
          setFilters((prevState) => ({
            ...prevState,
            ...values,
            pi: 1
          }))
          onHide()
        }}
        onReset={() => {
          setFilters({ pi: 1, ps: 20, key: '', frootid: 0 })
          onHide()
        }}
      />
    </div>
  )
}

export default MembersPage
