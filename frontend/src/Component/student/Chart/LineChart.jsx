import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import useUserStore from '../../../app/useUserStore.js';

export default function LineChart() {
  const chartRef = useRef(null);
  const performanceData = useUserStore((state) => state.performanceData);

  useEffect(() => {
    if (!performanceData) return;

    const ctx = chartRef.current.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: performanceData.length }, (_, i) => `Week ${i + 1}`),
        datasets: [
          {
            label: 'Performance',
            data: performanceData,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
          },
        ],
      },
    });
  }, [performanceData]);

  return <canvas ref={chartRef}></canvas>;
}
