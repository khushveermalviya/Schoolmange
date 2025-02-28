import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, Lock, Loader } from 'lucide-react';

export default function Admin() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full">
        <div className="mb-12 text-center relative">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white">
            Admin Dashboard
          </h1>
          <div className="absolute h-1 w-32 bg-indigo-600 bottom-0 left-1/2 transform -translate-x-1/2 animate-pulse"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10 px-4">
          {/* Faculty Card */}
          <NavLink
            to="FacilityAuth"
            className="group cursor-pointer"
          >
            <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-xl transition-all duration-300 transform hover:scale-105 hover:rotate-1 h-96 border border-transparent hover:border-blue-400">
              {/* Animated border & background effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-indigo-600/0 group-hover:from-blue-600/90 group-hover:to-indigo-600/90 transition-all duration-300"></div>
              
              {/* Corner decorations */}
              <div className="absolute -top-10 -left-10 w-20 h-20 rounded-full bg-blue-500/30 group-hover:scale-[4] opacity-0 group-hover:opacity-50 transition-all duration-300"></div>
              <div className="absolute -bottom-10 -right-10 w-20 h-20 rounded-full bg-indigo-500/30 group-hover:scale-[4] opacity-0 group-hover:opacity-50 transition-all duration-300"></div>
              
              {/* Content */}
              <div className="relative z-10 p-8 h-full flex flex-col items-center justify-center space-y-6">
                <div className="transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-12">
                  <Users className="w-24 h-24 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                
                <div className="text-center transition-all duration-300">
                  <h2 className="text-4xl font-bold text-gray-800 dark:text-white group-hover:text-white">
                    Student Portal
                  </h2>
                  <p className="mt-4 text-gray-600 dark:text-gray-300 group-hover:text-blue-100 max-w-xs mx-auto">
                    Manage student information, faculty records, and class assignments
                  </p>
                </div>
                
                {/* Animated button that appears on hover */}
                <div className="absolute bottom-8 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <button className="px-6 py-2 bg-white text-blue-600 rounded-full font-medium shadow-lg hover:shadow-xl transition-all">
                    Open Portal
                  </button>
                </div>
              </div>
              
              {/* Particle effects */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-white/70 opacity-0 group-hover:opacity-100"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transitionDelay: `${i * 0.1}s`,
                      transform: 'scale(0) translate(0, 0)',
                      animation: 'floatParticle 3s ease-in-out infinite'
                    }}
                  />
                ))}
              </div>
            </div>
          </NavLink>

          {/* Administrative Card */}
          <NavLink
            to="AdministrativeAuth"
            className="group cursor-pointer"
          >
            <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-xl transition-all duration-300 transform hover:scale-105 hover:rotate-1 h-96 border border-transparent hover:border-green-400">
              {/* Animated border & background effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/0 to-teal-600/0 group-hover:from-green-600/90 group-hover:to-teal-600/90 transition-all duration-300"></div>
              
              {/* Corner decorations */}
              <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-green-500/30 group-hover:scale-[4] opacity-0 group-hover:opacity-50 transition-all duration-300"></div>
              <div className="absolute -bottom-10 -left-10 w-20 h-20 rounded-full bg-teal-500/30 group-hover:scale-[4] opacity-0 group-hover:opacity-50 transition-all duration-300"></div>
              
              {/* Content */}
              <div className="relative z-10 p-8 h-full flex flex-col items-center justify-center space-y-6">
                <div className="transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-12">
                  <Lock className="w-24 h-24 text-green-600 group-hover:text-white transition-colors duration-300" />
                </div>
                
                <div className="text-center transition-all duration-300">
                  <h2 className="text-4xl font-bold text-gray-800 dark:text-white group-hover:text-white">
                    Administrative
                  </h2>
                  <p className="mt-4 text-gray-600 dark:text-gray-300 group-hover:text-green-100 max-w-xs mx-auto">
                    Access system settings, user permissions, and advanced configuration options
                  </p>
                </div>
                
                {/* Animated button that appears on hover */}
                <div className="absolute bottom-8 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <button className="px-6 py-2 bg-white text-green-600 rounded-full font-medium shadow-lg hover:shadow-xl transition-all">
                    Access Controls
                  </button>
                </div>
              </div>
              
              {/* Particle effects */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-white/70 opacity-0 group-hover:opacity-100"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transitionDelay: `${i * 0.1}s`,
                      transform: 'scale(0) translate(0, 0)',
                      animation: 'floatParticle 3s ease-in-out infinite'
                    }}
                  />
                ))}
              </div>
            </div>
          </NavLink>
        </div>
      </div>
      
      {/* Add this CSS for animations */}
      <style jsx>{`
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.5); }
        }
      `}</style>
    </div>
  );
}