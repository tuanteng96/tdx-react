import moment from 'moment'
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import ManageAPI from 'src/app/_ezs/api/manage.api'
import ReactBaseTable from 'src/app/_ezs/partials/table'
import { formatString } from 'src/app/_ezs/utils/formatString'
import Filter from './components/Filter'
import { useManage } from '../../ManageLayout'
import { useWindowSize } from '@uidotdev/usehooks'
import { NavLink } from 'react-router-dom'
import { toast } from 'react-toastify'
import { dataToExcel } from 'src/app/_ezs/core/SpreadJSExcel'

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
      <div className='w-[260px] min-w-[260px] border-r border-r-[#eee]'></div>
      <div className='w-[160px] min-w-[160px] border-r border-r-[#eee] flex items-center font-bold px-3.5'>
        {formatString.formatVND(data?.THU_TM)}
      </div>
      <div className='w-[160px] min-w-[160px] border-r border-r-[#eee] flex items-center font-bold px-3.5'>
        {formatString.formatVND(data?.THU_CK)}
      </div>
      <div className='w-[160px] min-w-[160px] border-r border-r-[#eee] flex items-center font-bold px-3.5 text-success'>
        {formatString.formatVND(data?.TONG_THU)}
      </div>
      <div className='w-[550px] min-w-[550px] border-r border-r-[#eee] flex items-center px-3.5'>
        Tồn quỹ đến hiện tại :
        <span className='text-primary font-bold pl-2'>{formatString.formatVND(data?.ton_quy)}</span>
      </div>
    </div>
  )
})

