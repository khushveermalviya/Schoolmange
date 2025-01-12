import React, { useState ,useEffect} from 'react';
import useUserStore from '../../app/useUserStore.jsx';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, BookOpen, ClipboardList, AlertCircle, Brain } from 'lucide-react';

const items = [
  { title: 'Home', to: 'Home', icon: <Home className="w-full h-full" /> },
  { title: 'Attendance', to: 'Attendence', icon: <ClipboardList className="w-full h-full" /> },
  { title: 'Result', to: 'result', icon: <BookOpen className="w-full h-full" /> },
  { title: 'Complain', to: 'complain', icon: <AlertCircle className="w-full h-full" /> },
  { title: 'Guru', to: 'Aiguru', icon: <Brain className="w-full h-full" /> }
];

export default function Nav() {
  const [isActive, setActiveItem] = useState('Home');
  const student = useUserStore((state) => state.user);
  const location = useLocation();
  const isAiGuruRoute = location.pathname.toLowerCase().includes('aiguru');
useEffect(()=>{
  console.log(student)
})
  // Desktop Navigation
  const DesktopNav = () => (
    <nav className="hidden md:block fixed top-0 left-0 right-0 z-50">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl  px-4 sm:px-6 lg:px-8">
          
          <div className="flex justify-between gap-20 h-16">
            {/* Logo Section */}
            <div className="flex items-center gap-4 w-40">
       
            <div className="avatar">
  <div className="w-10 rounded-full">
    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
  </div>
</div>
              <span className="text-xl font-bold ">
                {student.StudentID}
              </span>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-1">
              {items.map((item) => (
                <NavLink
                  key={item.title}
                  to={item.to}
                  className={({ isActive }) => `
                    relative group px-4 py-2 flex items-center space-x-2
                    ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-300'}
                  `}
                >
                  <div className="w-5 h-5">{item.icon}</div>
                  <span className="font-medium">{item.title}</span>

                  {/* Hover and Active Indicator */}
              
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );

  // Mobile Navigation
  const MobileNav = () => (
    <nav className={`
      md:hidden fixed z-50 transition-all duration-300 left-0 right-0
      ${isAiGuruRoute ? 'top-0' : 'bottom-4'}
      ${isAiGuruRoute ? 'px-0' : 'px-4'}
    `}>
      <div className={`
        flex justify-around items-center h-16 bg-white dark:bg-gray-800 shadow-lg backdrop-blur-sm bg-opacity-90
        ${isAiGuruRoute ? '' : 'rounded-2xl mx-auto'}
        ${isAiGuruRoute ? 'border-b border-gray-200 dark:border-gray-700' : ''}
      `}>
        {items.map((item) => (
          <NavLink
            key={item.title}
            to={item.to}
            className={({ isActive }) => `
              flex flex-col items-center justify-center w-16 py-1 px-2
              ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'}
            `}
          >
            <div className="w-6 h-6 mb-1 transition-colors duration-200">
              {item.icon}
            </div>
            <span className="text-xs transition-colors duration-200">
              {item.title}
            </span>
            <div className={`
              absolute ${isAiGuruRoute ? 'bottom-0' : '-top-0.5'} w-1 h-1 
              bg-purple-600 dark:bg-purple-400 rounded-full transition-opacity duration-200
              ${isActive ? 'opacity-100' : 'opacity-0'}
            `} />
          </NavLink>
        ))}
      </div>
    </nav>
  );

  return (
    <>
      <DesktopNav />
      <MobileNav />
      {/* Add padding for desktop nav */}
      <div className="hidden md:block h-16" />
    </>
  );
}