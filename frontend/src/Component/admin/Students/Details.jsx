import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function Details() {
  const { userid, studentId } = useParams(); // Extract userid and studentId from the URL
  const [student, setStudent] = useState(null);

  useEffect(() => {
    axios.get(`https://backend-mauve-ten.vercel.app/details/${studentId}`) // Pass studentId in the URL
      .then(response => {
        setStudent(response.data);
        console.log(response.data);
         // Set the student data
      })
      .catch(error => {
        console.error("Error fetching student:", error);
      });
  }, [studentId]);

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Student Details</h1>
      <div className="flex flex-col md:flex-row items-center md:items-start bg-white shadow-md rounded-lg p-4">
        <div className="w-32 h-32 md:w-48 md:h-48 mb-4 md:mb-0">
          <img
            src={student.photo_url
            }
            alt={`${student.name}'s photo`}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div className="md:ml-6 flex-1">
          <p className="text-lg"><strong>Name:</strong> {student.std_name}</p>
          <p className="text-lg"><strong>Father's Name:</strong> {student.father_name
          }</p>
          <p className="text-lg"><strong>Class:</strong> {student.classs }</p>
          <p className="text-lg"><strong>Admission Date:</strong> {student. admission_date}</p>
          <p className="text-lg"><strong>Attendance:</strong> {student.attendance}</p>
          <p className="text-lg"><strong>Address:</strong> {student.address}</p>
          <p className="text-lg"><strong>Address:</strong> {student.result}</p>
          <p className="text-lg"><strong>Address:</strong> {student.mobile_number}</p>
          <p className="text-lg"><strong>Address:</strong> {student.previous_school}</p>
          <p className="text-lg"><strong>Address:</strong> {student.mobile_number}</p>
          <p className="text-lg"><strong>Address:</strong> {student.class_teacher}</p>
          <p className="text-lg"><strong>Address:</strong> {student.parent_number}</p>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-4 mt-4">
        <h2 className="text-xl font-bold mb-2">Results</h2>
        <ul className="list-disc list-inside">
          {/* Map over student's results here if available */}
        </ul>
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={() => alert('Add Attendance')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Attendance
        </button>
        <button
          onClick={() => alert('Add Result')}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Result
        </button>
      </div>
    </div>
  );
}
