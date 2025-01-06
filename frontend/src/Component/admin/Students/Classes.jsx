import React, { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { useLazyQuery, gql } from '@apollo/client';

const STUDENTS_BY_CLASS_QUERY = gql`
  query Studentdata($Class: String!) {
    Studentdata(Class: $Class) {
      StudentID
      FirstName
      LastName
      Class
    }
  }
`;

export default function Classes() {
  const { classId } = useParams();  // Get the class ID from URL params
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [fetchStudents, { data }] = useLazyQuery(STUDENTS_BY_CLASS_QUERY, {
    variables: { Class: classId },
    onCompleted: (data) => {
      setFiltered(data.Studentdata || []);
      setLoading(false);
    },
    onError: (error) => {
      setError('An error occurred while fetching student data.');
      setLoading(false);
      console.error(error);
    },
  });

  useEffect(() => {
    fetchStudents();

  }, [classId, fetchStudents]);

  // Function to generate an Excel sheet
  const handleGenerateExcel = () => {
    const dataToExport = filtered.map(student => ({
      'Student Name': student.FirstName,
      'Last Name': student.LastName,
      'Class': student.Class,
      'Student ID': student.StudentID,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    XLSX.writeFile(workbook, `Class_${classId}_Students.xlsx`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className='flex w-full '>
    
      </div>
      <div className='flex justify-start'>
        <h2 className='text-center w-full text-4xl mb-3'>Students Details</h2>
      </div>
      <div className='flex flex-col md:flex-wrap md:flex-row md:min-h-full justify-center gap-10 items-center w-full min-full-screen'>
        {filtered.length > 0 ? (
          filtered.map((student, index) => (
            <div className='items-center flex min-w-1/2 h-full text-center' key={index}>
              <NavLink to={`details/${student.StudentID}`}>
                <div className='flex flex-col items-center text-center w-full bg-slate-200'>
                  <p className='text-2xl text-center'>{student.FirstName}</p>
                  <p className='text-center'>Last Name: {student.LastName}</p>
                  <p>Class: {student.Class}</p>
                  <p>Student ID: {student.StudentID}</p>
                </div>
              </NavLink>
            </div>
          ))
        ) : (
          <p>No students found for this class.</p>
        )}
         
      </div>
      <button 
          className='text-xl bg-green-500 mr-7 border-4 w-62 text-center' 
          onClick={handleGenerateExcel}
        >
          Generate Excel
        </button>
    </>
  );
}