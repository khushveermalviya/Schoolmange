import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import useUserStore from '../../../app/useUserStore.js';

export default function PieChart() {
  const chartRef = useRef(null);
  const attendanceData = useUserStore((state) => state.attendanceData);

  useEffect(() => {
    if (!attendanceData) return;

    const ctx = chartRef.current.getContext('2d');
    const presentCount = attendanceData.filter((d) => d === 1).length;
    const absentCount = attendanceData.filter((d) => d === 0).length;

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Present', 'Absent'],
        datasets: [
          {
            data: [presentCount, absentCount],
            backgroundColor: ['rgba(75, 192, 192, 0.5)', 'rgba(255, 99, 132, 0.5)'],
          },
        ],
      },
    });
  }, [attendanceData]);

  return <canvas ref={chartRef}></canvas>;
}
