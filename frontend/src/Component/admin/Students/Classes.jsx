import React, { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
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
    <div className='flex flex-col justify-center items-center w-full h-full'>
      <h2 className='text-xl'>Class Details</h2>
      {filtered.length > 0 ? (
        filtered.map((student, index) => (
          <div className='flex' key={index}>
            <NavLink to={`details/${student.std_id}`}>
              <img
                className='bg-slate-400 border-2 w-1/2 hover:scale-90 transition-transform'
                src={student.photo_url}
                alt={`${student.std_name}'s photo`}
              />
              <div className='flex flex-col items-center'>
                <p className='text-2xl text-center'>Student Name: {student.std_name}</p>
                <p className='text-center'>Father's Name: {student.father_name}</p>
                <p>Class: {student.classs}</p>
                <p>Student ID: {student.std_id}</p>
              </div>
            </NavLink>
          </div>
        ))
      ) : (
        <p>No students found for this class.</p>
      )}
    </div>
  );
}