import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BarChart3, BookOpen, DollarSign, FileText,
  GraduationCap, Settings, Users, Building2,
  Bell, Search, Menu, X, LogOut
} from "lucide-react";

export default function Administrative({ Username }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const navItems = [
    { icon: <BarChart3 className="w-5 h-5" />, title: "Dashboard", path: "" },
    { icon: <Users className="w-5 h-5" />, title: "Staff Management", path: "staff" },
    { icon: <GraduationCap className="w-5 h-5" />, title: "Students", path: "students" },
    { icon: <DollarSign className="w-5 h-5" />, title: "Finance", path: "finance" },
    { icon: <BookOpen className="w-5 h-5" />, title: "Academics", path: "academics" },
    { icon: <Building2 className="w-5 h-5" />, title: "Facilities", path: "facilities" },
    { icon: <FileText className="w-5 h-5" />, title: "Reports", path: "reports" },
    { icon: <FileText className="w-5 h-5" />, title: "Notification", path: "Notification" },
    { icon: <Settings className="w-5 h-5" />, title: "Settings", path: "settings" },
  ];
  const handleLogout = () => {
    localStorage.removeItem('tokenss');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white dark:bg-gray-800 shadow-lg transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform lg:translate-x-0 z-50`}>
        <div className="p-4 flex items-center justify-between lg:justify-start">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Panel</h2>
          <button className="lg:hidden text-gray-700 dark:text-gray-300" onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="mt-4 flex flex-col h-[calc(100vh-5rem)] justify-between">
          <div>
            {navItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300
                  hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                  ${isActive ? "bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-white" : ""}
                `}
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                <span>{item.title}</span>
              </NavLink>
            ))}
          </div>
          
          {/* Logout Button in Sidebar */}
          <button
            onClick={() => setIsLogoutDialogOpen(true)}
            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-auto mb-4"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <button className="lg:hidden text-gray-700 dark:text-gray-300" onClick={() => setSidebarOpen(!isSidebarOpen)}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-4 flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white w-full lg:w-64"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              
              {/* Profile Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{Username}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{/* Add additional user info here if needed */}</p>
                  </div>
                </button>
                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                    <button
                      onClick={() => setIsLogoutDialogOpen(true)}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
        {/* Logout Confirmation Dialog */}
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center ${
          isLogoutDialogOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
        }`}
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Confirm Logout</h3>
              <button className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500" onClick={() => setIsLogoutDialogOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="mb-4">Are you sure you want to logout? You'll need to login again to access the admin panel.</p>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-400 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors" onClick={() => setIsLogoutDialogOpen(false)}>Cancel</button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}