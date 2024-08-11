import React from 'react'
import { NavLink } from "react-router-dom"

export default function S1() {
  return (
    <div>
      <ul className='flex flex-col justify-center w-full items-center text-2xl gap-2'>
        {Array.from({ length: 12 }, (_, index) => (
          <NavLink
            to={`classes/${index + 1}`}  // Pass class number as URL parameter
            className='bg-white border-black border-2 w-20 text-center text-black'
            key={index + 1}
          >
            {index + 1}
          </NavLink>
        ))}
      </ul>
    </div>
  )
}
