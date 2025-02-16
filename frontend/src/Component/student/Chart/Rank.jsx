import React, { useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Trophy } from 'lucide-react';

const GET_TOP_PERFORMERS = gql`
  query GetClassRankings($class: Int!) {
    getClassRankings(Class: $class) {
      Class
      StudentID
      StudentName
      TotalSubjects
      AverageMarks
      Rank
    }
  }
`;

const TopPerformersCard = ({ student }) => {

  
  const { loading, error, data } = useQuery(GET_TOP_PERFORMERS, {
    variables: { 
      class: student.Class,
    },
    pollInterval: 300000,
  });

  // Log query state changes


  // Log when data changes


  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Top Performers in Class {student.Class}
        </h3>
        {loading ? (
          <div className="flex justify-center p-4">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : error ? (
          <div className="alert alert-error">
            <span>Error loading rankings: {error.message}</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Student Name</th>
                  <th>Score</th>
                  <th>Subjects</th>
                </tr>
              </thead>
              <tbody>
                {data?.getClassRankings?.map((performer) => ( // Changed from topPerformers to getClassRankings
                  <tr 
                    key={performer.StudentID} 
                    className={performer.Rank <= 3 ? 'font-semibold' : ''}
                  >
                    <td>
                      {performer.Rank <= 3 ? (
                        <div className="flex items-center gap-2">
                          <span className={`badge ${
                            performer.Rank === 1 ? 'badge-warning' :
                            performer.Rank === 2 ? 'badge-secondary' :
                            'badge-accent'
                          }`}>
                            {performer.Rank}
                          </span>
                          {performer.Rank === 1 && <Trophy className="w-4 h-4 text-warning" />}
                        </div>
                      ) : (
                        performer.Rank
                      )}
                    </td>
                    <td>
                      {performer.StudentName}
                      {performer.StudentID === student.StudentID && 
                        <span className="ml-2 badge badge-sm">You</span>
                      }
                    </td>
                    <td>{performer.AverageMarks.toFixed(1)}%</td>
                    <td>{performer.TotalSubjects}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopPerformersCard;