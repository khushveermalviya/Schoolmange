import React from 'react';

export default function Timetable() {
  const timetable = [
    { day: 'Monday', subject: 'Mathematics', time: '9:00 AM - 10:30 AM' },
    { day: 'Monday', subject: 'Science', time: '11:00 AM - 12:30 PM' },
    { day: 'Tuesday', subject: 'History', time: '9:00 AM - 10:30 AM' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Timetable</h2>
      <div className="space-y-4">
        {timetable.map((entry, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-4 rounded-lg bg-gray-100 dark:bg-gray-700"
          >
            <span className="font-medium text-gray-700 dark:text-gray-300">{entry.day}</span>
            <span className="text-gray-600 dark:text-gray-400">{entry.subject}</span>
            <span className="text-gray-500 dark:text-gray-400">{entry.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
