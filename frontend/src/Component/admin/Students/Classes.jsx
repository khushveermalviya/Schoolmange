import React, { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';

export default function Classes() {
  const { userid } = useParams();  // Get the class ID from URL params
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch student data from the backend using axios
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:5000/graphql', {
          query: `query GetStudents { students { std_id std_name father_name class address mobile_number } }`
        });
        
        const students = response.data.data.students;

        // Filter students based on the class (userid)
        const filteredData = students.filter(student => student.class.toString() === userid.toString());

        console.log("Filtered Data:", filteredData);
        setFiltered(filteredData);
        setLoading(false);
      } catch (error) {
        setError('An error occurred while fetching student data.');
        setLoading(false);
        console.error(error);
      }
    };

    fetchData();
  }, [userid]);

  // Function to generate an Excel sheet
  const handleGenerateExcel = () => {
    const dataToExport = filtered.map(student => ({
      'Student Name': student.std_name,
      'Father\'s Name': student.father_name,
      'Class': student.class,
      'Student ID': student.std_id,
      'Address': student.address,
      'Mobile Number': student.mobile_number,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    XLSX.writeFile(workbook, `Class_${userid}_Students.xlsx`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className='flex w-full justify-center'>
        <button 
          className='text-xl bg-green-500 mr-7 border-4 w-62 text-center' 
          onClick={handleGenerateExcel}
        >
          Generate Excel
        </button>
      </div>
      <div className='flex'>
        <h2 className='text-center w-full text-4xl mb-3'>Students Details</h2>
      </div>
      <div className='flex flex-col md:flex-wrap md:flex-row md:min-h-full justify-center gap-10 items-center w-full min-full-screen'>
        {filtered.length > 0 ? (
          filtered.map((student, index) => (
            <div className='items-center flex min-w-1/2 h-full text-center' key={index}>
              <NavLink to={`details/${student.std_id}`}>
                <div className='flex flex-col items-center text-center w-full bg-slate-200'>
                  <p className='text-2xl text-center'>{student.std_name}</p>
                  <p className='text-center'>Father's Name: {student.father_name}</p>
                  <p>Class: {student.class}</p>
                  <p>Student ID: {student.std_id}</p>
                </div>
              </NavLink>
            </div>
          ))
        ) : (
          <p>No students found for this class.</p>
        )}
      </div>
    </>
  );
}
