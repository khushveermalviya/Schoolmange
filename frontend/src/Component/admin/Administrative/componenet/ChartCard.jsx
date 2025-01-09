import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function ChartCard({ title, type, data, options = {}, className = '' }) {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          color: document.documentElement.classList.contains('dark') ? 'white' : 'black',
        },
      },
      title: {
        display: true,
        text: title,
        color: document.documentElement.classList.contains('dark') ? 'white' : 'black',
      },
    },
    scales: type !== 'doughnut' ? {
      y: {
        beginAtZero: true,
        grid: {
          color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? 'white' : 'black',
        }
      },
      x: {
        grid: {
          color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? 'white' : 'black',
        }
      }
    } : {}
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    plugins: {
      ...defaultOptions.plugins,
      ...options.plugins,
    },
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return <Line data={data} options={mergedOptions} />;
      case 'doughnut':
        return <Doughnut data={data} options={mergedOptions} />;
      default:
        return <Line data={data} options={mergedOptions} />;
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg ${className}`}>
      <div className="h-[300px]">
        {renderChart()}
      </div>
    </div>
  );
}