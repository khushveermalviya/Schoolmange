import React, { useState } from 'react';

const Settings = () => {
  const [name, setName] = useState('Faculty User');
  const [email, setEmail] = useState('faculty@school.com');
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Settings</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
            className="w-5 h-5 text-blue-600 dark:bg-gray-900 border-gray-200 rounded"
          />
          <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Enable Notifications</label>
        </div>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
