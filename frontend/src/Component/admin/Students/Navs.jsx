import React from 'react'
import { NavLink } from 'react-router-dom'
export default function Navs() {
  return (
    <div>
        
        <div className=' bg-slate-400 text-2xl flex flex-col w-full h-14 items-center'>
            <ul className='flex w-full justify-around flex-nowrap font-serif mt-3 '>
                <li className='cursor-pointer'>
                    <NavLink to="add">Add</NavLink>
                    </li>
                <li className='cursor-pointer' >
                <NavLink to="delete">Delete</NavLink>
                  </li>
                <li className='cursor-pointer'>
                <NavLink to="annunosment">Annunosment</NavLink>
                </li>
                <li className='cursor-pointer'>Search</li>
            </ul>
        </div>
    </div>
  )
}
