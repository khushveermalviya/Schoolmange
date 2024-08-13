import React from 'react'
import { Outlet } from 'react-router-dom'
import Navs from '../Component/admin/Students/Navs'
export default function Classaddlayout() {
  return (
    <div>
        <Navs/>
                <Outlet/>
    </div>
  )
}
