// ResultPage.js
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Download, Search, Calendar } from 'lucide-react';
import { gql } from '@apollo/client';
import useUserStore from '../../app/useUserStore';
import jsPDF from "jspdf";
import 'jspdf-autotable';

const GET_STUDENT_RESULTS = gql`
  query GetStudentResults($StudentID: String!, $ExamType: String) {
    getStudentResults(StudentID: $StudentID, ExamType: $ExamType) {
      ResultID
      StudentID
      ExamTypeID
      ExamType
      SubjectName
      MarksObtained
      MaxMarks
      ExamDate
      Semester
      AcademicYear
      Grade
      Remarks
    }
  }
`;

// PDF Generation Helper
const generatePDF = (studentInfo, results) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(24);
  doc.setTextColor(40, 40, 40);
  doc.text(studentInfo.SchoolName, 105, 20, { align: 'center' });
  
  doc.setFontSize(16);
  doc.text('STUDENT REPORT CARD', 105, 30, { align: 'center' });
  
  // Student Details
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  
  const studentDetails = [
    ['Student Name:', `${studentInfo.FirstName} ${studentInfo.LastName}`],
    ['Class:', '7'],
    ["Father's Name:", studentInfo.FatherName],
    ['Student ID:', studentInfo.StudentID],
    ['Academic Year:', results[0]?.AcademicYear || '2023-24']
  ];
  
  let yPos = 45;
  studentDetails.forEach(([label, value]) => {
    doc.text(`${label} ${value}`, 20, yPos);
    yPos += 10;
  });
  
  // Results Table
  const tableData = results.map(result => [
    result.SubjectName,
    result.MarksObtained,
    result.MaxMarks,
    `${((result.MarksObtained/result.MaxMarks) * 100).toFixed(1)}%`,
    result.Grade,
    result.TeacherName
  ]);
  
  doc.autoTable({
    startY: yPos + 10,
    head: [['Subject', 'Marks', 'Max Marks', 'Percentage', 'Grade', 'Teacher']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [63, 81, 181],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 10,
      cellPadding: 5
    }
  });
  
  // Calculate totals
  const totalObtained = results.reduce((sum, r) => sum + r.MarksObtained, 0);
  const totalMax = results.reduce((sum, r) => sum + r.MaxMarks, 0);
  const percentage = ((totalObtained/totalMax) * 100).toFixed(1);
  
  const finalY = doc.lastAutoTable.finalY + 20;
  
  // Add totals
  doc.text(`Total Marks: ${totalObtained}/${totalMax}`, 20, finalY);
  doc.text(`Overall Percentage: ${percentage}%`, 20, finalY + 10);
  
  // Signature spaces
  doc.text('_________________', 30, finalY + 40);
  doc.text('Class Teacher', 35, finalY + 45);
  
  doc.text('_________________', 100, finalY + 40);
  doc.text('Principal', 110, finalY + 45);
  
  doc.text('_________________', 170, finalY + 40);
  doc.text('Parent/Guardian', 175, finalY + 45);
  
  doc.save(`${studentInfo.FirstName}_Report_Card.pdf`);
};

