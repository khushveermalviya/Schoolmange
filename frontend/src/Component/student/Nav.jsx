import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Nav({ userData }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle menu visibility

  return (
    <nav className="bg-gray-800 text-white">
      <div className='flex items-center justify-between'>
      <div className="container mx-auto  px-4 py-2">
        {/* Left Section */}
        <div className="flex items-center">
          <span className="text-lg font-semibold">{userData.StudentID}</span>
        </div>

        {/* Hamburger Button for Mobile */}
        <button
          className="block lg:hidden text-gray-200 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Navigation Links */}
        <ul
          className={`lg:flex lg:items-center lg:space-x-6 ${
            isMenuOpen ? "block" : "hidden"
          } absolute lg:static top-16 left-0 w-full lg:w-auto bg-gray-800 lg:bg-transparent z-10`}
        >
         <li>
  <NavLink
    to="Aiguru"
    className={ 
        "bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent block py-2 px-4"  
    }
  >
    <span className="relative">
      <span className="inline-block bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent ">AI Guru</span>
      <span className="absolute top-0 right-0 text-yellow-400 text-xs ml-1">*</span>
    </span>
  </NavLink>
</li>

          <li>
            <NavLink
              to="Home"
              className={({ isActive }) =>
                isActive ? "text-red-500 block py-2 px-4" : "text-white block py-2 px-4"
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="attendence"
              className={({ isActive }) =>
                isActive ? "text-red-500 block py-2 px-4" : "text-white block py-2 px-4"
              }
            >
              Attendance
            </NavLink>
          </li>
          <li>
            <NavLink
              to="Result"
              className={({ isActive }) =>
                isActive ? "text-red-500 block py-2 px-4" : "text-white block py-2 px-4"
              }
            >
              Result
            </NavLink>
          </li>
          <li>
            <NavLink
              to="Complain"
              className={({ isActive }) =>
                isActive ? "text-red-500 block py-2 px-4" : "text-white block py-2 px-4"
              }
            >
              Complain
            </NavLink>
          </li>
        </ul>
      </div>
      <div>
        
<form class="flex items-center max-w-sm mx-auto">   
    <label for="simple-search" class="sr-only">Search</label>
    <div class="relative w-full">
        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"/>
            </svg>
        </div>
        <input type="text" id="simple-search" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search branch name..." required />
    </div>
    <button type="submit" class="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
        </svg>
        <span class="sr-only">Search</span>
    </button>
</form>

        </div>
  
      </div>
    </nav>
  );
}
