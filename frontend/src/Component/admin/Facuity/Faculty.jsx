import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  BookOpen,
  ClipboardList,
  User,
  Calendar,
  FileText,
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react';

const FacultyNav = ({ isOpen, closeNav }) => {
  const navItems = [
    { icon: <BookOpen className="w-5 h-5" />, title: 'FDashboard', path: '' },
    { icon: <BookOpen className="w-5 h-5" />, title: 'Subjects', path: 'subjects' },
    { icon: <BookOpen className="w-5 h-5" />, title: 'Students', path: 'class' },
    { icon: <ClipboardList className="w-5 h-5" />, title: 'Attendance', path: 'attendance' },
    { icon: <Calendar className="w-5 h-5" />, title: 'Timetable', path: 'timetable' },
    { icon: <FileText className="w-5 h-5" />, title: 'Reports', path: 'reports' },
    { icon: <User className="w-5 h-5" />, title: 'Profile', path: 'profile' },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out w-64 bg-white dark:bg-gray-800 shadow-lg z-50 md:translate-x-0`}
    >
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Faculty Panel</h2>
        <button className="md:hidden text-gray-400 hover:text-gray-500 dark:hover:text-gray-300" onClick={closeNav}>
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
              ${isActive ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-white' : ''}
            `}
            onClick={closeNav}
          >
            {item.icon}
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

const FacultyHeader = ({ searchQuery, setSearchQuery, openNav }) => (
  <header className="bg-white dark:bg-gray-800 shadow-sm">
    <div className="flex items-center justify-between px-6 py-4">
      <button className="md:hidden p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300" onClick={openNav}>
        <Menu className="w-6 h-6" />
      </button>
      <div className="relative flex-1 md:ml-6">
        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white w-full md:w-64"
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Faculty User</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">faculty@school.com</p>
          </div>
        </div>
      </div>
    </div>
  </header>
);

export default function Faculty() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isNavOpen, setIsNavOpen] = useState(false);

  const openNav = () => setIsNavOpen(true);
  const closeNav = () => setIsNavOpen(false);

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <FacultyNav isOpen={isNavOpen} closeNav={closeNav} />

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Header */}
        <FacultyHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} openNav={openNav} />

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
