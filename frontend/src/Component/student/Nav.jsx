import React, { useState } from 'react';
import useUserStore from '../../app/useUserStore.jsx';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, ClipboardList, AlertCircle, Brain, LogOut } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

// Logout Message Component
const LogoutMessage = ({ studentId, isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl transform transition-all scale-100 animate-fade-in">
        <h2 className="text-xl font-bold text-center mb-2">👋 Goodbye!</h2>
        <p className="text-gray-600 dark:text-gray-300 text-center">
          See you again, {studentId}!
        </p>
      </div>
    </div>
  );
};

const items = [
  { title: 'Home', to: 'Home', icon: <Home className="w-full h-full" /> },
  { title: 'Attendance', to: 'Attendence', icon: <ClipboardList className="w-full h-full" /> },
  { title: 'Result', to: 'result', icon: <BookOpen className="w-full h-full" /> },
  { title: 'Complain', to: 'complain', icon: <AlertCircle className="w-full h-full" /> },
  { title: 'Guru', to: 'Aiguru', icon: <Brain className="w-full h-full" /> }
];

export default function Nav() {
  const [isActive, setActiveItem] = useState('Home');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const student = useUserStore((state) => state.user);
  const location = useLocation();
  const isAiGuruRoute = location.pathname.toLowerCase().includes('aiguru');
  const navigate = useNavigate();

  const handleLogout = () => {
    // Show toast notification
    toast.success(`Goodbye ${student.StudentID}! See you again!`, {
      duration: 3000,
      position: 'top-center',
      style: {
        background: '#4F46E5',
        color: '#ffffff',
        padding: '16px',
        borderRadius: '10px',
      },
      icon: '👋',
    });

    // Show on-screen message and start logout process
    setIsLoggingOut(true);

    // Delay the actual logout to show animations
    setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      navigate('/');
    }, 2000);
  };

  // Desktop Navigation (same as before)
  const DesktopNav = () => (
    <nav className="hidden md:block fixed top-0 left-0 right-0 z-50">
      {/* Your existing DesktopNav code */}
    </nav>
  );

  // Mobile Header with glass effect
  const MobileHeader = () => (
    <nav className="md:hidden fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center h-14 px-4">
        <div className="w-8" />
        
        <div className="flex items-center justify-center">
          <img src="/vite.svg" alt="Logo" className="h-8 w-auto" />
        </div>
        
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`
            w-8 h-8 flex items-center justify-center
            ${isLoggingOut ? 'opacity-50' : 'text-gray-600 hover:text-red-600'}
            transition-all duration-300
          `}
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );

  // Mobile Bottom Navigation with glass effect
  const MobileNav = () => (
    <nav className={`
      md:hidden fixed z-50 transition-all duration-300 left-0 right-0
      ${isAiGuruRoute ? 'top-14' : 'bottom-4'}
      ${isAiGuruRoute ? 'px-0' : 'px-4'}
    `}>
      <div className={`
        flex justify-around items-center h-16 
        backdrop-blur-lg bg-white/90 dark:bg-gray-800/90
        shadow-lg rounded-2xl mx-auto
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
      {/* Toast Container */}
      <Toaster />
      
      {/* Logout Message */}
      <LogoutMessage 
        studentId={student.StudentID}
        isVisible={isLoggingOut}
      />
      
      {/* Navigation Components */}
      <DesktopNav />
      <MobileHeader />
      <MobileNav />
      
      {/* Spacing */}
      <div className="md:hidden h-14" />
      <div className="hidden md:block h-16" />
    </>
  );
}