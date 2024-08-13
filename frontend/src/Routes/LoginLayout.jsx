import React, { Children } from 'react'
import { Outlet,useOutletContext } from 'react-router-dom'

export default function LoginLayout() {
  const context =useOutletContext(Children)

  return (
    <div>
        <Outlet/>
    </div>
  )
}
