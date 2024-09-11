import React, { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { ApolloClient, InMemoryCache, gql, useQuery } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:3334/graphql',
  cache: new InMemoryCache()
});

const GET_STUDENTS = gql`
  query GetStudents {
    students {
      std_id
      std_name
      father_name
      class
      address
      mobile_number
    }
  }
`;
console.log("d");

export default function Classes() {
  const { userid } = useParams();
  
  const [filtered, setFiltered] = useState([]);

  const { loading, error, data } = useQuery(GET_STUDENTS, { client });

  useEffect(() => {
    if (data) {
      const studentsWithClass = data.students.map(student => ({
        ...student,
        classs: student.classs || student.class // Adjust according to actual field name
      }));

      const filteredData = studentsWithClass.filter(student => {
        if (student.classs === undefined) {
          console.warn(`Student ${student.std_name} is missing the 'classs' field`);
          return false;
        }
        return student.classs.toString() === userid.toString();
      });

      console.log("Filtered Data:", filteredData);
      setFiltered(filteredData);
    }
  }, [data, userid]);

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

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
            <div className='items-center flex   min-w-1/2 h-full text-center' key={index}>
              <NavLink to={`details/${student.std_id}`}>
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