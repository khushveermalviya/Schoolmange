import React from 'react';

const Reports = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Reports</h1>
      <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="border border-gray-200 dark:border-gray-700 px-4 py-2">Report ID</th>
            <th className="border border-gray-200 dark:border-gray-700 px-4 py-2">Student Name</th>
            <th className="border border-gray-200 dark:border-gray-700 px-4 py-2">Date</th>
            <th className="border border-gray-200 dark:border-gray-700 px-4 py-2">Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">1</td>
            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">John Doe</td>
            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">2025-01-01</td>
            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">Excellent performance</td>
          </tr>
          <tr>
            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">2</td>
            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">Jane Smith</td>
            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">2025-01-02</td>
            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">Needs improvement</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Reports;
