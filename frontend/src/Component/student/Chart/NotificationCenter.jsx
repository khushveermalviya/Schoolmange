import React, { useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { useQuery, gql } from '@apollo/client';
import useNotificationStore from '../../../app/notificationStore.js';
import useUserStore from '../../../app/useUserStore';
import { CustomAlert, CustomAlertTitle, CustomAlertDescription } from './CustomAlert.jsx'; // Import custom alert components

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

const NotificationCenter = ({ className }) => {
  const [showNotifications, setShowNotifications] = React.useState(false);
  const { notifications, setNotifications, removeNotification } = useNotificationStore();
  const user = useUserStore((state) => state.user);

  const { data, loading, error } = useQuery(GET_NOTIFICATIONS, {
    variables: { studentId: user.StudentID },
    pollInterval: 30000,
    skip: !user.StudentID,
  });

  useEffect(() => {
    console.log(data)
    if (data?.notifications) {
      setNotifications(data.notifications);
    }
  }, [data, setNotifications]);

  const getPriorityStyles = (type, priority) => {
    const baseStyles = "mb-4 transition-all duration-300";
    const priorityColor = priority === 'HIGH' ? '500' : priority === 'MEDIUM' ? '400' : '300';

    switch (type) {
      case 'EMERGENCY':
        return `${baseStyles} border-red-${priorityColor} bg-red-50 text-red-800`;
      case 'FEES':
        return `${baseStyles} border-yellow-${priorityColor} bg-yellow-50 text-yellow-800`;
      case 'HOLIDAY':
        return `${baseStyles} border-green-${priorityColor} bg-green-50 text-green-800`;
      case 'ANNOUNCEMENT':
        return `${baseStyles} border-blue-${priorityColor} bg-blue-50 text-blue-800`;
      default:
        return `${baseStyles} border-gray-${priorityColor} bg-gray-50 text-gray-800`;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) return <div>Loading notifications...</div>;  // Handle loading state
  if (error) return <div>Error loading notifications: {error.message}</div>;  // Handle errors

  if (!user) return null;

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="fixed top-4 right-4 p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Bell className="h-6 w-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
      {showNotifications && (
        <div className="absolute top-12 right-4 w-96 bg-white shadow-lg rounded-lg p-4">
          {notifications.map((notification) => (
            <CustomAlert
              key={notification.NotificationId}
              className={getPriorityStyles(notification.Type, notification.Priority)}
            >
              <CustomAlertTitle>{notification.Title}</CustomAlertTitle>
              <CustomAlertDescription>{notification.Message}</CustomAlertDescription>
              <button onClick={() => removeNotification(notification.NotificationId)}>
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </CustomAlert>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;