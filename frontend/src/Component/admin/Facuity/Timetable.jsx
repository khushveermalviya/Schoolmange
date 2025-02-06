import React from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

// Define the GraphQL query
const TIME_TABLE = gql`
  query Timetablefaculty($id: String!) {
    Timetablefaculty(id: $id) {
      id
      class_id
      subject_id
      teacher_id
      period
      created_at
      updated_at
    }
  }
`;

export default function Timetable() {
  const timetableId = '9'; // Replace with the actual ID or dynamic value

  // Use the useQuery hook to fetch data on component mount
  const { loading, error, data } = useQuery(TIME_TABLE, {
    variables: { id: timetableId },
  });

  // Render the component
  return (
    <div>
      <h1>Timetable for Faculty</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && data.Timetablefaculty && (
        <div>
          <h2>Timetable Details</h2>
          {data.Timetablefaculty.map((item) => (
            <div key={item.id} className="timetable-item">
              <p>ID: {item.id}</p>
              <p>Class ID: {item.class_id}</p>
              <p>Subject ID: {item.subject_id}</p>
              <p>Teacher ID: {item.teacher_id}</p>
              <p>Period: {item.period}</p>
              <p>Created At: {item.created_at}</p>
              <p>Updated At: {item.updated_at}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}