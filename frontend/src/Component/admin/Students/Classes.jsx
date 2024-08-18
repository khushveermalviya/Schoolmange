import React, { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';

export default function Classes() {
  const { userid } = useParams(); // Extract userid from the URL
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    axios.get("https://backend-mauve-ten.vercel.app/list")
      .then(response => {
        const studentsWithClass = response.data.map(student => ({
          ...student,
          classs: student.classs || student.class // Adjust according to actual field name
        }));
        setStudents(studentsWithClass);
        console.log("Mapped Students:", studentsWithClass);
      })
      .catch(error => {
        console.error("Error fetching students:", error);
      });
  }, []);

  

useEffect(() => {
  const filteredData = students.filter(student => {
    if (student.classs === undefined) {
      console.warn(`Student ${student.std_name} is missing the 'classs' field`);
      return false;
    }
    return student.classs.toString() === userid.toString();
  });

  console.log("Filtered Data:", filteredData);
  
  setFiltered(filteredData);
}, [students, userid]);


  const handleGenerateExcel = () => {
    const dataToExport = filtered.map(student => ({
      'Student Name': student.std_name,
      'Father\'s Name': student.father_name,
      'Class': student.class,
      'Student ID': student.std_id,
      'Address': student.address,
      'Mobile Number': student.mobile_number,
      // Add more columns here as needed
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    XLSX.writeFile(workbook, `Class_${userid}_Students.xlsx`);
  };

  return (
    <>
    <div className='flex w-full justify-center'>
      <button 
          className='text-xl bg-green-500 mr-7  border-4 w-62 text-center' 
          onClick={handleGenerateExcel}
        >
          Generate Excel
        </button>
        </div>
      <div className='flex '>
        <h2 className='text-center w-full text-4xl mb-3'>Students Details</h2>
      
      </div>
    
      <div className='flex flex-col md:flex-wrap  md:flex-row md:min-h-full justify-center gap-10 items-center w-full min-full-screen'>
        {filtered.length > 0 ? (
          filtered.map((student, index) => (
            <div className='items-center flex   min-w-1/2 h-full text-center'key={index}>
              <NavLink to={`details/${student.std_id}`}>
                {/* <img
                  className='bg-slate-400 border-2 w-1/2 hover:scale-90 transition-transform'
                  src={student.photo_url}
                  alt={`${student.std_name}'s photo`}
                /> */}
                <div className='flex flex-col items-center text-center w-full bg-slate-200'>
                  <p className='text-2xl text-center '>{student.std_name}</p>
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
