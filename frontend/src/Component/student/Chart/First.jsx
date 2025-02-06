import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Moon, Sun, Book, Calendar, Bell, CheckCircle, Bookmark, Trophy } from 'lucide-react';
import useUserStore from '../../../app/useUserStore';

const GET_NOTIFICATIONS = gql`
  query Notifications($studentId: ID!) {
    notifications(StudentId: $studentId) {
      NotificationId
      Title
      Message
      CreatedAt
      Priority
      IsRead
    }
  }
`;

// Theme Toggle Component
const ThemeToggle = () => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <button 
      className="btn btn-circle btn-ghost" 
      onClick={toggleTheme}
    >
      {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
    </button>
  );
};

// Custom Gauge Component
const GaugeChart = ({ value }) => {
  const COLORS = ['#22c55e', '#fbbf24', '#f97316', '#ef4444'];
  const data = [
    { name: 'Low', value: 25 },
    { name: 'Medium', value: 25 },
    { name: 'High', value: 25 },
    { name: 'Critical', value: 25 }
  ];
  const needleRotation = (value * 180 / 100) - 90;

  return (
    <div className="relative w-full h-48">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="80%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={0}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div 
        className="absolute left-1/2 bottom-[20%] w-1 h-16 bg-current origin-bottom"
        style={{ transform: `translateX(-50%) rotate(${needleRotation}deg)` }}
      />
      <div className="absolute left-1/2 bottom-[20%] w-4 h-4 rounded-full bg-current transform -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 right-0 text-center">
        <span className="font-bold text-2xl">{value}%</span>
      </div>
    </div>
  );
};

// Quote Component
const DailyQuote = ({ quote, author }) => (
  <div className="card bg-base-100 shadow-xl">
    <div className="card-body">
      <h3 className="card-title flex items-center gap-2">
        <Bookmark className="w-5 h-5" />
        Quote of the Day
      </h3>
      <blockquote className="text-lg italic">"{quote}"</blockquote>
      <p className="text-right font-semibold">- {author}</p>
    </div>
  </div>
);

