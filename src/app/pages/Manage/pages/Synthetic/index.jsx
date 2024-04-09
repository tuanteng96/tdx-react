import { useMemo, useState } from 'react'
import { useManage } from '../../ManageLayout'
import { useMutation, useQuery } from 'react-query'
import ManageAPI from 'src/app/_ezs/api/manage.api'
import { dataToExcel } from 'src/app/_ezs/core/SpreadJSExcel'
import moment from 'moment'
import { toast } from 'react-toastify'
import { formatString } from 'src/app/_ezs/utils/formatString'
import ReactBaseTable from 'src/app/_ezs/partials/table'
import Filter from './components/Filter'

function SyntheticPage(props) {
  const { open, onHide } = useManage()

  const [filters, setFilters] = useState({
    pi: 1,
    ps: 20,
    MemberID: 0,
    Include: false,
    from: '',
    to: ''
  })

  const { data, isLoading, isPreviousData } = useQuery({
    queryKey: ['ListOrders', filters],
    queryFn: async () => {
      let { data } = await ManageAPI.getReport({
        ...filters,
        Pi: filters.pi,
        Ps: filters.ps,
        from: filters.from ? moment(filters.from).format('YYYY-MM-DD') : '',
        to: filters.to ? moment(filters.to).format('YYYY-MM-DD') : '',
        MemberID: filters?.MemberID?.value || ''
      })
      return {
        ...data,
        items: data?.items
          ? data?.items.map((x) => ({
              ...x,
              ID: x?.Member?.ID
            }))
          : []
      }
    },
    keepPreviousData: true
  })

  const excelMutation = useMutation({
    mutationFn: (body) => ManageAPI.getReport(body)
  })

  const onExport = () => {
    if (data?.total) {
      excelMutation.mutate(
        {
          ...filters,
          MemberID: filters?.MemberID?.value || '',
          from: filters.from ? moment(filters.from).format('YYYY-MM-DD') : '',
          to: filters.to ? moment(filters.to).format('YYYY-MM-DD') : '',
          pi: 1,
          ps: data?.total
        },
        {
          onSuccess: ({ data }) => {
            if (data.items && data.items.length > 0) {
              dataToExcel(`Báo cáo khách hàng tổng hợp`, (sheet, workbook) => {
                workbook.suspendPaint()
                workbook.suspendEvent()
                let HeadTable = [
                  'ID',
                  'HỌ TÊN',
                  'SỐ ĐIỆN THOẠI',
                  'TỔNG F1 TRỰC TIẾP',
                  'TỔNG F TOÀN NHÁNH',
                  'TỔNG DOANH SỐ F1',
                  'TỔNG DOANH SỐ TOÀN NHÁNH'
                ]
                var Response = [HeadTable]

                for (let rowData of data.items) {
                  let newArr = [
                    rowData?.Member?.ID,
                    rowData?.Member?.FullName,
                    rowData?.Member?.MobilePhone,
                    rowData?.F1?.InTimeTotal,
                    rowData?.F?.InTimeTotal,
                    rowData?.F1?.OrderInTimeTotalValue,
                    rowData?.F?.OrderInTimeTotalValue
                  ]
                  Response.push(newArr)
                }

                let TotalColumn = HeadTable.length
                let TotalRow = Response.length

                sheet.setArray(2, 0, Response)

                //title
                workbook.getActiveSheet().getCell(0, 0).value(`Danh sách khách hàng tổng hợp (${data?.total} KH)`)
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
                  workbook.getActiveSheet().setFormatter(i, 5, '#,#')
                  workbook.getActiveSheet().setFormatter(i, 6, '#,#')
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
        key: 'ID',
        title: 'ID',
        dataKey: 'ID',
        cellRenderer: ({ rowData }) => rowData?.Member?.ID,
        width: 130,
        sortable: false
      },
      {
        key: 'Member',
        title: 'Khách hàng',
        dataKey: 'Member',
        cellRenderer: ({ rowData }) => (
          <div>
            <div>{rowData?.Member?.FullName}</div>
            <div>{rowData?.Member?.MobilePhone}</div>
          </div>
        ),
        width: 200,
        sortable: false
      },
      {
        key: 'F1',
        title: 'Tổng F1 trực tiếp',
        dataKey: 'F1',
        cellRenderer: ({ rowData }) => rowData?.F1?.InTimeTotal,
        width: 160,
        sortable: false
      },
      {
        key: 'FT',
        title: 'Tổng F toàn nhánh',
        dataKey: 'FT',
        cellRenderer: ({ rowData }) => rowData?.F?.InTimeTotal,
        width: 180,
        sortable: false
      },
      {
        key: 'OrderF1',
        title: 'Tổng doanh số F1',
        dataKey: 'OrderF1',
        cellRenderer: ({ rowData }) => formatString.formatVNDPositive(rowData?.F1?.OrderInTimeTotalValue),
        width: 160,
        sortable: false
      },
      {
        key: 'OrderFT',
        title: 'Tổng doanh số toàn nhánh',
        dataKey: 'OrderFT',
        cellRenderer: ({ rowData }) => formatString.formatVNDPositive(rowData?.F?.OrderInTimeTotalValue),
        width: 250,
        sortable: false
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <div className='h-full p-4 flex flex-col'>
      <ReactBaseTable
        pagination
        wrapClassName='grow'
        rowKey='ID'
        columns={columns}
        data={data?.items || []}
        estimatedRowHeight={96}
        isPreviousData={isPreviousData}
        loading={isLoading || isPreviousData}
        pageCount={data?.pcount}
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
        onExport={onExport}
        loading={isLoading || excelMutation.isLoading}
      />
    </div>
  )
}

export default SyntheticPage
