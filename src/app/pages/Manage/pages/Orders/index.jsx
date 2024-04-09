import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import ManageAPI from 'src/app/_ezs/api/manage.api'
import ReactBaseTable from 'src/app/_ezs/partials/table'
import { formatString } from 'src/app/_ezs/utils/formatString'
import Filter from './components/Filter'
import { useManage } from '../../ManageLayout'
import { useWindowSize } from '@uidotdev/usehooks'
import Select from 'react-select'
import ConfigAPI from 'src/app/_ezs/api/config.api'
import { useRoles } from 'src/app/_ezs/hooks/useRoles'
import useQueryParams from 'src/app/_ezs/hooks/useQueryParams'
import { toast } from 'react-toastify'
import { dataToExcel } from 'src/app/_ezs/core/SpreadJSExcel'

const TransportSelect = ({ List, rowData, refetch }) => {
  let [value, setValue] = useState('')

  useEffect(() => {
    setValue(rowData?.Desc || '')
  }, [rowData])

  const updateMutation = useMutation({
    mutationFn: async (body) => {
      let { data } = await ManageAPI.updateOrderDesc(body)
      await refetch()
      return data
    }
  })

  const onSubmit = (val) => {
    updateMutation.mutate(
      {
        updated: [
          {
            ID: rowData?.ID,
            Desc: val
          }
        ]
      },
      {
        onSuccess: (data) => {
          console.log(data)
        }
      }
    )
  }

  return (
    <Select
      isLoading={updateMutation.isLoading}
      isClearable
      className='select-control w-full'
      classNamePrefix='select'
      options={List}
      value={List.filter((x) => x.value === value)}
      onChange={(val) => {
        setValue(val?.value || '')
        onSubmit(val?.value)
      }}
      placeholder='Chọn'
      noOptionsMessage={() => 'Không có dữ liệu'}
      menuPortalTarget={document.body}
      menuPosition='fixed'
      styles={{
        menuPortal: (base) => ({
          ...base,
          zIndex: 9999
        })
      }}
    />
  )
}

