import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Nav({ userData }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to close mobile menu
  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/StudentID Section */}
          <div className="flex-shrink-0">
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {userData.StudentID}
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex space-x-8">
              <NavLink
                to="Aiguru"
                className="group relative px-3 py-2 transition-all duration-300 ease-in-out"
              >
                <span className="relative z-10 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent font-medium">
                  AI Guru
                  <span className="absolute -top-1 -right-2 text-yellow-400 text-xs">✧</span>
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-violet-400 group-hover:w-full transition-all duration-300"></span>
              </NavLink>

              {['Home', 'Attendence', 'Result', 'Complain'].map((item) => (
                <NavLink
                  key={item}
                  to={item.toLowerCase()}
                  className={({ isActive }) =>
                    `group relative px-3 py-2 transition-all duration-300 ease-in-out ${
                      isActive ? 'text-pink-400' : 'text-gray-300'
                    }`
                  }
                >
                  <span className="relative z-10">{item}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-400 group-hover:w-full transition-all duration-300"></span>
                </NavLink>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-all duration-300"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <NavLink
            to="Aiguru"
            className="block px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent"
            onClick={handleNavClick}
          >
            AI Guru
            <span className="text-yellow-400 text-xs ml-1">✧</span>
          </NavLink>

          {['Home', 'Attendence', 'Result', 'Complain'].map((item) => (
            <NavLink
              key={item}
              to={item.toLowerCase()}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                  isActive
                    ? 'text-pink-400 bg-gray-800'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`
              }
            >
              {item}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}