import React from 'react';

export default function Attendance() {
  const attendance = [
    { date: '2025-01-08', status: 'Present' },
    { date: '2025-01-07', status: 'Absent' },
    { date: '2025-01-06', status: 'Present' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Attendance</h2>
      <div className="space-y-3">
        {attendance.map((record, index) => (
          <div
            key={index}
            className={`flex justify-between items-center p-4 rounded-lg ${
              record.status === 'Present'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}
          >
            <span>{record.date}</span>
            <span>{record.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
