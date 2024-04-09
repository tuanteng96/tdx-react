import React, { useMemo, useState } from 'react'
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
import { dataToExcel } from 'src/app/_ezs/core/SpreadJSExcel'

function WithdrawalHistoryPage(props) {
  const { duyet_xoa_rut_tien } = useRoles(['duyet_xoa_rut_tien'])
  const { pathname } = useLocation()
  const queryParams = useQueryParams()
  const navigate = useNavigate()
  const { width } = useWindowSize()
  const { auth } = useAuth()

  const [isFilter, setIsFilter] = useState(false)

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
        sum: data?.sum ? data?.sum[0] : null,
        total: data?.total || 0
      }
    },
    keepPreviousData: true,
    onSuccess: () => {
      setIsFilter(false)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (body) => WalletsAPI.deleteIdHistory(body)
  })

  const excelMutation = useMutation({
    mutationFn: (body) => WalletsAPI.list(body)
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

  const onExport = () => {
    if (data?.total) {
      excelMutation.mutate(
        {
          ...queryConfig,
          from: queryConfig.from ? moment(queryConfig.from).format('YYYY-MM-DD') : '',
          to: queryConfig.to ? moment(queryConfig.to).format('YYYY-MM-DD') : '',
          pi: 1,
          ps: data?.total
        },
        {
          onSuccess: ({ data }) => {
            if (data.lst && data.lst.length > 0) {
              dataToExcel(`Báo cáo rút tiền`, (sheet, workbook) => {
                workbook.suspendPaint()
                workbook.suspendEvent()
                let HeadTable = [
                  'NGÀY TẠO',
                  'HỌ TÊN',
                  'SỐ ĐIỆN THOẠI',
                  'SỐ TIỀN',
                  'THÔNG TIN SỐ TÀI KHOẢN',
                  'TRẠNG THÁI',
                  'ẢNH HÓA ĐƠN'
                ]
                var Response = [HeadTable]

                for (let rowData of data.lst) {
                  let newArr = [
                    moment(rowData?.CreateDate).format('DD-MM-YYYY'),
                    rowData.MemberPhone,
                    rowData.MemberPhone,
                    rowData.Value,
                    [
                      `Số tài khoản : ${JSON.parse(rowData.Member.BankInfo).STK}`,
                      `Chủ tài khoản : ${JSON.parse(rowData.Member.BankInfo).CTK}`,
                      `Ngân hàng : ${JSON.parse(rowData.Member.BankInfo).NH}`
                    ].join('\n'),
                    rowData?.Status === 'HOAN_THANH' ? 'Hoàn thành' : 'Đang chờ',
                    rowData?.BillSrc ? toAbsolutePath(rowData?.BillSrc) : ''
                  ]

                  Response.push(newArr)
                }

                let TotalColumn = HeadTable.length
                let TotalRow = Response.length

                sheet.setArray(2, 0, Response)
                //title
                workbook
                  .getActiveSheet()
                  .getCell(0, 0)
                  .value(
                    `Danh sách rút tiền (${data?.total}) | Tổng : ${formatString.formatVND(
                      data?.sum[0]['TONG'] || 0
                    )} | Hoàn thành : ${formatString.formatVND(
                      data?.sum[0]['HOAN_THANH'] || 0
                    )} | Chưa hoàn thành : ${formatString.formatVND(data?.sum[0]['DANG_CHO'] || 0)}`
                  )
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
                  workbook.getActiveSheet().setFormatter(i, 3, '#,#')

                  sheet.getRange(i, 4, 1, 1).wordWrap(true)
                  sheet.autoFitRow(i)
                }

                for (let i = 1; i < TotalRow; i++) {
                  if (Response[i][Response[i].length - 1]) {
                    sheet.setValue(i + 2, 6, 'Xem ảnh hóa đơn')
                    sheet.setHyperlink(i + 2, 6, {
                      url: Response[i][Response[i].length - 1],
                      tooltip: 'Ảnh hóa đơn',
                      linkColor: '#0066cc',
                      visitedLinkColor: '#3399ff',
                      drawUnderline: false
                    })
                  }
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
      <Sidebar
        defaultValues={queryConfig}
        onExport={onExport}
        loading={isLoading || excelMutation.isLoading}
        isFilter={isFilter}
        onHide={() => setIsFilter(false)}
      />
      <div className='flex-1 flex flex-col h-full p-4'>
        <div className='flex md:items-center justify-between mb-4 flex-col md:flex-row'>
          <div className='flex justify-between items-center mb-3 md:mb-0'>
            <div className='text-2xl font-bold'>Danh sách rút tiền</div>
            <button
              type='button'
              className='block px-3 rounded pt-3 pb-2.5 bg-white transition-all hover:bg-primary hover:text-white border md:hidden'
              onClick={() => setIsFilter(!isFilter)}
            >
              <AdjustmentsVerticalIcon className='w-6' />
            </button>
          </div>
          <div className='flex items-center text-[13px]'>
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
                {formatString.formatVND(data?.sum['DANG_CHO'] || 0)}
              </span>
            </div>
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
