import moment from 'moment'
import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import ManageAPI from 'src/app/_ezs/api/manage.api'
import ReactBaseTable from 'src/app/_ezs/partials/table'
import { formatString } from 'src/app/_ezs/utils/formatString'
import Filter from './components/Filter'
import { useManage } from '../../ManageLayout'
import { useWindowSize } from '@uidotdev/usehooks'

function OrdersPage() {
  const { open, onHide } = useManage()

  const [filters, setFilters] = useState({
    key: '',
    pi: 1,
    ps: 20,
    from: '',
    to: '',
    status: '',
    MemberID: ''
  })

  const { width } = useWindowSize()

  const { data, isLoading, isPreviousData, refetch } = useQuery({
    queryKey: ['ListOrders', filters],
    queryFn: () => {
      return ManageAPI.getOrders({
        ...filters,
        MemberID: filters?.MemberID ? filters?.MemberID?.value : '',
        status: filters?.status ? filters?.status?.value : '',
        from: filters.from ? moment(filters.from).format('YYYY-MM-DD') : '',
        to: filters.to ? moment(filters.to).format('YYYY-MM-DD') : ''
      })
    },
    keepPreviousData: true
  })

  const columns = useMemo(
    () => [
      {
        key: 'ID',
        title: 'ID',
        dataKey: 'ID',
        cellRenderer: ({ rowData }) => rowData.ID,
        width: 100,
        sortable: false
      },
      {
        key: 'CreateDate',
        title: 'Ngày tạo',
        dataKey: 'CreateDate',
        cellRenderer: ({ rowData }) => moment(rowData?.CreateDate).format('DD-MM-YYYY'),
        width: 135,
        sortable: false
      },
      {
        key: 'StatusText',
        title: 'Trạng thái',
        dataKey: 'StatusText',
        cellRenderer: ({ rowData }) => (
          <>
            {rowData?.Status === 'finish' && (
              <span className='bg-success text-white px-2 py-1 rounded text-sm'>Hoàn thành</span>
            )}
            {rowData?.Status === 'cancel' && (
              <span className='bg-danger text-white px-2 py-1 rounded text-sm'>Hủy</span>
            )}
            {rowData?.Status === 'user_sent' && (
              <span className='bg-warning text-white px-2 py-1 rounded text-sm'>Đang xử lý</span>
            )}
          </>
        ),
        width: 135,
        sortable: false
      },
      {
        key: 'Member.FullName',
        title: 'Họ tên',
        dataKey: 'Member.FullName',
        width: 250,
        sortable: false
      },
      {
        key: 'Member.MobilePhone',
        title: 'Số điện thoại',
        dataKey: 'Member.MobilePhone',
        width: 150,
        sortable: false
      },
      {
        key: 'ToPay',
        title: 'Giá trị đơn hàng',
        dataKey: 'ToPay',
        cellRenderer: ({ rowData }) => formatString.formatVND(rowData?.ToPay),
        width: 200,
        sortable: false
      },
      {
        key: 'DIEM',
        title: 'Trừ từ điểm',
        dataKey: 'DIEM',
        cellRenderer: ({ rowData }) => formatString.formatPoint(rowData?.DIEM),
        width: 180,
        sortable: false
      },
      {
        key: 'TIEN',
        title: 'Trừ từ thẻ tiền',
        dataKey: 'TIEN',
        cellRenderer: ({ rowData }) => formatString.formatVND(rowData?.TIEN),
        width: 180,
        sortable: false
      },
      {
        key: 'ToPay-DIEM-TIEN',
        title: 'Thanh toán thêm',
        dataKey: 'ToPay-DIEM-TIEN',
        cellRenderer: ({ rowData }) => formatString.formatVND(rowData?.ToPay - rowData?.DIEM - rowData?.TIEN),
        width: 180,
        sortable: false
      },
      {
        key: 'RemainPay',
        title: 'Nợ',
        dataKey: 'RemainPay',
        cellRenderer: ({ rowData }) => formatString.formatVND(rowData?.RemainPay),
        width: 180,
        sortable: false
      },
      {
        key: '',
        title: '#',
        dataKey: '',
        width: 200,
        sortable: false,
        headerClassName: 'justify-center',
        frozen: width > 767 ? 'right' : false,
        cellRenderer: ({ rowData }) => (
          <div className='flex justify-center w-full'>
            <button
              type='button'
              className='bg-primary hover:bg-primaryhv text-white mx-[2px] rounded cursor-pointer px-3 py-3 transition text-[14px] flex items-center'
              onClick={() => {
                window.top.onReloadFrame = refetch
                window.top.location.hash = `orderid/${rowData?.ID}`
              }}
            >
              Chi tiết & Thanh toán
            </button>
          </div>
        )
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [width]
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

export default OrdersPage
