import React from 'react'

export default function S1() {
  return (
    <div>
    <ul className='flex flex-col justify-center w-full items-center text-2xl gap-2'>
        {Array.from({ length: 12 }, (_, index) => (
            <li className='bg-white border-black border-2 w-20 text-center  text-black' key={"class "+index + 1}>{index + 1}</li>
        ))}
    </ul>


    </div>
  )
}
