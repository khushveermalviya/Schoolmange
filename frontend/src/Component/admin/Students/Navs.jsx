import React from 'react'
import { NavLink } from 'react-router-dom'
export default function Navs() {
  return (
    <div>
        
        <div className=' bg-slate-400 text-2xl'>
            <ul className='flex flex-col justify-around flex-nowrap'>
                <li>
                    <NavLink to="add">Add</NavLink>
                    </li>
                <li>delete</li>
                <li>Annunosment</li>
                <li>search</li>
            </ul>
        </div>
    </div>
  )
}
