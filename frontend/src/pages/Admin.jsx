import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Admin() {
  return (
    <div className='w-full h-full flex flex-col justify-center items-center'>
      <NavLink to="facility" className='bg-gray-300 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded h-80 w-1/2 text-5xl text-center justify-center flex items-center transition-shadow font-mono'>
      
          Faculty
   
      </NavLink>
      <NavLink to="class" className='bg-gray-300 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded h-80 w-1/2 text-5xl text-center justify-center flex items-center font-mono'>
       
          Student
        
      </NavLink>
    </div>
  );
}