const ResultPage = () => {
  const [selectedExam, setSelectedExam] = useState('');
  const [results, setResults] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [gradeDistribution, setGradeDistribution] = useState([]);
  
  const user = useUserStore((state) => state.user);
  const { StudentID, FirstName, LastName, FatherName, SchoolName, WeeklyPerformance } = user;

  const { loading, error, data } = useQuery(GET_STUDENT_RESULTS, {
    variables: { 
      StudentID, 
      ExamType: selectedExam || null  // Send null if selectedExam is empty
    },
  });

  const COLORS = ['#3F51B5', '#4CAF50', '#FFC107', '#FF5722', '#9C27B0'];
  const GRADE_COLORS = {
    'A+': '#4CAF50',
    'A': '#8BC34A',
    'B': '#FFC107',
    'C': '#FF9800',
    'D': '#FF5722',
    'F': '#F44336'
  };

  useEffect(() => {
    if (data) {
      const results = data.getStudentResults;
      setResults(results);

      // Performance Data
      const performanceTrend = results.map(result => ({
        subject: result.SubjectName,
        percentage: ((result.MarksObtained/result.MaxMarks) * 100).toFixed(1),
        marks: result.MarksObtained,
        maxMarks: result.MaxMarks
      }));
      setPerformanceData(performanceTrend);

      // Grade Distribution
      const gradeCount = results.reduce((acc, result) => {
        acc[result.Grade] = (acc[result.Grade] || 0) + 1;
        return acc;
      }, {});
      
      const gradeData = Object.entries(gradeCount).map(([grade, count]) => ({
        grade,
        count,
        percentage: ((count/results.length) * 100).toFixed(1)
      }));
      setGradeDistribution(gradeData);
    }
  }, [data]);

  const handleExport = () => {
    generatePDF({ FirstName, LastName, FatherName, SchoolName, StudentID }, results);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Error loading results: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Student Info Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500">Student Name</h3>
              <p className="text-lg font-semibold text-gray-900">{FirstName} {LastName}</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500">Father's Name</h3>
              <p className="text-lg font-semibold text-gray-900">{FatherName}</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500">School</h3>
              <p className="text-lg font-semibold text-gray-900">{SchoolName}</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500">Class</h3>
              <p className="text-lg font-semibold text-gray-900">7</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500">Student ID</h3>
              <p className="text-lg font-semibold text-gray-900">{StudentID}</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Performance Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Subject Performance</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="subject" angle={-45} textAnchor="end" height={80} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="percentage" 
                    name="Percentage" 
                    fill="#3F51B5" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Grade Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Grade Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gradeDistribution}
                    dataKey="count"
                    nameKey="grade"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {gradeDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={GRADE_COLORS[entry.grade] || COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <h2 className="text-xl font-semibold">Detailed Results</h2>
              <div className="flex items-center space-x-4">
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="First">First Test</option>
                  <option value="Second">Second Test</option>
                  <option value="Third">Third Test</option>
                  <option value="Half">Half Yearly</option>
                  <option value="Yearly">Yearly</option>
                </select>
                <button 
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Subject</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Marks</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Percentage</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Grade</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Teacher</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {results.map((result, index) => {
                  const percentage = ((result.MarksObtained/result.MaxMarks) * 100).toFixed(1);
                  return (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900">{result.SubjectName}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {result.MarksObtained}/{result.MaxMarks}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{percentage}%</td>
                      <td className="px-6 py-4">
                        <span 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${GRADE_COLORS[result.Grade]}20`,
                            color: GRADE_COLORS[result.Grade]
                          }}
                        >
                          {result.Grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{result.TeacherName}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <span className={`${
                          result.Remarks.toLowerCase().includes('excellent') ? 'text-green-600' :
                          result.Remarks.toLowerCase().includes('good') ? 'text-blue-600' :
                          result.Remarks.toLowerCase().includes('improve') ? 'text-orange-600' :
                          'text-gray-600'
                        }`}>
                          {result.Remarks}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-6 py-4 text-sm font-semibold">Total</td>
                  <td className="px-6 py-4 text-sm font-semibold">
                    {results.reduce((sum, r) => sum + r.MarksObtained, 0)}/
                    {results.reduce((sum, r) => sum + r.MaxMarks, 0)}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold">
                    {((results.reduce((sum, r) => sum + r.MarksObtained, 0) / 
                      results.reduce((sum, r) => sum + r.MaxMarks, 0)) * 100).toFixed(1)}%
                  </td>
                  <td colSpan="3"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Weekly Performance Tracker */}
       

        {/* Floating Export Button */}
        <div className="fixed bottom-6 right-6">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
          >
            <Download className="w-5 h-5" />
            <span>Export Report Card</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;