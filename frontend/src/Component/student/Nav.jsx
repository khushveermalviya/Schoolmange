import React, { useState, useRef, useEffect } from 'react';
import useUserStore from '../../app/useUserStore.jsx';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, ClipboardList, AlertCircle, Brain, LogOut, MessageCircle, X } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

// Logout Confirmation Modal Component
const LogoutConfirmationModal = ({ isOpen, onClose, onConfirm, studentId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-80 max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Confirm Logout</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
          Are you sure you want to log out, {studentId}?
        </p>
        <div className="flex justify-between space-x-4">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

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

// Navigation Items
const items = [
  { title: 'Home', to: 'Home', icon: <Home className="w-full h-full" /> },
  { title: 'Attendance', to: 'Attendence', icon: <ClipboardList className="w-full h-full" /> },
  { title: 'Result', to: 'result', icon: <BookOpen className="w-full h-full" /> },
  { title: 'Complain', to: 'complain', icon: <AlertCircle className="w-full h-full" /> },
  { title: 'Quiz', to: 'Quiz', icon: <Brain className="w-full h-full" /> },
  { title: 'Fees', to: 'Fees', icon: <Brain className="w-full h-full" /> },
  { title: 'Guru', to: 'Aiguru', icon: <Brain className="w-full h-full" /> }
];
const itemss = [
  { title: 'Home', to: 'Home', icon: <Home className="w-full h-full" /> },
  { title: 'Attendance', to: 'Attendence', icon: <ClipboardList className="w-full h-full" /> },
  { title: 'Result', to: 'result', icon: <BookOpen className="w-full h-full" /> },
  { title: 'Complain', to: 'complain', icon: <AlertCircle className="w-full h-full" /> }
];
const dropdown = [
  { title: 'Quiz', to: 'Quiz', icon: <Brain className="w-full h-full" /> },
  { title: 'Fees', to: 'Fees', icon: <Brain className="w-full h-full" /> },
  { title: 'Guru', to: 'Aiguru', icon: <Brain className="w-full h-full" /> }
];

export default function Nav() {
  const [isActive, SetisActive] = useState("Home");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [messageCount, setMessageCount] = useState(3);
  const student = useUserStore((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const isAiGuruRoute = location.pathname.toLowerCase().includes('aiguru');
  const isGroupChatRoute = location.pathname.toLowerCase().includes('groupchat');

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
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

    setIsLoggingOut(true);
    setIsLogoutModalOpen(false);
    
    // Clear all authentication-related local storage
    localStorage.clear(); // This removes ALL local storage items

    // Use multiple methods to ensure redirect
    window.location.href = '/';  // Force full page reload
    navigate('/');  // React Router navigation
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };

  // Desktop Navigation
  const DesktopNav = () => (
    <nav className="hidden md:block fixed top-0 left-0 right-0 z-50">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between gap-20 h-16">
            <div className="flex items-center gap-4 w-40">
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img src="/face.jpg" />
                </div>
              </div>
              <span className="text-xl font-bold">
                {student.StudentID}
              </span>
            </div>

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
                </NavLink>
              ))}
              <NavLink
                to="groupchat"
                className="relative px-4 py-2 flex items-center space-x-2 text-gray-600"
              >
                <div className="w-5 h-5">
                  <MessageCircle className="w-full h-full" />
                  {messageCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {messageCount}
                    </div>
                  )}
                </div>
                <span className="font-medium">Messages</span>
              </NavLink>
              <button
                onClick={handleLogoutClick}
                className="px-4 py-2 flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
              >
                <div className="w-5 h-5">
                  <LogOut className="w-full h-full" />
                </div>
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );

  // Mobile Header with glass effect
  const MobileHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setIsMenuOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    // Handle menu click
    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
    };

    return (
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center h-14 px-4">
          {isGroupChatRoute ? (
            <button
              onClick={() => navigate('/')}
              className="relative w-8 h-8 flex items-center justify-center text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          ) : (
            <NavLink to="groupchat">
              <button className="relative w-8 h-8 flex items-center justify-center text-gray-600">
                <MessageCircle className="w-6 h-6" />
                {messageCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {messageCount}
                  </div>
                )}
              </button>
            </NavLink>
          )}
  
          <div className="flex items-center justify-center">
            <img src="/vite.svg" alt="Logo" className="h-8 w-auto" />
          </div>
  
          <div className="relative" ref={menuRef}>
            <button
              onClick={toggleMenu}
              className={`
                w-8 h-8 flex items-center justify-center rounded-full
                ${isMenuOpen ? 'bg-purple-100 text-purple-600' : 'text-gray-600'}
                hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300
              `}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
  
            {/* Dropdown Menu */}
            <div 
              className={`
                absolute right-0 mt-2 w-56 origin-top-right
                bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700
                transition-all duration-300 ease-in-out transform
                ${isMenuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}
              `}
              style={{ maxHeight: isMenuOpen ? '500px' : '0px', overflow: 'hidden' }}
            >
              <div className="p-2 space-y-1">
                {dropdown.map((item) => (
                  <NavLink
                    key={item.title}
                    to={item.to}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) => `
                      flex items-center space-x-3 px-3 py-2 rounded-md
                      ${isActive 
                        ? 'bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-600 dark:text-purple-400 dark:bg-gray-700' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
                      transition-colors duration-200
                    `}
                  >
                    <div className="w-5 h-5 flex-shrink-0">{item.icon}</div>
                    <span className="font-medium">{item.title}</span>
                  </NavLink>
                ))}
                
                <div className="my-2 border-t border-gray-200 dark:border-gray-700"></div>
                
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogoutClick();
                  }}
                  disabled={isLoggingOut}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2 rounded-md
                    ${isLoggingOut 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'}
                    transition-all duration-300
                  `}
                >
                  <LogOut className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  };

  // Mobile Bottom Navigation with glass effect
  const MobileNav = () => {
    if (isGroupChatRoute) return null;
    
    return (
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
          {itemss.map((item) => (
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
  };

  return (
    <>
      <Toaster />
      <LogoutConfirmationModal 
        isOpen={isLogoutModalOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        studentId={student.StudentID}
      />
      <LogoutMessage 
        studentId={student.StudentID}
        isVisible={isLoggingOut}
      />
      <DesktopNav />
      <MobileHeader />
      <MobileNav />
      
      <div className="md:hidden h-14" />
      <div className="hidden md:block h-16" />
    </>
  );
}