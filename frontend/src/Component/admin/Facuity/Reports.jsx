import React from 'react';

export default function Reports() {
  const reports = [
    { title: 'Midterm Results', date: '2025-01-05', link: '#' },
    { title: 'Attendance Summary', date: '2025-01-01', link: '#' },
    { title: 'Project Grades', date: '2024-12-20', link: '#' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Reports</h2>
      <ul className="space-y-3">
        {reports.map((report, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-4 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <span>{report.title}</span>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">{report.date}</span>
              <a
                href={report.link}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                View
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
