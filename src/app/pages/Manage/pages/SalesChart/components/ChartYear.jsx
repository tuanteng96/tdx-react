import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'
import Chart2Column from './Chart2Column'

const optionsObj = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
      display: false
    },
    title: {
      display: false,
      text: 'Biểu đồ khách hàng'
    }
  }
}

const labels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12']
const objData = {
  labels,
  datasets: [
    {
      label: `Năm ${moment().subtract(0, 'year').format('YYYY')}`,
      data: [],
      backgroundColor: 'rgba(54, 162, 235, 0.6)'
    }
  ]
}

function ChartYear({ data, loading }) {
  const [dataChart, setDataChart] = useState(objData)

  useEffect(() => {
    setDataChart((prevState) => ({
      ...prevState,
      datasets: [
        {
          label: `Năm ${moment().subtract(0, 'year').format('YYYY')}`,
          data: data || [],
          backgroundColor: 'rgba(54, 162, 235, 0.6)'
        }
      ]
    }))
  }, [data])

  if (loading) {
    return <div className='h-250px'>Đang tải ...</div>
  }

  return <Chart2Column options={optionsObj} data={dataChart} />
}

ChartYear.propTypes = {
  data: PropTypes.array
}

export default ChartYear
