import React from 'react';

const facilities = [
  {
    id: 1,
    name: 'Computer Lab',
    description: 'Equipped with modern computers and high-speed internet for learning and projects.',
    icon: '💻',
  },
  {
    id: 2,
    name: 'Library',
    description: 'A wide range of books, journals, and digital resources for students and faculty.',
    icon: '📚',
  },
  {
    id: 3,
    name: 'Sports Ground',
    description: 'A large playground for various outdoor sports and physical activities.',
    icon: '⚽',
  },
  {
    id: 4,
    name: 'Science Lab',
    description: 'Fully equipped for practical experiments in physics, chemistry, and biology.',
    icon: '🔬',
  },
  {
    id: 5,
    name: 'Auditorium',
    description: 'Spacious and equipped with audio-visual technology for events and seminars.',
    icon: '🎭',
  },
];

const Facilities = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Facilities</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((facility) => (
          <div
            key={facility.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 shadow-md"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">{facility.icon}</div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{facility.name}</h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{facility.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Facilities;
