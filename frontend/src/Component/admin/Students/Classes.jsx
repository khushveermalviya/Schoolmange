import React from 'react'
import { NavLink, useParams } from 'react-router-dom'
import Data from '../Data.js'  // Make sure to import the data

export default function Classes() {
  const { userid } = useParams(); // Extract userid from the URL

  // Filter the data based on the selected class (userid)
  const filteredData = Data.filter(student => student.class === parseInt(userid));

  return (
    <div>
        <div className=' bg-slate-400 text-2xl'>
            <ul className='flex flex-col justify-around flex-nowrap'>
                <li>
                    <NavLink to="add">Add</NavLink>
                    </li>
                <li>delete</li>
                <li>Annunosment</li>
                <li>search</li>
            </ul>
        </div>
      <h2>Class Details</h2>
      {filteredData.map((student, index) => (
        <div key={index}>
          <p>Class: {student.class}</p>
          <p>Father's Name: {student.fatherName}</p>
          <p>Roll Number: {student.rollNumber}</p>
          <p>Date of Birth: {student.dob}</p>
          <p>Country: {student.country}</p>
        </div>
      ))}
    </div>
  )
}
