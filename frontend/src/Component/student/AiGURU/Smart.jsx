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
  const [Prompt, SetPrompt] = useState('');
  const [req, SetReq] = useState([]);
  const [serviceAvailable, setServiceAvailable] = useState(false); // Service status state
  const StudentID = useUserStore((state) => state.user.StudentID);
  const chatContainerRef = useRef(null);
  const { loading, error, data, refetch } = useQuery(GET_STUDENT_CHATS, {
    variables: { StudentID },
  });
  const [addChat] = useMutation(ADD_CHAT);

  const onhandle = (e) => {
    SetPrompt(e.target.value);
  };

  useEffect(() => {
    if (data) {
      SetReq(data.getStudentChats);
    }
  }, [data]);

  useEffect(() => {
    scrollToBottom();
  }, [req]);

  const handleClick = async () => {
    const user = 'user'; // Define the user appropriately
    const currentPrompt = Prompt; // Store the current prompt value
    const textResponse = await fetch(currentPrompt);
    // Add new chat to the database
    await addChat({
      variables: {
        StudentID,
        user_type: user,
        prompt: currentPrompt,
        response: textResponse,
      },
    });
    // Clear the prompt input
    SetPrompt('');

    SetReq((prevRequest) => [
      ...prevRequest,
      {
        user_type: `${StudentID}`,
        prompt: currentPrompt,
        response: textResponse,
        created_at: new Date().toISOString(),
      },
    ]);
    // Refetch the chat history
    refetch();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex flex-col h-screen w-screen bg-gradient-to-b from-gray-700 to-gray-900">
      <div className="flex-grow bg-gray-800 w-full p-6 rounded-lg shadow-xl text-white overflow-y-auto" ref={chatContainerRef}>
        {/* Previous Conversations */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Previous Conversations</h2>
          {req.map((item, index) => (
            <div className="border-b border-gray-600 pb-3 mb-3" key={index}>
              <p className="text-sm">
                <span className="font-bold">{item.user_type}:</span> {item.prompt}
              </p>
              <p className="text-sm">
                <span className="font-bold">AI:</span> {item.response}
              </p>
              <p className="text-xs text-gray-400">
                <em>{isValid(new Date(item.created_at)) ? format(new Date(item.created_at), 'PPpp') : 'Invalid Date'}</em>
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Input for new chat */}
      <div className="w-full fixed bottom-0 left-0 p-4 bg-gray-800">
        {!serviceAvailable ? (
          <p className="text-center text-red-500">Service is currently out of service.</p>
        ) : (
          <>
            <label htmlFor="aiPromt" className="sr-only">
              ai prompt
            </label>
            <div className="relative w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                aria-hidden="true"
                className="absolute left-3 top-1/2 size-4 -translate-y-1/2 fill-black dark:fill-white"
              >
                <path
                  fillRule="evenodd"
                  d="M5 4a.75.75 0 0 1 .738.616l.252 1.388A1.25 1.25 0 0 0 6.996 7.01l1.388.252a.75.75 0 0 1 0 1.476l-1.388.252A1.25 1.25 0 0 0 5.99 9.996l-.252 1.388a.75.75 0 0 1-1.476 0L4.01 9.996A1.25 1.25 0 0 0 3.004 8.99l-1.388-.252a.75.75 0 0 1 0-1.476l1.388-.252A1.25 1.25 0 0 0 4.01 6.004l.252-1.388A.75.75 0 0 1 5 4ZM12 1a.75.75 0 0 1 .721.544l.195.682c.118.415.443.74.858.858l.682.195a.75.75 0 0 1 0 1.442l-.682.195a1.25 1.25 0 0 0-.858.858l-.195.682a.75.75 0 0 1-1.442 0l-.195-.682a1.25 1.25 0 0 0-.858-.858l-.682-.195a.75.75 0 0 1 0-1.442l.682-.195a1.25 1.25 0 0 0 .858-.858l.195-.682A.75.75 0 0 1 12 1ZM10 11a.75.75 0 0 1 .728.568.968.968 0 0 0 .704.704.75.75 0 0 1 0 1.456.968.968 0 0 0-.704.704.75.75 0 0 1-1.456 0 .968.968 0 0 0-.704-.704.75.75 0 0 1 0-1.456.968.968 0 0 0 .704-.704A.75.75 0 0 1 10 11Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                id="aiPromt"
                onChange={onhandle}
                onKeyPress={handleKeyPress} // Add key press handler
                value={Prompt} // Bind the input value to the Prompt state
                type="text"
                className="w-full border-outline bg-neutral-50 border border-neutral-300 rounded-md px-2 py-2 pl-10 pr-24 text-sm text-neutral-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-75 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-300 dark:focus-visible:outline-white"
                name="prompt"
                placeholder="Ask AI ..."
                disabled={!serviceAvailable} // Disable input when service is unavailable
              />
              <button
                type="button"
                onClick={handleClick}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer bg-black rounded-md px-2 py-1 text-xs tracking-wide text-neutral-100 transition hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black active:opacity-100 active:outline-offset-0 dark:bg-white dark:text-black dark:focus-visible:outline-white"
                disabled={!serviceAvailable} // Disable button when service is unavailable
              >
                Generate
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}