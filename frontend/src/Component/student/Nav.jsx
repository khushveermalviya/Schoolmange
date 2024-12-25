import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Nav({ userData }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle menu visibility

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
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
    </nav>
  );
}