function RosesPage() {
  const { open, onHide } = useManage()

  const [filters, setFilters] = useState({
    pi: 1,
    ps: 20,
    DateStart: moment().subtract(2, 'days').toDate(),
    DateEnd: moment().toDate(),
    CustomType: '',
    PaymentMethods: '',
    StockID: '',
    TagsTC: '',
    TypeTC: '',
    MemberID: '',
    TypePayment: ''
  })

  const { width } = useWindowSize()
  const childCompRef = useRef()

  const { data, isLoading, isPreviousData } = useQuery({
    queryKey: ['ListOrders', filters],
    queryFn: async () => {
      let { data } = await ManageAPI.getRoses({
        ...filters,
        Pi: filters.pi,
        Ps: filters.ps,
        DateStart: filters.DateStart ? moment(filters.DateStart).format('DD/MM/YYYY') : '',
        DateEnd: filters.DateEnd ? moment(filters.DateEnd).format('DD/MM/YYYY') : '',
        MemberID: filters.MemberID ? filters.MemberID.value : '',
        TypePayment: filters.TypePayment?.value || ''
      })
      return data?.result
    },
    keepPreviousData: true
  })

  const excelMutation = useMutation({
    mutationFn: (body) => ManageAPI.getRoses(body)
  })

  const onExport = () => {
    if (data?.Total) {
      excelMutation.mutate(
        {
          ...filters,
          DateStart: filters.DateStart ? moment(filters.DateStart).format('DD/MM/YYYY') : '',
          DateEnd: filters.DateEnd ? moment(filters.DateEnd).format('DD/MM/YYYY') : '',
          MemberID: filters.MemberID ? filters.MemberID.value : '',
          TypePayment: filters.TypePayment?.value || '',
          pi: 1,
          ps: data?.Total
        },
        {
          onSuccess: ({ data }) => {
            if (data?.result?.Total) {
              dataToExcel(`Báo cáo tiền`, (sheet, workbook) => {
                workbook.suspendPaint()
                workbook.suspendEvent()
                let HeadTable = [
                  'NGÀY TẠO',
                  'ID ĐƠN HÀNG',
                  'TIỀN MẶT',
                  'CHUYỂN KHOẢN',
                  'TỔNG THANH TOÁN',
                  'NỘI DUNG',
                  'KHÁCH HÀNG',
                  'SỐ ĐIỆN THOẠI'
                ]
                var Response = [HeadTable]

                for (let rowData of data?.result?.Items) {
                  let newArr = [
                    moment(rowData?.CreateDate).format('DD-MM-YYYY'),
                    rowData.SourceID,
                    rowData.TM,
                    rowData.CK,
                    Math.abs(rowData.CK) + Math.abs(rowData.QT) + Math.abs(rowData.TM),
                    rowData.Content,
                    rowData?.Member?.FullName,
                    rowData?.Member?.MobilePhone
                  ]
                  Response.push(newArr)
                }

                Response.push([
                  '',
                  '',
                  data?.result?.THU_TM,
                  data?.result?.THU_CK,
                  data?.result?.TONG_THU,
                  `Tồn quỹ đến hiện tại : ${formatString.formatVND(data?.result?.ton_quy)}`,
                  '',
                  ''
                ])

                let TotalColumn = HeadTable.length
                let TotalRow = Response.length

                sheet.setArray(2, 0, Response)

                //title
                workbook.getActiveSheet().getCell(0, 0).value(`Danh sách tiền (${data?.result?.Total})`)
                workbook.getActiveSheet().getCell(0, 0).font('18pt Arial')
                workbook
                workbook.getActiveSheet().getRange(2, 0, 1, TotalColumn).font('12pt Arial')
                workbook.getActiveSheet().getRange(2, 0, 1, TotalColumn).backColor('#E7E9EB')
                //border
                var border = new window.GC.Spread.Sheets.LineBorder()
                border.color = '#000'
                border.style = window.GC.Spread.Sheets.LineStyle.thin
                workbook.getActiveSheet().getRange(2, 0, TotalRow, TotalColumn).borderLeft(border)
                workbook.getActiveSheet().getRange(2, 0, TotalRow, TotalColumn).borderRight(border)
                workbook.getActiveSheet().getRange(2, 0, TotalRow, TotalColumn).borderBottom(border)
                workbook.getActiveSheet().getRange(2, 0, TotalRow, TotalColumn).borderTop(border)
                //filter
                var cellrange = new window.GC.Spread.Sheets.Range(3, 0, 1, TotalColumn)
                var hideRowFilter = new window.GC.Spread.Sheets.Filter.HideRowFilter(cellrange)
                workbook.getActiveSheet().rowFilter(hideRowFilter)

                //format number
                workbook.getActiveSheet().getCell(2, 0).hAlign(window.GC.Spread.Sheets.HorizontalAlign.center)

                //auto fit width and height
                workbook.getActiveSheet().autoFitRow(TotalRow + 2)
                workbook.getActiveSheet().autoFitRow(0)
                for (let i = 1; i < TotalColumn; i++) {
                  workbook.getActiveSheet().autoFitColumn(i)
                }

                for (let i = 1; i < TotalRow + 2; i++) {
                  workbook.getActiveSheet().setFormatter(i, 2, '#,#')
                  workbook.getActiveSheet().setFormatter(i, 3, '#,#')
                  workbook.getActiveSheet().setFormatter(i, 4, '#,#')

                  sheet.getRange(i, 5, 1, 1).wordWrap(true)
                  sheet.autoFitRow(i)
                }

                workbook.resumePaint()
                workbook.resumeEvent()
              })
            } else {
              toast.error('Không thể xuất Excel do dữ liệu trống hoặc lỗi')
            }
          }
        }
      )
    } else {
      toast.error('Không thể xuất Excel do dữ liệu trống hoặc lỗi')
    }
  }

  const columns = useMemo(
    () => [
      {
        key: 'CreateDate',
        title: 'Ngày tạo',
        dataKey: 'CreateDate',
        cellRenderer: ({ rowData }) => moment(rowData?.CreateDate).format('DD-MM-YYYY'),
        width: 130,
        sortable: false,
        footerRenderer: () => <div>a</div>
      },
      {
        key: 'SourceID',
        title: 'ID đơn hàng',
        dataKey: 'SourceID',
        cellRenderer: ({ rowData }) => (
          <NavLink className='text-primary' to={`/quan-ly/don-hang?id=${rowData.SourceID}`}>
            {rowData.SourceID}
          </NavLink>
        ),
        width: 130,
        sortable: false
      },
      {
        key: 'TM',
        title: 'Tiền mặt',
        dataKey: 'TM',
        cellRenderer: ({ rowData }) => formatString.formatVNDPositive(rowData.TM),
        width: 160,
        sortable: false
      },
      {
        key: 'CK',
        title: 'Chuyển khoản',
        dataKey: 'CK',
        cellRenderer: ({ rowData }) => formatString.formatVNDPositive(rowData.CK),
        width: 160,
        sortable: false
      },
      {
        key: 'TT',
        title: 'Tổng thanh toán',
        dataKey: 'TT',
        cellRenderer: ({ rowData }) =>
          formatString.formatVNDPositive(Math.abs(rowData.CK) + Math.abs(rowData.QT) + Math.abs(rowData.TM)),
        width: 160,
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
        cellRenderer: ({ rowData }) => (
          <div>
            <div>{rowData?.Member?.FullName}</div>
            <div>{rowData?.Member?.MobilePhone}</div>
          </div>
        ),
        width: 250,
        sortable: false
      }
      // {
      //   key: 'Member.MobilePhone',
      //   title: 'Số điện thoại',
      //   dataKey: 'Member.MobilePhone',
      //   width: 150,
      //   sortable: false
      // }
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
        onExport={onExport}
        loading={isLoading || excelMutation.isLoading}
      />
    </div>
  )
}

export default RosesPage
