import React, { useState, useEffect, useRef } from 'react';
import { fetch } from './Logic.js';
import useUserStore from "../../../app/useUserStore.jsx";
import { useQuery, gql, useMutation } from '@apollo/client';
import { format, isValid } from 'date-fns';

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

const ADD_CHAT = gql`
  mutation AddChat($StudentID: String!, $user_type: String!, $prompt: String!, $response: String!) {
    addChat(StudentID: $StudentID, user_type: $user_type, prompt: $prompt, response: $response) {
      chat_id
      user_type
      prompt
      response
      created_at
    }
  }
`;

export default function Smart() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const StudentID = useUserStore((state) => state.user.StudentID);
  const chatContainerRef = useRef(null);
  const { loading, error, data } = useQuery(GET_STUDENT_CHATS, { variables: { StudentID } });
  const [addChat] = useMutation(ADD_CHAT, {
    update(cache, { data: { addChat } }) {
      cache.modify({
        fields: {
          getStudentChats(existingChats = []) {
            return [...existingChats, addChat];
          }
        }
      });
    }
  });

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    const userPrompt = prompt;
    setPrompt('');
    setIsLoading(true);

    try {
      const aiResponse = await fetch(userPrompt);
      
      await addChat({
        variables: {
          StudentID,
          user_type: 'user',
          prompt: userPrompt,
          response: aiResponse
        },
        optimisticResponse: {
          __typename: "Mutation",
          addChat: {
            __typename: "Chat",
            chat_id: Math.random().toString(),
            user_type: 'user',
            prompt: userPrompt,
            response: aiResponse,
            created_at: new Date().toISOString()
          }
        }
      });
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [data?.getStudentChats]);

  if (loading) return <div className="flex justify-center p-4 text-white">Loading history...</div>;
  if (error) return <div className="flex justify-center p-4 text-red-500">Error loading chats: {error.message}</div>;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-700 to-gray-900">
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {data?.getStudentChats?.map((chat, index) => (
          <div 
            key={chat.chat_id || index}
            className={`flex ${chat.user_type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-3xl p-4 rounded-lg ${
              chat.user_type === 'user' 
                ? 'bg-blue-600 text-white ml-12' 
                : 'bg-gray-700 text-gray-100 mr-12'
            }`}>
              <div className="text-sm whitespace-pre-wrap">
                {chat.response || chat.prompt}
              </div>
              <div className="mt-2 text-xs opacity-70">
                {isValid(new Date(chat.created_at)) && 
                  format(new Date(chat.created_at), 'HH:mm · PP')}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-600">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask me anything..."
            className="w-full p-4 pr-16 text-white bg-gray-800 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={Math.min(4, prompt.split('\n').length)}
            disabled={true} // Disable the textarea
          />
          <button
            onClick={handleSubmit}
            disabled={true} // Disable the send button
            className={`absolute right-2 bottom-2 px-4 py-1 rounded-md bg-gray-600 cursor-not-allowed text-white transition-colors`}
          >
            Send
          </button>
        </div>
        <div className="mt-2 text-center text-gray-400">
          Currently out of service. Please check back later.
        </div>
      </div>
    </div>
  );
}