import React from 'react';

export default function Subjects() {
  const subjects = [
    { name: 'Mathematics', code: 'MATH101', teacher: 'John Doe', credits: 4 },
    { name: 'Science', code: 'SCI202', teacher: 'Jane Smith', credits: 3 },
    { name: 'History', code: 'HIST303', teacher: 'Emily Brown', credits: 2 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Subjects</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2">Subject Name</th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2">Code</th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2">Teacher</th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2">Credits</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">{subject.name}</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">{subject.code}</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">{subject.teacher}</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">{subject.credits}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
