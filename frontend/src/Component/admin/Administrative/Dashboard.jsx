import React,{useState,useEffect} from 'react';
import StatCard from './componenet/StatCard';
import ChartCard from './componenet/ChartCard';
import { Users, GraduationCap, DollarSign, BookOpen } from 'lucide-react';
import useUserStore from '../../../app/useUserStore';


export default function Dashboard() {
   
  const dashh= useUserStore((state)=>state.Dash)
  // Sample data for charts
  const studentData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Admissions',
        data: [65, 59, 80, 81, 56, 55],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  };

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [12000, 19000, 15000, 22000, 20000, 25000],
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
      },
    ],
  };

  const departmentData = {
    labels: ['Science', 'Arts', 'Commerce', 'Engineering'],
    datasets: [
      {
        data: [300, 250, 200, 150],
        backgroundColor: [
          'rgba(59, 130, 246, 0.5)',
          'rgba(34, 197, 94, 0.5)',
          'rgba(239, 68, 68, 0.5)',
          'rgba(168, 85, 247, 0.5)',
        ],
      },
    ],
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={dashh.StudentCount}
          icon={<GraduationCap className="w-6 h-6 text-blue-600" />}
          trend={12.5}
        />
        <StatCard
          title="Total Staff"
          value={dashh.Faculty}
          icon={<Users className="w-6 h-6 text-green-600" />}
          trend={5.2}
        />
        <StatCard
          title="Monthly Revenue"
          value="$125,000"
          icon={<DollarSign className="w-6 h-6 text-purple-600" />}
          trend={8.1}
        />
        <StatCard
          title="Department"
          value={dashh.Department
          }
          icon={<BookOpen className="w-6 h-6 text-orange-600" />}
          trend={-2.3}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Student Admissions Trend"
          type="line"
          data={studentData}
        />
        <ChartCard
          title="Revenue Overview"
          type="bar"
          data={revenueData}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Department Distribution"
          type="doughnut"
          data={departmentData}
        />
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Recent Notifications</h3>
          <div className="space-y-4">
            {[
              { text: "New academic calendar published", time: "2 hours ago" },
              { text: "Staff meeting scheduled for next week", time: "5 hours ago" },
              { text: "Quarter results published", time: "1 day ago" },
              { text: "New facility guidelines updated", time: "2 days ago" },
            ].map((notification, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">{notification.text}</p>
                <span className="text-sm text-gray-500">{notification.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}