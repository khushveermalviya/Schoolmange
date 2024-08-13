import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function Classes() {
  const { userid } = useParams(); // Extract userid from the URL
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3334/list")
      .then(response => {
        setStudents(response.data); // Set the student data
      })
      .catch(error => {
        console.error("Error fetching students:", error);
      });
  }, []);

  useEffect(() => {

    const useridString = userid.toString();
    const filteredData = students.filter(student => {
      return student.classs.toString() === useridString;
    });
    setFiltered(filteredData);
  }, [students, userid]);

  return (
    <div>
      <h2>Class Details</h2>
      {filtered.length > 0 ? (
        filtered.map((student, index) => (
          <div key={index}>
            <p>Student Name: {student.std_name}</p>
            <p>Father's Name: {student.father_name}</p>
            <p>Class: {student.classs}</p>
            <p>Student ID: {student.std_id}</p>
          </div>
        ))
      ) : (
        <p>No students found for this class.</p>
      )}
    </div>
  );
}
