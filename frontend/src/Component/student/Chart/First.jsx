import React, { useState, useEffect } from 'react';
import LineChart from './LineChart';
import BarChart from './BarChart';
import useUserStore from '../../../app/useUserStore.jsx';

export default function First() {
  const student = useUserStore((state) => state.user);

  // Sample data (replace with actual data from your backend)
  const [gradesData, setGradesData] = useState({
    labels: ['Math', 'Science', 'English', 'History', 'Art'],
    datasets: [
      {
        label: 'Grades',
        data: [90, 85, 78, 92, 88],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  });

  const [attendanceData, setAttendanceData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Attendance %',
        data: [95, 98, 92, 96, 97, 99],
        fill: false,
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.4,
      },
    ],
  });

  // Sample To-Do List (replace with actual data)
  const initialTodos = [
    { id: 1, task: 'Complete Math Assignment', completed: false },
    { id: 2, task: 'Read Chapter 5 of Science Book', completed: true },
    { id: 3, task: 'Practice for History Presentation', completed: false },
    { id: 4, task: 'Submit Art Project', completed: false },
  ];
  const [todos, setTodos] = useState(initialTodos);

  // Function to toggle To-Do completion status
  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Quotes related to students and their future (add more as needed)
  const studentQuotes = [
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "Education is the passport to the future, for tomorrow belongs to those who prepare for it today. - Malcolm X",
    "Your education is a dress rehearsal for a life that is yours to lead. - Nora Ephron",
    "The mind is not a vessel to be filled, but a fire to be kindled. - Plutarch",
    "The beautiful thing about learning is that no one can take it away from you. - B.B. King",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
  ];

  // State to track the current quote index
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // Function to change the quote (e.g., daily)
  const changeQuote = () => {
    setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % studentQuotes.length);
  };

  // Example of fetching data/changing quote on a timer
  useEffect(() => {
    const fetchData = async () => {
      // ... Your API call logic here (if needed) ...
    };

    fetchData();

    // Change the quote every 24 hours (86400000 milliseconds)
    const quoteInterval = setInterval(changeQuote, 86400000);

    return () => {
      clearInterval(quoteInterval);
    };
  }, []);

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Welcome, Performance, and Daily Quote */}
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">
                Welcome,
              </h3>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                {student.FirstName} {student.LastName}
              </h1>

              {/* Performance Bar Chart */}
              <h3 className="text-md font-semibold text-gray-700 mb-2">
                Performance
              </h3>
              <BarChart
                data={gradesData}
                options={{ maintainAspectRatio: false }}
                height={250}
              />
            </div>

            {/* Daily Quote */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">
                Quote of the Day
              </h3>
              <p className="text-gray-800 italic">
                "{studentQuotes[currentQuoteIndex]}"
              </p>
            </div>
          </div>

          {/* Attendance and To-Do List */}
          <div className="space-y-4 md:space-y-6">
            {/* Attendance Line Chart */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <h3 className="text-md font-semibold text-gray-700 mb-2">
                Attendance
              </h3>
              <LineChart
                data={attendanceData}
                options={{ maintainAspectRatio: false }}
                height={250}
              />
            </div>

            {/* To-Do List */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">
                To-Do List
              </h3>
              <ul className="space-y-2">
                {todos.map((todo) => (
                  <li key={todo.id} className="flex items-center justify-between">
                    <span
                      className={`text-gray-800 ${
                        todo.completed ? 'line-through' : ''
                      }`}
                    >
                      {todo.task}
                    </span>
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`px-3 py-1 rounded-md text-xs font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        todo.completed
                          ? 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-300'
                      }`}
                    >
                      {todo.completed ? 'Completed' : 'Mark Complete'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Additional Student-Related Information */}
          <div className="space-y-4 md:space-y-6">
            {/* Upcoming Events (Example) */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">
                Upcoming Events
              </h3>
              <ul className="list-disc list-inside">
                <li>
                  <span className="text-gray-800">
                    Science Fair - April 20th
                  </span>
                </li>
                <li>
                  <span className="text-gray-800">
                    Parent-Teacher Conference - April 25th
                  </span>
                </li>
                <li>
                  <span className="text-gray-800">
                    Math Competition - May 5th
                  </span>
                </li>
              </ul>
            </div>

            {/* Study Tips (Example) */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">
                Study Tips
              </h3>
              <ul className="list-disc list-inside">
                <li>
                  <span className="text-gray-800">
                    Create a study schedule and stick to it.
                  </span>
                </li>
                <li>
                  <span className="text-gray-800">
                    Find a quiet place to study where you won't be disturbed.
                  </span>
                </li>
                <li>
                  <span className="text-gray-800">
                    Take breaks to avoid burnout.
                  </span>
                </li>
                <li>
                  <span className="text-gray-800">
                    Test yourself regularly to reinforce what you've learned.
                  </span>
                </li>
                <li>
                  <span className="text-gray-800">
                    Don't be afraid to ask for help when you need it.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}