function OrdersPage() {
  const { duyet_don } = useRoles(['duyet_don'])
  const { open, onHide, setTotal } = useManage()

  const queryParams = useQueryParams()

  const [filters, setFilters] = useState({
    key: queryParams?.id || '',
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
    keepPreviousData: true,
    onSuccess: ({ data }) => {
      setTotal((prevState) => ({
        ...prevState,
        Orders: data.total
      }))
    }
  })

  const Transport = useQuery({
    queryKey: ['Transport'],
    queryFn: async () => {
      let { data } = await ConfigAPI.getName('tdx_giaohang')
      let newData = []
      if (data?.data && data?.data?.length > 0) {
        let { Value } = data?.data[0]
        for (let k of Value.split(',')) {
          newData.push({
            label: k,
            value: k
          })
        }
      }
      return newData
    }
  })

  const excelMutation = useMutation({
    mutationFn: (body) => ManageAPI.getOrders(body)
  })

  const onExport = () => {
    if (data?.data?.total) {
      excelMutation.mutate(
        {
          ...filters,
          MemberID: filters?.MemberID ? filters?.MemberID?.value : '',
          status: filters?.status ? filters?.status?.value : '',
          from: filters.from ? moment(filters.from).format('YYYY-MM-DD') : '',
          to: filters.to ? moment(filters.to).format('YYYY-MM-DD') : '',
          pi: 1,
          ps: data?.data?.total
        },
        {
          onSuccess: ({ data }) => {
            if (data.lst && data.lst.length > 0) {
              dataToExcel(`Báo cáo đơn hàng`, (sheet, workbook) => {
                workbook.suspendPaint()
                workbook.suspendEvent()
                let HeadTable = [
                  'ID',
                  'NGÀY TẠO',
                  'TRẠNG THÁI',
                  'HỌ TÊN',
                  'SỐ ĐIỆN THOẠI',
                  'GIÁ TRỊ ĐƠN HÀNG',
                  'TRỪ TỪ ĐIỂM',
                  'TRỪ TỪ THẺ TIỀN',
                  'THANH TOÁN THÊM',
                  'HOA HỒNG',
                  'THỰC THU',
                  'VẬN CHUYỂN',
                  'SẢN PHẨM'
                ]
                var Response = [HeadTable]

                for (let rowData of data.lst) {
                  let newArr = [
                    rowData.ID,
                    moment(rowData?.CreateDate).format('DD-MM-YYYY'),
                    rowData?.Status === 'finish' ? 'Hoàn thành' : rowData?.Status === 'cancel' ? 'Hủy' : 'Đang xử lý',
                    rowData?.Member?.FullName,
                    rowData?.Member?.MobilePhone,
                    rowData?.ToPay,
                    rowData?.DIEM,
                    rowData?.TIEN,
                    rowData?.ToPay - rowData?.DIEM - rowData?.TIEN,
                    rowData?.TotalFMoney,
                    rowData?.ToPay - rowData?.DIEM - rowData?.TIEN - rowData?.TotalFMoney,
                    rowData?.Desc,
                    rowData.Items && rowData.Items.map((x) => `${x.ProdTitle} (SL x${x.Qty})`).join('\n')
                  ]
                  Response.push(newArr)
                }

                let TotalColumn = HeadTable.length
                let TotalRow = Response.length

                sheet.setArray(2, 0, Response)

                //title
                workbook.getActiveSheet().getCell(0, 0).value(`Danh sách đơn hàng (${data?.total} ĐH)`)
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
                  workbook.getActiveSheet().setFormatter(i, 7, '#,#')
                  workbook.getActiveSheet().setFormatter(i, 8, '#,#')
                  workbook.getActiveSheet().setFormatter(i, 9, '#,#')
                  workbook.getActiveSheet().setFormatter(i, 10, '#,#')

                  sheet.getRange(i, 12, 1, 1).wordWrap(true)
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
    }
    else {
      toast.error('Không thể xuất Excel do dữ liệu trống hoặc lỗi')
    }
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
        title: 'ID / Ngày tạo',
        dataKey: 'CreateDate',
        cellRenderer: ({ rowData }) => (
          <div>
            <div className='font-bold'>{rowData.ID}</div>
            <div>{moment(rowData?.CreateDate).format('DD-MM-YYYY')}</div>
          </div>
        ),
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
        cellRenderer: ({ rowData }) => (
          <div>
            <div>{rowData?.Member?.FullName}</div>
            <div>{rowData?.Member?.MobilePhone}</div>
          </div>
        ),
        width: 220,
        sortable: false
      },
      // {
      //   key: 'Member.MobilePhone',
      //   title: 'Số điện thoại',
      //   dataKey: 'Member.MobilePhone',
      //   width: 150,
      //   sortable: false
      // },
      {
        key: 'ToPay',
        title: 'Giá trị đơn hàng',
        dataKey: 'ToPay',
        cellRenderer: ({ rowData }) => formatString.formatVND(rowData?.ToPay),
        width: 160,
        sortable: false
      },
      {
        key: 'DIEM',
        title: 'Trừ từ điểm',
        dataKey: 'DIEM',
        cellRenderer: ({ rowData }) => formatString.formatPoint(rowData?.DIEM),
        width: 160,
        sortable: false
      },
      {
        key: 'TIEN',
        title: 'Trừ từ thẻ tiền',
        dataKey: 'TIEN',
        cellRenderer: ({ rowData }) => formatString.formatVND(rowData?.TIEN),
        width: 160,
        sortable: false
      },
      {
        key: 'ToPay-DIEM-TIEN',
        title: 'Thanh toán thêm',
        dataKey: 'ToPay-DIEM-TIEN',
        cellRenderer: ({ rowData }) => formatString.formatVND(rowData?.ToPay - rowData?.DIEM - rowData?.TIEN),
        width: 160,
        sortable: false
      },
      {
        key: 'TotalFMoney',
        title: 'Hoa hồng',
        dataKey: 'TotalFMoney',
        cellRenderer: ({ rowData }) => formatString.formatVND(rowData?.TotalFMoney),
        width: 160,
        sortable: false
      },
      {
        key: 'thucthu-DIEM-TIEN',
        title: 'Thực thu',
        dataKey: 'thucthu-DIEM-TIEN',
        cellRenderer: ({ rowData }) =>
          formatString.formatVND(rowData?.ToPay - rowData?.DIEM - rowData?.TIEN - rowData?.TotalFMoney),
        width: 160,
        sortable: false
      },
      // {
      //   key: 'RemainPay',
      //   title: 'Nợ',
      //   dataKey: 'RemainPay',
      //   cellRenderer: ({ rowData }) => formatString.formatVND(rowData?.RemainPay),
      //   width: 160,
      //   sortable: false
      // },
      {
        key: 'transport',
        title: 'Vận chuyển',
        dataKey: 'transport',
        cellRenderer: ({ rowData }) => (
          <TransportSelect rowData={rowData} List={Transport?.data || []} refetch={refetch} />
        ),
        width: 300,
        sortable: false
      },
      {
        key: 'Items',
        title: 'Sản phẩm',
        dataKey: 'Items',
        cellRenderer: ({ rowData }) =>
          rowData.Items && rowData.Items.map((x) => `${x.ProdTitle} (SL x${x.Qty})`).join(', '),
        width: 300,
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
        ),
        hidden: !duyet_don?.hasRight
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [width, Transport, refetch, duyet_don]
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
        onExport={onExport}
        loading={isLoading || excelMutation.isLoading}
      />
    </div>
  )
}

export default OrdersPage
