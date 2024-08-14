import React from 'react'
import { NavLink } from 'react-router-dom'
export default function Navs() {
  return (
    <div>
        
        <div className=' bg-slate-400 text-2xl flex flex-col w-full'>
            <ul className='flex w-full justify-around flex-nowrap'>
                <li className='cursor-pointer'>
                    <NavLink to="add">Add</NavLink>
                    </li>
                <li className='cursor-pointer' >delete</li>
                <li className='cursor-pointer'>Annunosment</li>
                <li className='cursor-pointer'>search</li>
            </ul>
        </div>
    </div>
  )
}
