import React, { useMemo, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import ReactBaseTable from 'src/app/_ezs/partials/table'
import { useMutation, useQuery } from 'react-query'
import moment from 'moment'
import ManageAPI from 'src/app/_ezs/api/manage.api'
import { formatString } from 'src/app/_ezs/utils/formatString'
import { dataToExcel } from 'src/app/_ezs/core/SpreadJSExcel'
import { toast } from 'react-toastify'
import { AdjustmentsVerticalIcon } from '@heroicons/react/24/outline'

function HomePage(props) {
  const [filters, setFilters] = useState({
    MemberID: 0,
    Include: false,
    from: '',
    to: '',
    pi: 1,
    ps: 20
  })
  const [isFilter, setIsFilter] = useState(false)

  const { data, isLoading, isPreviousData, refetch } = useQuery({
    queryKey: ['ListSynthesisReport', filters],
    queryFn: async () => {
      const newQueryConfig = {
        ...filters,
        from: filters.from ? moment(filters.from).format('YYYY-MM-DD') : '', //2023-06-01
        to: filters.to ? moment(filters.to).format('YYYY-MM-DD') : '' //2023-06-30
      }
      let { data } = await ManageAPI.getReport(newQueryConfig)
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
    keepPreviousData: true,
    onSuccess: () => {
      setIsFilter(false)
    }
  })

  const excelMutation = useMutation({
    mutationFn: (body) => ManageAPI.getReport(body)
  })

  const onExport = () => {
    if (data?.total) {
      excelMutation.mutate(
        {
          ...filters,
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
    <div className='h-full flex'>
      <Sidebar
        defaultValues={filters}
        onChange={(values) =>
          setFilters((prevState) => ({
            ...prevState,
            ...values
          }))
        }
        onExport={onExport}
        loading={isLoading || excelMutation.isLoading}
        isFilter={isFilter}
        onHide={() => setIsFilter(false)}
      />
      <div className='flex-1 flex flex-col h-full p-4'>
        <div className='flex items-center justify-between mb-4 md:flex-row'>
          <div className='text-xl md:text-2xl font-bold'>Báo cáo tổng hợp (Tổng {data?.total} KH)</div>
          <button
            type='button'
            className='block px-3 rounded pt-3 pb-2.5 bg-white transition-all hover:bg-primary hover:text-white border md:hidden'
            onClick={() => setIsFilter(!isFilter)}
          >
            <AdjustmentsVerticalIcon className='w-6' />
          </button>
        </div>
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
          pageOffset={filters.pi}
          pageSizes={filters.ps}
          onChange={({ pageIndex, pageSize }) => {
            setFilters((prevState) => ({
              ...prevState,
              pi: pageIndex,
              ps: pageSize
            }))
          }}
        />
      </div>
    </div>
  )
}

HomePage.propTypes = {}

export default HomePage