export default function Dashboard() {
  const student = useUserStore((state) => state.user);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [viewedNotifications, setViewedNotifications] = useState(new Set());
  const [performanceScore, setPerformanceScore] = useState(78);

  const { loading, error, data } = useQuery(GET_NOTIFICATIONS, {
    variables: { studentId: student.StudentID },
    pollInterval: 30000,
  });

  const quotes = [
    {
      quote: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
      author: "Malcolm X"
    },
    {
      quote: "The beautiful thing about learning is that no one can take it away from you.",
      author: "B.B. King"
    },
    {
      quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill"
    }
  ];

  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  const achievements = [
    { id: 1, title: "Perfect Attendance - March", icon: <Trophy className="w-5 h-5" />, date: "2024-03-15" },
    { id: 2, title: "Math Excellence Award", icon: <Trophy className="w-5 h-5" />, date: "2024-02-28" },
    { id: 3, title: "Science Fair Winner", icon: <Trophy className="w-5 h-5" />, date: "2024-02-10" }
  ];

  const upcomingEvents = [
    { id: 1, title: "Math Final Exam", date: "2024-04-15", type: "exam" },
    { id: 2, title: "Science Project Due", date: "2024-04-20", type: "assignment" },
    { id: 3, title: "Parent-Teacher Meeting", date: "2024-04-25", type: "meeting" }
  ];

  const [todos, setTodos] = useState([
    { id: 1, task: "Complete Math Assignment", completed: false, dueDate: "2024-04-10" },
    { id: 2, task: "Read Chapter 5 of Science Book", completed: true, dueDate: "2024-04-12" },
    { id: 3, task: "Practice for History Presentation", completed: false, dueDate: "2024-04-15" }
  ]);

  const attendanceData = [
    { month: 'Jan', attendance: 95 },
    { month: 'Feb', attendance: 98 },
    { month: 'Mar', attendance: 92 },
    { month: 'Apr', attendance: 96 }
  ];

  const subjectProgress = [
    { subject: "Mathematics", completed: 75, total: 100 },
    { subject: "Science", completed: 80, total: 100 },
    { subject: "English", completed: 85, total: 100 },
    { subject: "History", completed: 70, total: 100 }
  ];

  useEffect(() => {
    // Change quote daily
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setCurrentQuote(quotes[randomIndex]);
    }, 86400000); // 24 hours

    return () => clearInterval(interval);
  }, []);

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleDismissNotification = (notificationId) => {
    setViewedNotifications(prev => new Set([...prev, notificationId]));
    setCurrentNotification(null);
  };

  return (
    <div className="min-h-screen bg-white-200 transition-colors duration-200">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-lg px-4">
        <div className="flex-1">
          <h1 className="text-xl font-bold">Student Dashboard</h1>
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <button className="btn btn-ghost btn-circle">
              <div className="indicator">
                <Bell className="h-5 w-5" />
                {data?.notifications?.length > 0 && (
                  <span className="badge badge-sm badge-primary indicator-item">
                    {data.notifications.length}
                  </span>
                )}
              </div>
            </button>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Welcome Card */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl">
                  Welcome back, {student.FirstName}!
                </h2>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Overall Performance</h3>
                  <GaugeChart value={performanceScore} />
                </div>
              </div>
            </div>

            {/* Quote Card */}
            <DailyQuote quote={currentQuote.quote} author={currentQuote.author} />

            {/* Achievements */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Recent Achievements
                </h3>
                <div className="space-y-3">
                  {achievements.map(achievement => (
                    <div key={achievement.id} className="flex items-center gap-3">
                      {achievement.icon}
                      <div>
                        <p className="font-semibold">{achievement.title}</p>
                        <p className="text-sm opacity-70">{new Date(achievement.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column */}
          <div className="space-y-6">
            {/* Progress Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjectProgress.map((subject, index) => (
                <div key={index} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title text-sm">{subject.subject}</h3>
                    <progress 
                      className="progress progress-primary w-full" 
                      value={subject.completed} 
                      max={subject.total}
                    ></progress>
                    <p className="text-right text-sm">{subject.completed}%</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Attendance Chart */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Attendance Overview</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={attendanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="attendance" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Notifications */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </h3>
                {loading && (
                  <div className="flex justify-center">
                    <span className="loading loading-spinner loading-md"></span>
                  </div>
                )}
                {error && (
                  <div className="alert alert-error">
                    <span>Error loading notifications</span>
                  </div>
                )}
                <div className="space-y-3">
                  {data?.notifications?.map((notification) => (
                    <div 
                      key={notification.NotificationId}
                      className={`alert ${
                        viewedNotifications.has(notification.NotificationId)
                          ? 'alert-ghost'
                          : 'alert-info'
                      }`}
                    >
                      <div>
                        <h4 className="font-bold">{notification.Title}</h4>
                        <p className="text-sm">{notification.Message}</p>
                      </div>
                      {!viewedNotifications.has(notification.NotificationId) && (
                        <button 
                          className="btn btn-sm btn-ghost"
                          onClick={() => handleDismissNotification(notification.NotificationId)}
                        >
                          Dismiss
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Events
                </h3>
                <div className="space-y-3">
                  {upcomingEvents.map(event => (
                    <div key={event.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{event.title}</p>
                        <p className="text-sm opacity-70">{new Date(event.date).toLocaleDateString()}</p>
                      </div>
                      <div className={`badge ${
                        event.type === 'exam' ? 'badge-warning' :
                        event.type === 'assignment' ? 'badge-info' :
                        'badge-ghost'
                      }`}>
                        {event.type}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Todo List */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Tasks
                </h3>
                <div className="space-y-3">
                  {todos.map(todo => (
                    <div key={todo.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                        className="checkbox checkbox-primary"
                      />
                      <div>
                        <p className={`font-semibold ${todo.completed ? 'line-through opacity-50' : ''}`}>
                          {todo.task}
                        </p>
                        <p className="text-sm opacity-70">Due: {new Date(todo.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className={`badge ${isOverdue(todo.dueDate) ? 'badge-error' : 'badge-ghost'}`}>
                      {isOverdue(todo.dueDate) ? 'Overdue' : 'Pending'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Study Resources */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title flex items-center gap-2">
                <Book className="w-5 h-5" />
                Study Resources
              </h3>
              <div className="space-y-3">
                {studyResources.map((resource, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-base-200 p-2 rounded-lg">
                        {resource.icon}
                      </div>
                      <div>
                        <p className="font-semibold">{resource.title}</p>
                        <p className="text-sm opacity-70">{resource.subject}</p>
                      </div>
                    </div>
                    <button className="btn btn-sm btn-ghost">View</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Footer */}
    <footer className="footer footer-center p-4 bg-base-100 text-base-content mt-8">
      <div>
        <p>Copyright © 2024 - All rights reserved</p>
      </div>
    </footer>
  </div>
);
}

// Utility functions
const isOverdue = (dueDate) => {
return new Date(dueDate) < new Date();
};

// Study Resources Data
const studyResources = [
{
  title: "Math Formula Sheet",
  subject: "Mathematics",
  icon: <Book className="w-5 h-5" />,
  link: "#"
},
{
  title: "Science Lab Manual",
  subject: "Science",
  icon: <Book className="w-5 h-5" />,
  link: "#"
},
{
  title: "History Timeline",
  subject: "History",
  icon: <Book className="w-5 h-5" />,
  link: "#"
},
{
  title: "English Literature Notes",
  subject: "English",
  icon: <Book className="w-5 h-5" />,
  link: "#"
}
];

// Add necessary styles to your CSS or Tailwind config
const customStyles = `
@layer utilities {
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}
`;

// Add to your HTML head or CSS file
const styleSheet = document.createElement("style");
styleSheet.innerText = customStyles;
document.head.appendChild(styleSheet);