import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { gql, useQuery } from '@apollo/client';
import useUserStore from '../../app/useUserStore';

const GET_STUDENT_ATTENDANCE = gql`
  query GetStudentAttendance($StudentID: String!) {
    GetStudentAttendance(StudentID: $StudentID) {
      StudentID
      Date
      Status
      AttendanceID
      Remarks
    }
  }
`;

const CircularProgress = ({ percentage }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="transform -rotate-90 w-36 h-36">
        <circle
          className="text-gray-200"
          strokeWidth="12"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="72"
          cy="72"
        />
        <circle
          className={`${
            percentage >= 75 ? 'text-green-500' :
            percentage >= 50 ? 'text-yellow-500' :
            'text-red-500'
          }`}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="72"
          cy="72"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">{percentage}%</span>
        <span className="text-sm text-gray-500">Attendance</span>
      </div>
    </div>
  );
};

const Attendance = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarData, setCalendarData] = useState({});
  const [monthlyData, setMonthlyData] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState({
    totalPresent: 0,
    totalAbsent: 0,
    percentage: 0
  });

  const studentID = useUserStore((state) => state.user.StudentID);
  const { loading, error, data } = useQuery(GET_STUDENT_ATTENDANCE, {
    variables: { StudentID: studentID },
  });

  useEffect(() => {
    if (data?.GetStudentAttendance) {
      processAttendanceData(data.GetStudentAttendance);
    }
  }, [data]);

  const processAttendanceData = (attendanceRecords) => {
    const calendarMapping = {};
    const monthlyStats = {};
    let presentCount = 0;
    let absentCount = 0;

    attendanceRecords.forEach(record => {
      const date = new Date(record.Date);
      const day = date.getDate();
      const monthKey = date.toLocaleString('default', { month: 'short' });
      
      calendarMapping[day] = record.Status.toLowerCase();

      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = { present: 0, absent: 0, total: 0 };
      }
      monthlyStats[monthKey].total++;
      
      if (record.Status.toLowerCase() === 'present') {
        monthlyStats[monthKey].present++;
        presentCount++;
      } else if (record.Status.toLowerCase() === 'absent') {
        monthlyStats[monthKey].absent++;
        absentCount++;
      }
    });

    const chartData = Object.entries(monthlyStats).map(([month, stats]) => ({
      month,
      present: stats.present,
      absent: stats.absent,
      attendance: stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(1) : 0
    }));

    setCalendarData(calendarMapping);
    setMonthlyData(chartData);
    setAttendanceStats({
      totalPresent: presentCount,
      totalAbsent: absentCount,
      percentage: (presentCount + absentCount) > 0 ? 
        ((presentCount / (presentCount + absentCount)) * 100).toFixed(1) : 0
    });
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getAttendanceStatus = (day) => {
    return calendarData[day] || 'none';
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center text-red-600">
      Error: {error.message}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Circular Progress */}
          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center">
            <CircularProgress percentage={Number(attendanceStats.percentage)} />
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Present Days</h3>
              <p className="text-3xl font-bold text-green-600">{attendanceStats.totalPresent}</p>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${attendanceStats.percentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Absent Days</h3>
              <p className="text-3xl font-bold text-red-600">{attendanceStats.totalAbsent}</p>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${100 - attendanceStats.percentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Monthly Attendance Breakdown</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="present" fill="#10B981" name="Present" />
                  <Bar dataKey="absent" fill="#EF4444" name="Absent" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Attendance Trend</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="attendance" 
                    stroke="#6366F1" 
                    strokeWidth={2}
                    dot={{ fill: '#6366F1' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Daily Attendance</h2>
            <div className="flex items-center gap-2">
              <button 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-medium">
                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <button 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-medium text-gray-600 p-2">
                {day}
              </div>
            ))}
            
            {Array.from({ length: getDaysInMonth(currentMonth) }).map((_, index) => {
              const status = getAttendanceStatus(index + 1);
              return (
                <div
                  key={index}
                  className={`p-2 rounded-lg text-center transition-colors ${
                    status === 'present' ? 'bg-green-100 text-green-800' :
                    status === 'absent' ? 'bg-red-100 text-red-800' :
                    status === 'holiday' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-50'
                  }`}
                >
                  {index + 1}
                </div>
              );
            })}
          </div>

          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 rounded"></div>
              <span className="text-sm">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 rounded"></div>
              <span className="text-sm">Absent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-100 rounded"></div>
              <span className="text-sm">Holiday</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;