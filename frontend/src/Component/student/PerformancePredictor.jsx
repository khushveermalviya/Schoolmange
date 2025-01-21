// components/PerformancePredictor.js
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

const PerformancePredictor = ({ results }) => {
  const [predictions, setPredictions] = useState(null);

  useEffect(() => {
    if (results.length > 0) {
      // Simple linear regression for each subject
      const subjects = ['English', 'Mathematics', 'Science', 'SocialStudies', 'Language', 'Computer'];
      const predictNextScores = {};

      subjects.forEach(subject => {
        const scores = results
          .map((r, index) => ({ x: index, y: r[subject] }))
          .filter(score => score.y !== null);

        if (scores.length >= 2) {
          // Calculate linear regression
          const n = scores.length;
          const sumX = scores.reduce((acc, val) => acc + val.x, 0);
          const sumY = scores.reduce((acc, val) => acc + val.y, 0);
          const sumXY = scores.reduce((acc, val) => acc + (val.x * val.y), 0);
          const sumXX = scores.reduce((acc, val) => acc + (val.x * val.x), 0);

          const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
          const intercept = (sumY - slope * sumX) / n;

          // Predict next score
          const nextScore = slope * scores.length + intercept;
          predictNextScores[subject] = Math.min(Math.max(nextScore, 0), 100);
        }
      });

      setPredictions(predictNextScores);
    }
  }, [results]);

  if (!predictions) return null;

  const chartData = {
    labels: Object.keys(predictions),
    datasets: [
      {
        label: 'Predicted Next Scores',
        data: Object.values(predictions),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: true
      }
    ]
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Predicted: ${context.raw.toFixed(1)}%`;
          }
        }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">AI Performance Prediction</h2>
      <p className="text-gray-600 mb-4">
        Based on your previous results, here are the predicted scores for your next exam:
      </p>
      
      <div className="h-64 mb-6">
        <Line data={chartData} options={chartOptions} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(predictions).map(([subject, score]) => (
          <div 
            key={subject}
            className="p-4 rounded-lg bg-gray-50"
          >
            <h3 className="text-sm font-medium text-gray-600">{subject}</h3>
            <div className="mt-1">
              <span className="text-lg font-semibold text-gray-900">
                {score.toFixed(1)}%
              </span>
              {score >= 80 ? (
                <span className="ml-2 text-green-500">↑</span>
              ) : score <= 60 ? (
                <span className="ml-2 text-red-500">↓</span>
              ) : (
                <span className="ml-2 text-yellow-500">→</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-2">
          Improvement Suggestions
        </h3>
        <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
          {Object.entries(predictions).map(([subject, score]) => {
            if (score < 70) {
              return (
                <li key={subject}>
                  Consider additional practice in {subject} to improve performance
                </li>
              );
            }
            return null;
          })}
        </ul>
      </div>
    </div>
  );
};

export default PerformancePredictor;