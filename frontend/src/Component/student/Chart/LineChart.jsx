import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import useUserStore from '../../../app/useUserStore';

export default function LineChart() {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const performanceData = useUserStore((state) => state.performanceData);
  const attendanceData = useUserStore((state) => state.attendanceData);

  useEffect(() => {
    if (!performanceData || performanceData.length === 0) {
      console.error('No performance data available for chart.');
      return;
    }
    console.log("Attendance Data from Store: ", performanceData);
    const ctx = chartRef.current.getContext('2d');

    // Destroy existing chart instance before re-rendering
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Parse data to ensure numeric format
    const numericData = performanceData.map((value) => parseFloat(value));

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: numericData.length }, (_, i) => `Week ${i + 1}`),
        datasets: [
          {
            label: 'Performance',
            data: numericData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [performanceData]);

  return (
    <div className="flex justify-center w-full h-80">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}
