import moment from 'moment'
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import ManageAPI from 'src/app/_ezs/api/manage.api'
import ReactBaseTable from 'src/app/_ezs/partials/table'
import { formatString } from 'src/app/_ezs/utils/formatString'
import Filter from './components/Filter'
import { useManage } from '../../ManageLayout'
import { useWindowSize } from '@uidotdev/usehooks'

const RenderFooter = forwardRef((props, ref) => {
  const { data } = props
  const refElm = useRef()
  useImperativeHandle(ref, () => ({
    getRef() {
      return refElm
    }
  }))

  return (
    <div className='h-full flex border-l border-l-[#eee] overflow-auto' id='el-footer' ref={refElm}>
      <div className='w-[150px] min-w-[150px] border-r border-r-[#eee]'></div>
      <div className='w-[200px] min-w-[200px] border-r border-r-[#eee] flex items-center font-bold px-3.5'>
        {formatString.formatVND(data?.THU_TM)}
      </div>
      <div className='w-[200px] min-w-[200px] border-r border-r-[#eee] flex items-center font-bold px-3.5'>
        {formatString.formatVND(data?.THU_CK)}
      </div>
      <div className='w-[200px] min-w-[200px] border-r border-r-[#eee] flex items-center font-bold px-3.5 text-success'>
        {formatString.formatVND(data?.TONG_THU)}
      </div>
    </div>
  )
})

function RosesPage() {
  const { open, onHide } = useManage()

  const [filters, setFilters] = useState({
    pi: 1,
    ps: 20,
    DateStart: '',
    DateEnd: '',
    CustomType: '',
    PaymentMethods: '',
    StockID: '',
    TagsTC: '',
    TypeTC: ''
  })

  const { width } = useWindowSize()
  const childCompRef = useRef()

  const { data, isLoading, isPreviousData, refetch } = useQuery({
    queryKey: ['ListOrders', filters],
    queryFn: async () => {
      let { data } = await ManageAPI.getRoses({
        ...filters,
        Pi: filters.pi,
        Ps: filters.ps,
        DateStart: filters.DateStart ? moment(filters.DateStart).format('DD/MM/YYYY') : '',
        DateEnd: filters.DateEnd ? moment(filters.DateEnd).format('DD/MM/YYYY') : ''
      })
      return data?.result
    },
    keepPreviousData: true
  })
  const columns = useMemo(
    () => [
      {
        key: 'CreateDate',
        title: 'Ngày tạo',
        dataKey: 'CreateDate',
        cellRenderer: ({ rowData }) => moment(rowData?.CreateDate).format('DD-MM-YYYY'),
        width: 150,
        sortable: false,
        footerRenderer: () => <div>a</div>
      },
      {
        key: 'TM',
        title: 'Tiền mặt',
        dataKey: 'TM',
        cellRenderer: ({ rowData }) => formatString.formatVNDPositive(rowData.TM),
        width: 200,
        sortable: false
      },
      {
        key: 'CK',
        title: 'Chuyển khoản',
        dataKey: 'CK',
        cellRenderer: ({ rowData }) => formatString.formatVNDPositive(rowData.CK),
        width: 200,
        sortable: false
      },
      {
        key: 'TT',
        title: 'Tổng thanh toán',
        dataKey: 'TT',
        cellRenderer: ({ rowData }) =>
          formatString.formatVNDPositive(Math.abs(rowData.CK) + Math.abs(rowData.QT) + Math.abs(rowData.TM)),
        width: 200,
        sortable: false
      },
      {
        key: 'Content',
        title: 'Nội dung',
        dataKey: 'Content',
        cellRenderer: ({ rowData }) => <div>{rowData.Content}</div>,
        width: 300,
        sortable: false
      },
      {
        key: 'Member.FullName',
        title: 'Khách hàng',
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
        rowKey='Id'
        columns={columns}
        data={data?.Items || []}
        estimatedRowHeight={96}
        isPreviousData={isPreviousData}
        loading={isLoading || isPreviousData}
        pageCount={data?.PCount}
        pageOffset={Number(filters.pi)}
        pageSizes={Number(filters.ps)}
        onChange={({ pageIndex, pageSize }) => {
          setFilters((prevState) => ({
            ...prevState,
            pi: pageIndex,
            ps: pageSize
          }))
        }}
        onScroll={({ scrollLeft }) => {
          const el = childCompRef.current.getRef()
          if (el?.current) {
            console.log(el.current.scrollLeft)
            el.current.scrollLeft = scrollLeft
          }
        }}
        footerHeight={50}
        footerRenderer={<RenderFooter ref={childCompRef} data={data} />}
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

export default RosesPage
