import React, { useMemo } from 'react'
import Sidebar from '../../components/Sidebar'
import useQueryParams from 'src/app/_ezs/hooks/useQueryParams'
import { AdjustmentsVerticalIcon } from '@heroicons/react/24/outline'
import ReactBaseTable from 'src/app/_ezs/partials/table'
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { pickBy } from 'lodash-es'
import moment from 'moment'
import { useMutation, useQuery } from 'react-query'
import WalletsAPI from 'src/app/_ezs/api/wallet.api'
import { formatString } from 'src/app/_ezs/utils/formatString'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import PickerFinish from '../../components/PickerFinish'
import { toAbsolutePath } from 'src/app/_ezs/utils/assetPath'
import { useRoles } from 'src/app/_ezs/hooks/useRoles'
import { useAuth } from 'src/app/_ezs/core/Auth'
import { useWindowSize } from '@uidotdev/usehooks'

function WithdrawalHistoryPage(props) {
  const { duyet_xoa_rut_tien } = useRoles(['duyet_xoa_rut_tien'])
  const { pathname } = useLocation()
  const queryParams = useQueryParams()
  const navigate = useNavigate()
  const { width } = useWindowSize()
  const { auth } = useAuth()

  const queryConfig = {
    pi: queryParams.pi || 1,
    ps: queryParams.ps || 15,
    from: queryParams.from || '',
    to: queryParams.to || '',
    MemberID: queryParams.MemberID || '',
    Status: queryParams.Status || '',
    HasBill: queryParams.HasBill || false
  }

  const { data, isLoading, isPreviousData, refetch } = useQuery({
    queryKey: ['ListWalletHistory', queryConfig],
    queryFn: async () => {
      const newQueryConfig = {
        ...queryConfig,
        pi: Number(queryConfig.pi),
        ps: Number(queryConfig.ps),
        from: queryConfig.from ? moment(queryConfig.from).format('YYYY-MM-DD') : '', //2023-06-01
        to: queryConfig.to ? moment(queryConfig.to).format('YYYY-MM-DD') : '' //2023-06-30
      }
      let { data } = await WalletsAPI.list(newQueryConfig)
      return {
        lst: data?.lst || [],
        sum: data?.sum ? data?.sum[0] : null
      }
    },
    keepPreviousData: true
  })

  const deleteMutation = useMutation({
    mutationFn: (body) => WalletsAPI.deleteIdHistory(body)
  })

  const onDelete = (item) => {
    Swal.fire({
      customClass: {
        confirmButton: '!bg-danger'
      },
      title: 'Xác nhận xóa.',
      html: `Khi thực hiện xóa sẽ không thể khôi phục. Bạn chắc chắn muốn thực hiện xóa ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa ngay',
      cancelButtonText: 'Đóng',
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const data = await deleteMutation.mutateAsync({
          draw: {
            ID: item.ID
          }
        })
        await refetch()
        return data
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        toast.success('Xóa thành công.')
      }
    })
  }

  const columns = useMemo(
    () => [
      {
        key: 'CreateDate',
        title: 'Thời gian tạo',
        dataKey: 'CreateDate',
        cellRenderer: ({ rowData }) => moment(rowData?.CreateDate).format('HH:mm DD-MM-YYYY'),
        width: 170,
        sortable: false
      },
      {
        key: 'MemberName',
        title: 'Khách hàng',
        dataKey: 'MemberName',
        cellRenderer: ({ rowData }) => (
          <div>
            <div>{rowData.MemberName}</div>
            <div>{rowData.MemberPhone}</div>
          </div>
        ),
        width: 200,
        sortable: false
      },
      // {
      //   key: 'MemberPhone',
      //   title: 'Số điện thoại',
      //   dataKey: 'MemberPhone',
      //   width: 160,
      //   sortable: false
      // },
      {
        key: 'Value',
        title: 'Số tiền',
        dataKey: 'Value',
        width: 160,
        sortable: false,
        cellRenderer: ({ rowData }) => formatString.formatVND(rowData.Value)
      },
      {
        key: 'Banks',
        title: 'Thông tin số tài khoản',
        dataKey: 'Banks',
        width: 300,
        sortable: false,
        cellRenderer: ({ rowData }) => (
          <div>
            <div>Số tài khoản : {JSON.parse(rowData.Member.BankInfo).STK}</div>
            <div>Chủ tài khoản : {JSON.parse(rowData.Member.BankInfo).CTK}</div>
            <div>Ngân hàng : {JSON.parse(rowData.Member.BankInfo).NH}</div>
          </div>
        )
      },
      {
        key: 'Status',
        title: 'Trạng thái',
        dataKey: 'Status',
        width: 160,
        sortable: false,
        cellRenderer: ({ rowData }) =>
          rowData?.Status === 'HOAN_THANH' ? (
            <span className='text-success'>Hoàn thành</span>
          ) : (
            <span className='text-warning'>Đang chờ</span>
          )
      },
      {
        key: 'BillSrc',
        title: 'Ảnh hóa đơn',
        dataKey: 'BillSrc',
        width: 150,
        sortable: false,
        cellRenderer: ({ rowData }) => (
          <div>
            <a href={toAbsolutePath(rowData.BillSrc)} target='_blank' rel='noreferrer'>
              <img className='w-[100px]' src={toAbsolutePath(rowData.BillSrc)} alt='' />
            </a>
          </div>
        )
      },
      {
        key: '#',
        title: '#',
        dataKey: '#',
        width: 150,
        sortable: false,
        headerClassName: 'justify-center',
        cellRenderer: ({ rowData }) => (
          <div className='flex justify-center w-full'>
            {rowData.Status !== 'HOAN_THANH' && (
              <PickerFinish rowData={rowData}>
                {({ open }) => (
                  <button
                    type='button'
                    onClick={open}
                    className='bg-primary text-white mx-[3px] px-3 py-1.5 text-sm rounded font-medium'
                  >
                    Duyệt
                  </button>
                )}
              </PickerFinish>
            )}

            <button
              className='bg-danger text-white mx-[3px] px-3 py-1.5 text-sm rounded font-medium disabled:opacity-50'
              onClick={() => onDelete(rowData)}
              disabled={auth?.ID !== 1 && rowData.Status === 'HOAN_THANH'}
            >
              Xóa
            </button>
          </div>
        ),
        frozen: width > 767 ? 'right' : false,
        hidden: !duyet_xoa_rut_tien?.hasRight
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [duyet_xoa_rut_tien, width]
  )

  return (
    <div className='h-full flex'>
      <Sidebar defaultValues={queryConfig} />
      <div className='flex-1 flex flex-col h-full p-4'>
        <div className='flex items-center justify-between mb-4 flex-col md:flex-row'>
          <div className='text-2xl font-bold'>Danh sách rút tiền</div>
          <div className='flex items-center'>
            <div>
              Tổng : <span className='text-primary font-medium'>{formatString.formatVND(data?.sum['TONG'] || 0)}</span>
            </div>
            <div className='h-[12px] w-[1px] bg-black mx-3'></div>
            <div>
              Hoàn thành :
              <span className='text-success font-medium pl-1'>
                {formatString.formatVND(data?.sum['HOAN_THANH'] || 0)}
              </span>
            </div>
            <div className='h-[12px] w-[1px] bg-black mx-3'></div>
            <div>
              Chưa hoàn thành :
              <span className='text-warning font-medium pl-1'>
                {formatString.formatVND(data?.sum['KO_HOAN_THANH'] || 0)}
              </span>
            </div>
            {/* <PickerFilters defaultValues={queryConfig}>
              {({ open }) => (
                <button
                  onClick={open}
                  type='button'
                  className='border rounded transition hover:border-black bg-white border-[#d5d7da] h-12 flex items-center justify-center px-3 lg:hidden'
                >
                  <span className='hidden md:inline-block pr-1.5'>Bộ lọc</span>
                  <AdjustmentsVerticalIcon className='w-6' />
                </button>
              )}
            </PickerFilters> */}

            {/* <PickerMember>
              {({ open }) => (
                <button
                  onClick={open}
                  type='button'
                  className='flex items-center justify-center h-12 px-5 ml-2 text-white transition border rounded bg-primary border-primary hover:bg-primaryhv hover:border-primaryhv'
                >
                  Thêm mới
                </button>
              )}
            </PickerMember> */}
          </div>
        </div>
        <ReactBaseTable
          pagination
          wrapClassName='grow'
          rowKey='ID'
          columns={columns}
          data={data?.lst || []}
          estimatedRowHeight={96}
          isPreviousData={isPreviousData}
          loading={isLoading || isPreviousData}
          pageCount={data?.data?.pcount}
          pageOffset={Number(queryConfig.pi)}
          pageSizes={Number(queryConfig.ps)}
          onChange={({ pageIndex, pageSize }) =>
            navigate({
              pathname: pathname,
              search: createSearchParams(
                pickBy(
                  {
                    ...queryConfig,
                    pi: pageIndex,
                    ps: pageSize
                  },
                  (v) => v
                )
              ).toString()
            })
          }
        />
      </div>
    </div>
  )
}

export default WithdrawalHistoryPage
