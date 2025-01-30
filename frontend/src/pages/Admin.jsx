import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Users, GraduationCap, Lock, Sun, Moon } from 'lucide-react';
import useUserStore from '../app/useUserStore';

export default function Admin() {
  
const dashh= useUserStore((state)=>state.Dash)



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 dark:text-white">
            Admin Dashboard
          </h1>
    
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 px-4">
          {/* Faculty Card */}
          <NavLink 
            to="Facility"
            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-90 transition-opacity duration-300" />
            
            <div className="relative p-8 h-80 flex flex-col items-center justify-center space-y-6">
              <Users className="w-20 h-20 text-blue-600 group-hover:text-white transition-colors duration-300" />
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 group-hover:text-white text-center transition-colors duration-300">
                Student Portal
                </h2>
                <p className="mt-2 text-gray-600 group-hover:text-blue-100 text-center transition-colors duration-300">
                Manage student information and classes And Faculty
                </p>
              </div>
            </div>
          </NavLink>

          {/* Student Card */}
          {/* <NavLink 
            to="class"
            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-90 transition-opacity duration-300" />
            
            <div className="relative p-8 h-80 flex flex-col items-center justify-center space-y-6">
              <GraduationCap className="w-20 h-20 text-purple-600 group-hover:text-white transition-colors duration-300" />
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 group-hover:text-white text-center transition-colors duration-300">
                  Student Portal
                </h2>
                <p className="mt-2 text-gray-600 group-hover:text-purple-100 text-center transition-colors duration-300">
                  Manage student information and classes
                </p>
              </div>
            </div>
          </NavLink> */}  

          {/* Administrative Card */}
          <NavLink 
            to="Administrative"
            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-teal-600 opacity-0 group-hover:opacity-90 transition-opacity duration-300" />
            
            <div className="relative p-8 h-80 flex flex-col items-center justify-center space-y-6">
              <Lock className="w-20 h-20 text-green-600 group-hover:text-white transition-colors duration-300" />
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 group-hover:text-white text-center transition-colors duration-300">
                  Administrative
                </h2>
                <p className="mt-2 text-gray-600 group-hover:text-green-100 text-center transition-colors duration-300">
                  Access administrative controls and settings
                </p>
              </div>
            </div>
          </NavLink>
        </div>

        {/* Quick Stats Section */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Faculty</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{dashh.Faculty}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Students</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{dashh.StudentCount}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
            <p className="text-sm text-gray-500 dark:text-gray-400">Active Classes</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">16</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
            <p className="text-sm text-gray-500 dark:text-gray-400">Departments</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{dashh.Department}</p>
          </div>
        </div>
      </div>
    </div>
  );
}