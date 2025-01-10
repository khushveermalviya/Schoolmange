import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import useUserStore from '../../../app/useUserStore.jsx';

export default function BarChart() {
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
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(54, 162, 235, 0.8)');
    gradient.addColorStop(1, 'rgba(54, 162, 235, 0.2)');

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Array.from({ length: numericData.length }, (_, i) => `Week ${i + 1}`),
        datasets: [
          {
            label: 'Current Performance',
            data: numericData,
            backgroundColor: gradient,
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
          },
          {
            label: 'Target Performance',
            data: numericData.map(() => 85), // Example target line
            type: 'line',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            pointStyle: 'star',
            pointRadius: 6,
            pointHoverRadius: 8,
          }
        ]
      },
      options: {
        responsive: true,
        animation: {
          duration: 2000,
          easing: 'easeInOutQuart',
          delay: (context) => context.dataIndex * 100
        },
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
              drawBorder: false,
            },
            ticks: {
              callback: (value) => value + '%'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#000',
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyColor: '#666',
            bodyFont: {
              size: 12
            },
            padding: 12,
            borderColor: 'rgba(54, 162, 235, 0.3)',
            borderWidth: 1,
            displayColors: true,
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || '';
                const value = context.parsed.y || 0;
                return `${label}: ${value}%`;
              }
            }
          }
        }
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [performanceData]);

  return (
    <div className="flex justify-center w-full h-80 p-4 bg-white rounded-lg shadow-lg">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}