import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function MainNav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <nav className="bg-white border-gray-200 bg-transparent flex ">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 pt-36">
          
       
          <div className="items-center justify-between  w-full md:flex md:w-auto md:order-1">
            <ul className=" flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg   md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 ">
              <li>
                <NavLink to='/admin'  className="block py-2 px-3 text-white rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page" >Admin</NavLink>
              </li>
             
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}