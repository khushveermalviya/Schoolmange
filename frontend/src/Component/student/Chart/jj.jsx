import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BookOpen } from 'lucide-react';

const SubjectProgressChart = ({ subjectProgress }) => {
  // Transform the data for Recharts
  const chartData = subjectProgress.map(subject => ({
    name: subject.subject,
    progress: subject.completed,
    total: subject.total
  }));
  
  // Define colors based on progress percentage
  const getBarColor = (percent) => {
    if (percent >= 80) return "#22c55e"; // Green for excellent
    if (percent >= 60) return "#3b82f6"; // Blue for good
    if (percent >= 40) return "#eab308"; // Yellow for average
    return "#ef4444"; // Red for needs improvement
  };

  return (
    <div className="card bg-transparent shadow-xl">
      <div className="card-body">
        <h3 className="card-title flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Your Subject Progress
        </h3>
        <div className="divider"></div>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis 
                type="number" 
                domain={[0, 100]} 
                tickCount={6} 
                tick={{ fontSize: 12 }}
                label={{ value: 'Completion (%)', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                dataKey="name"
                type="category" 
                tick={{ fontSize: 12 }}
                width={80}
              />
              <Tooltip
                formatter={(value) => [`${value}% Complete`, 'Progress']}
                labelStyle={{ fontWeight: 'bold' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
              />
              <Bar 
                dataKey="progress" 
                radius={[0, 4, 4, 0]}
                barSize={20}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.progress)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-2">
          {subjectProgress.map((subject, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getBarColor(subject.completed) }}
              ></div>
              <span className="text-sm font-medium">{subject.subject}: {subject.completed}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubjectProgressChart;