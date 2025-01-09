import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Users,
  DollarSign,
  BarChart2,
  Award,
} from "lucide-react";

export default function FDashboard() {
  // Mock data for charts
  const groupPerformanceData = {
    labels: ["Group A", "Group B", "Group C", "Group D"],
    datasets: [
      {
        label: "Performance Score",
        data: [85, 75, 92, 68],
        backgroundColor: ["#4CAF50", "#FF9800", "#2196F3", "#F44336"],
      },
    ],
  };

  const payoutData = {
    labels: ["Teacher A", "Teacher B", "Teacher C"],
    datasets: [
      {
        data: [45000, 38000, 50000],
        backgroundColor: ["#2196F3", "#FF9800", "#4CAF50"],
      },
    ],
  };

  // Mock summary stats
  const summaryStats = [
    { icon: <Users className="w-6 h-6 text-blue-500" />, label: "Teachers", value: 120 },
    { icon: <DollarSign className="w-6 h-6 text-green-500" />, label: "Total Payout", value: "₹12,50,000" },
    { icon: <Award className="w-6 h-6 text-orange-500" />, label: "Top Group", value: "Group C" },
    { icon: <BarChart2 className="w-6 h-6 text-purple-500" />, label: "Avg Performance", value: "80%" },
  ];

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Dashboard
      </h1>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {summaryStats.map((stat, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 shadow rounded-lg"
          >
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              <h4 className="text-lg font-bold text-gray-800 dark:text-white">
                {stat.value}
              </h4>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Group Performance */}
        <div className="bg-white dark:bg-gray-800 p-6 shadow rounded-lg">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Group Performance
          </h2>
       
        </div>

        {/* Teacher Payouts */}
        <div className="bg-white dark:bg-gray-800 p-6 shadow rounded-lg">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Teacher Payouts
          </h2>
        
        </div>
      </div>

      {/* Table Section */}
      <div className="mt-6 bg-white dark:bg-gray-800 p-6 shadow rounded-lg">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Teacher Performance
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                  Teacher
                </th>
                <th className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                  Group Assigned
                </th>
                <th className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                  Performance
                </th>
                <th className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                  Payout (₹)
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Teacher A", group: "Group A", performance: "85%", payout: 45000 },
                { name: "Teacher B", group: "Group B", performance: "75%", payout: 38000 },
                { name: "Teacher C", group: "Group C", performance: "92%", payout: 50000 },
              ].map((teacher, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                    {teacher.name}
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                    {teacher.group}
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                    {teacher.performance}
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                    {teacher.payout}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
