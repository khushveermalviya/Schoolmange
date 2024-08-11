import React from 'react'
import { NavLink } from 'react-router-dom'
export default function Admin() {
  return (
    <div>
<div className=' w-full h-screen flex justify-center gap-16 flex-wrap'>
<button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-80 w-80'>
  <NavLink to="facility" >facility </NavLink></button>
<button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-80 w-80'>
  <NavLink to="Student" >Student</NavLink></button>
</div>
    </div>
  )
}
