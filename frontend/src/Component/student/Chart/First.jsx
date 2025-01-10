import React from 'react';
import LineChart from './LineChart';
import BarChart from './BarChart';
import RadarChart from './RadarChart';
import PolarChart from './PolarChart';
import DoughnutChart from './DoughnutChart';
import useUserStore from '../../../app/useUserStore.jsx';

export default function First() {
  const studentData = {
    StudentID: "STD123",
    FirstName: "John",
    LastName: "Doe",
    Class: "XII-A",
    Email: "john.doe@school.com",
    FatherName: "James Doe",
    MotherName: "Jane Doe",
    TotalPresent: "132",
    TotalAbsenet: "24"
  };

  const student = useUserStore((state)=>state.user)
    const totalClasses = parseInt(studentData.TotalPresent) + parseInt(studentData.TotalAbsenet);
  const attendancePercentage = ((parseInt(studentData.TotalPresent) / totalClasses) * 100).toFixed(1);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-gray-50">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Welcome,</h3>
      <h1 className='text-2xl text-black'>{student.FirstName} {student.LastName}</h1>
      <div className='flex justify-center flex-col'>
      <div className="w-full h-4 bg-gray-200 rounded-full">
          <div 
            className={`h-4 rounded-full ${attendancePercentage >= 75 ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ width: `${attendancePercentage}%` }}
          ></div>
        </div>

      </div>

      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Bar Chart</h3>
        <BarChart />
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Radar Chart</h3>
        <RadarChart />
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Polar Chart</h3>
        <PolarChart />
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Doughnut Chart</h3>
        <DoughnutChart />
      </div>
    </div>
  );
}