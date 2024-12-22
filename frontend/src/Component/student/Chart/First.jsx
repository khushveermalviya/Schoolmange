
import LineChart from './LineChart.jsx'

import React from 'react'


export default function First() {
  return (
    <div>
    <h1 className="text-2xl">Student Dashboard</h1>
    <div>
      <h2>Weekly Performance</h2>
      <LineChart />
    </div>
    <div>
      <h2>Attendance</h2>
      {/* <PieChart /> */}
    </div>
  </div>
  )
}
