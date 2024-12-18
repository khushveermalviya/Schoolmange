import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Nav() {
  return (
    <div className='text-white'>
      <div className=' w-full bg-gray-800 h-16 flex justify-around items-center'>
        2634723434
        <ul className='flex justify-around w-1/2
'>
          <li><NavLink to='Chart'
       
          >Home</NavLink></li>
          <li> <NavLink to='attendence'    className={({ isActive }) => 
          isActive ? 'text-red-500' : 'text-white'
        }>Attendence</NavLink> </li>
          <li> <NavLink to='Result'    className={({ isActive }) => 
          isActive ? 'text-red-500' : 'text-white'
        }>Result</NavLink> </li>
          <li><NavLink to="Complain"    className={({ isActive }) => 
          isActive ? 'text-red-500' : 'text-white'
        } >Complain</NavLink> </li>
        </ul>
      </div>
    </div>
  )
}
