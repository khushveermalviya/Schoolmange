
import React from 'react';

export default function StatCard({ title, value, icon, trend }) {
  const isPositive = trend >= 0;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</h3>
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{trend}%
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">vs last month</span>
        </div>
      )}
    </div>
  );
}