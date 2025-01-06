import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import PolarChartResult from './Chart/PolarChartResult';
const ResultPage = () => {
  const [selectedTest, setSelectedTest] = useState('first');

  const testData = {
    first: {
      title: 'First Term Test',
      subjects: {
        science: 78,
        hindi: 82,
        english: 88,
        maths: 75,
        gk: 90
      },
      total: 413,
      percentage: 82.6
    },
    second: {
      title: 'Second Term Test',
      subjects: {
        science: 85,
        hindi: 79,
        english: 92,
        maths: 80,
        gk: 88
      },
      total: 424,
      percentage: 84.8
    },
    halfYearly: {
      title: 'Half Yearly Exam',
      subjects: {
        science: 88,
        hindi: 85,
        english: 90,
        maths: 82,
        gk: 92
      },
      total: 437,
      percentage: 87.4
    },
    third: {
      title: 'Third Term Test',
      subjects: {
        science: 82,
        hindi: 88,
        english: 85,
        maths: 78,
        gk: 89
      },
      total: 422,
      percentage: 84.4
    },
    yearly: {
      title: 'Final Year Exam',
      subjects: {
        science: 90,
        hindi: 87,
        english: 92,
        maths: 85,
        gk: 94
      },
      total: 448,
      percentage: 89.6
    }
  };

  const getPerformanceAlert = (marks) => {
    if (marks < 40) return 'Needs immediate attention';
    if (marks < 60) return 'Needs improvement';
    if (marks < 75) return 'Good, but can improve';
    return null;
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Academic Results</h1>
      
      {/* Tabs using Daisy UI */}
      <div className="tabs tabs-boxed justify-center">
        {Object.entries(testData).map(([key, data]) => (
          <button
            key={key}
            className={`tab ${selectedTest === key ? 'tab-active' : ''}`}
            onClick={() => setSelectedTest(key)}
          >
            {data.title}
          </button>
        ))}
      </div>

      {/* Card using Daisy UI */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">{testData[selectedTest].title}</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Results Table */}
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th className="text-right">Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(testData[selectedTest].subjects).map(([subject, marks]) => (
                    <tr key={subject}>
                      <td className="capitalize">{subject}</td>
                      <td className="text-right">{marks}/100</td>
                    </tr>
                  ))}
                  <tr className="font-bold">
                    <td>Total</td>
                    <td className="text-right">{testData[selectedTest].total}/500</td>
                  </tr>
                  <tr className="font-bold">
                    <td>Percentage</td>
                    <td className="text-right">{testData[selectedTest].percentage}%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Polar Chart */}
            <PolarChartResult data={testData[selectedTest].subjects} />
          </div>

          {/* Performance Alerts */}
          <div className="space-y-3">
            {Object.entries(testData[selectedTest].subjects).map(([subject, marks]) => {
              const alert = getPerformanceAlert(marks);
              if (alert) {
                return (
                  <div key={subject} className="alert alert-warning">
                    <AlertTriangle className="h-4 w-4" />
                    <span>
                      {subject.toUpperCase()}: {alert} ({marks}%)
                    </span>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;