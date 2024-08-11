import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Admin() {
  return (
    <div className='w-full h-screen flex justify-center gap-16 flex-wrap'>
      <NavLink to="facility" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-80 w-full'>
      
          Faculty
   
      </NavLink>
      <NavLink to="classes" className='w-80'>
       
          Student
        
      </NavLink>
    </div>
  );
}
