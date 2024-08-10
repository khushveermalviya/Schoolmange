import React from 'react'
import Nav from '../Component/student/Nav'
import Chart from '../Component/student/Chart'
import Loading from '../Component/student/loading'

export default function Student() {
  return (
    <div>
    <div className=' flex justify-around items-center'>
<Chart/>
<Loading/>
</div>
    </div>
  )
}
