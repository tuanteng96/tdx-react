import React, { useState } from 'react'
import { useQuery } from 'react-query'
import ManageAPI from 'src/app/_ezs/api/manage.api'
import ChartWeek from './components/ChartWeek'
import ChartYear from './components/ChartYear'
import moment from 'moment'

function SalesChartPage(props) {
  const [filters, setFilters] = useState({
    DateEnd: new Date(),
    DateStart: new Date(),
    StockID: ''
  })

  const { data, isLoading } = useQuery({
    queryKey: ['SalesChart', filters],
    queryFn: async () => {
      let { data } = await ManageAPI.getSalesChart({
        ...filters,
        DateStart: filters.DateStart ? moment(filters.DateStart).format('DD/MM/yyyy') : null,
        DateEnd: filters.DateEnd ? moment(filters.DateEnd).format('DD/MM/yyyy') : null
      })
      return {
        ...data?.result,
        SellWeek: data?.result
          ? [
              data?.result?.DSo_ThisMonday,
              data?.result?.DSo_ThisTuesday,
              data?.result?.DSo_ThisWednesday,
              data?.result?.DSo_ThisThursday,
              data?.result?.DSo_ThisFriday,
              data?.result?.DSo_ThisSaturday,
              data?.result?.DSo_ThisSunday
            ]
          : [],
        SellYear: data?.result
          ? [
              data?.result?.DSo_ThisJanuary,
              data?.result?.DSo_ThisFebruary,
              data?.result?.DSo_ThisMarch,
              data?.result?.DSo_ThisApril,
              data?.result?.DSo_ThisMay,
              data?.result?.DSo_ThisJune,
              data?.result?.DSo_ThisJuly,
              data?.result?.DSo_ThisAugust,
              data?.result?.DSo_ThisSeptember,
              data?.result?.DSo_ThisOctober,
              data?.result?.DSo_ThisNovember,
              data?.result?.DSo_ThisDecember
            ]
          : []
      }
    },
    keepPreviousData: true
  })

  return (
    <div className='h-full p-5'>
      <div className='grid grid-cols-1 md:grid-cols-2 md:gap-5'>
        <div className='bg-white rounded'>
          <div className='p-5 border-b border-gray-200 d-flex align-items-center justify-content-between'>
            <div className='font-medium text-xl'>Doanh số theo tuần</div>
          </div>
          <div className='p-5'>
            <ChartWeek loading={isLoading} data={data?.SellWeek} />
          </div>
        </div>
        <div className='bg-white rounded mt-20px'>
          <div className='p-5 border-b border-gray-200 d-flex align-items-center justify-content-between'>
            <div className='font-medium text-xl'>Doanh số theo năm</div>
          </div>
          <div className='p-5'>
            <ChartYear loading={isLoading} data={data?.SellYear} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SalesChartPage
