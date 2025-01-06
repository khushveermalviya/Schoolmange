import React from 'react';
import LineChart from './LineChart';
import BarChart from './BarChart';
import RadarChart from './RadarChart';
import PolarChart from './PolarChart';
import DoughnutChart from './DoughnutChart';

export default function First() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-gray-50">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Line Chart</h3>
        <LineChart />
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