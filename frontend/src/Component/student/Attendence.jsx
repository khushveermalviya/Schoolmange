import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';

export default function Attendence() {
  const [value, setValue] = useState(new Date());
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    // Mock fetching data; Replace with API call using token
    const mockAttendance = [
      { date: '2024-12-01', status: 'present' },
      { date: '2024-12-02', status: 'absent' },
    ];
    setAttendance(mockAttendance);
  }, []);

  const getTileContent = ({ date }) => {
    const dayStatus = attendance.find(att => att.date === date.toISOString().split('T')[0]);
    if (dayStatus) {
      return <div className={dayStatus.status === 'present' ? 'bg-green-500' : 'bg-red-500'}></div>;
    }
    return null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Calendar value={value} tileContent={getTileContent} />
    </div>
  );
}
