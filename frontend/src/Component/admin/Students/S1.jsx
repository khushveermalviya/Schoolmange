import React from 'react'
import { NavLink } from "react-router-dom"

export default function S1() {
  return (
    <div>
      <ul className='flex max-lg:flex-col flex-wrap justify-center w-full items-center text-2xl gap-2'>
        {Array.from({ length: 12 }, (_, index) => (
          <NavLink
            to={`classes/${index + 1}`}  // Pass class number as URL parameter
            className='bg-gray-300 border-black border-2 w-1/2  h-40 text-center text-black flex justify-center items-center text-4xl font-mono' 
            key={index + 1}
          >
            {index + 1}
          </NavLink>
        ))}
      </ul>
    </div>
  )
}
