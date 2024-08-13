import React, { Children } from 'react'
import { Outlet,useOutletContext } from 'react-router-dom'

export default function LoginLayout() {
  const context =useOutletContext(Children)
    console.log(context);
  return (
    <div>
        <Outlet/>
    </div>
  )
}
