import React from 'react';
import { NavLink } from 'react-router-dom';
import Navs from './Navs';

export default function S1() {
  return (
    <div>
      <Navs />
      <ul className='flex max-lg:flex-col flex-wrap justify-center w-full min-h-full items-center text-2xl gap-2'>
        {Array.from({ length: 12 }, (_, index) => (
          <NavLink
            to={`${index + 1}`} // Pass class ID as URL parameter
            className='bg-gray-300 w-1/2 md:w-1/4 min-h-52 text-center flex justify-center items-center'
            key={index + 1}
          >
            <div>
              Class {index + 1}
              <br />
              <span>ClassTeacher</span>
            </div>
          </NavLink>
        ))}
      </ul>
    </div>
  );
}