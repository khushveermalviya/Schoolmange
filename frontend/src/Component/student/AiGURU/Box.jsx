// Box.jsx
import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_STUDENT_CHATS = gql`
  query GetStudentChats($StudentID: String!) {
    getStudentChats(StudentID: $StudentID) {
      chat_id
      user_type
      prompt
      response
      created_at
    }
  }
`;

export default function Box({ StudentID }) {
  const { loading, error, data } = useQuery(GET_STUDENT_CHATS, {
    variables: { StudentID },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Chat History for Student: {StudentID}</h2>
      {data.getStudentChats.map((chat) => (
        <div key={chat.chat_id} className="chat-entry">
          <p><strong>{chat.user_type}:</strong> {chat.prompt}</p>
          <p><strong>AI:</strong> {chat.response}</p>
          <p><em>{new Date(chat.created_at).toLocaleString()}</em></p>
        </div>
      ))}
    </div>
  );
}