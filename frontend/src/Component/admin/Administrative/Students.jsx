import React from 'react';

const students = [
  { id: 1, name: 'John Doe', class: '10th Grade', rollNo: '123' },
  { id: 2, name: 'Jane Smith', class: '9th Grade', rollNo: '456' },
];

const Students = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Students</h1>
      <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="border border-gray-200 dark:border-gray-700 px-4 py-2">Roll No</th>
            <th className="border border-gray-200 dark:border-gray-700 px-4 py-2">Name</th>
            <th className="border border-gray-200 dark:border-gray-700 px-4 py-2">Class</th>
            <th className="border border-gray-200 dark:border-gray-700 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">{student.rollNo}</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">{student.name}</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">{student.class}</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                <button className="text-blue-600 hover:underline">View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Students;
