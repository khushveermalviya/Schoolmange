import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import useUserStore from '../../../app/useUserStore.jsx';

export default function PolarChart() {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const performanceData = useUserStore((state) => state.performanceData);

  useEffect(() => {
    if (!performanceData || performanceData.length === 0) {
      console.error('No performance data available for chart.');
      return;
    }

    const ctx = chartRef.current.getContext('2d');

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const numericData = performanceData.map((value) => parseFloat(value));

    chartInstanceRef.current = new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels: Array.from({ length: numericData.length }, (_, i) => `Week ${i + 1}`),
        datasets: [{
          label: 'Performance',
          data: numericData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
          ],
          borderWidth: 1
        }],
      },
      options: {
        responsive: true,
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