import React, { useState,useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";

import {
  BarChart3,
  BookOpen,
  DollarSign,
  FileText,
  GraduationCap,
  Settings,
  Users,
  Building2,
  Bell,
  Search,
  Menu,
  X,
} from "lucide-react";

export default function Administrative() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);


 

  const navItems = [
    { icon: <BarChart3 className="w-5 h-5" />, title: "Dashboard", path: "" },
    { icon: <Users className="w-5 h-5" />, title: "Staff Management", path: "staff" },
    { icon: <GraduationCap className="w-5 h-5" />, title: "Students", path: "students" },
    { icon: <DollarSign className="w-5 h-5" />, title: "Finance", path: "finance" },
    { icon: <BookOpen className="w-5 h-5" />, title: "Academics", path: "academics" },
    { icon: <Building2 className="w-5 h-5" />, title: "Facilities", path: "facilities" },
    { icon: <FileText className="w-5 h-5" />, title: "Reports", path: "reports" },
    { icon: <Settings className="w-5 h-5" />, title: "Settings", path: "settings" },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform lg:translate-x-0 z-50`}
      >
        <div className="p-4 flex items-center justify-between lg:justify-start">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Admin Panel
          </h2>
          <button
            className="lg:hidden text-gray-700 dark:text-gray-300"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-4">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300
                hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                ${
                  isActive
                    ? "bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-white"
                    : ""
                }
              `}
              onClick={() => setSidebarOpen(false)} // Close sidebar on mobile
            >
              {item.icon}
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm fixed w-full lg:static z-40">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Hamburger Menu for Mobile */}
            <button
              className="lg:hidden text-gray-700 dark:text-gray-300"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Search */}
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

            {/* Notifications and Profile */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Admin User
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    admin@school.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 mt-16 lg:mt-0">
          <Outlet  />
        </main>
      </div>
    </div>
  );
}
