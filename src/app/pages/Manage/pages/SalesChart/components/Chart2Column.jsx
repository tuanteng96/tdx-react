import React from 'react'
import PropTypes from 'prop-types'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

Chart2Column.propTypes = {
  data: PropTypes.object,
  options: PropTypes.object
}

function Chart2Column({ options, data }) {
  return <Bar options={options} data={data} />
}

export default Chart2Column
