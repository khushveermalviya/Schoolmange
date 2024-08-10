import React from 'react'
import Nav from '../Component/student/Nav.jsx'
import Footer from '../Component/student/Footer'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
<>
<Nav/>
<Outlet/>
<div className=' h-screen  place-content-end  relative'>
<Footer/>
</div>
</>
  )
}
