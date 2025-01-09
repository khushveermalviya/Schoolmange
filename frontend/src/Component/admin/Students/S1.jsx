import React from 'react';
import { NavLink } from 'react-router-dom';
import Navs from './Navs';

export default function S1() {
  return (
    <div>
      <Navs />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 12 }, (_, index) => (
            <NavLink
              to={`${index + 1}`}
              key={index + 1}
              className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Class {index + 1}
                    </h3>
                    <span className="px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-200">
                      Room {index + 101}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-600 dark:text-gray-300">
                      Class Teacher
                    </p>
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      {/* <Users className="h-5 w-5 mr-2" /> */}
                      <span>32 Students</span>
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      {/* <MessageSquare className="h-5 w-5 mr-2" /> */}
                      <span>4 Recent Updates</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3">
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    Last updated: Today at 2:30 PM
                  </div>
                </div>
              </div>
            </NavLink>
          ))}
        </div>
</div>
</div>
  );
}