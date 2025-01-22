// File: /src/components/GroupChat.js
import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { gql } from '@apollo/client';
import { Send, Image, Paperclip, Users, Menu, X } from 'lucide-react';
import useUserStore from '../../app/useUserStore';

// GraphQL Operations
const GET_CLASS_MESSAGES = gql`
  query GetClassMessages($limit: Int!, $offset: Int) {
    classMessages(limit: $limit, offset: $offset) {
      MessageID
      MessageContent
      MessageType
      AttachmentURL
      CreatedAt
      Student {
        StudentID
        FirstName
        LastName
        Class
      }
    }
  }
`;

const GET_CLASSMATES = gql`
  query GetClassmates {
    classmates {
      StudentID
      FirstName
      LastName
      Class
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessage($input: MessageInput!) {
    sendMessage(input: $input) {
      MessageID
      MessageContent
      MessageType
      AttachmentURL
      CreatedAt
      Student {
        StudentID
        FirstName
        LastName
        Class
      }
    }
  }
`;

const MESSAGE_SUBSCRIPTION = gql`
  subscription OnMessageSent($classNumber: Int!) {
    messageSent(classNumber: $classNumber) {
      MessageID
      MessageContent
      MessageType
      AttachmentURL
      CreatedAt
      Student {
        StudentID
        FirstName
        LastName
        Class
      }
    }
  }
`;

const GroupChat = () => {
  const student = useUserStore((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  // Queries and Mutations
  const { loading: messagesLoading, data: messagesData } = useQuery(GET_CLASS_MESSAGES, {
    variables: { limit: 50, offset: 0 },
    fetchPolicy: 'network-only'
  });

  const { data: classmatesData } = useQuery(GET_CLASSMATES);
  const [sendMessage] = useMutation(SEND_MESSAGE);

  // Subscription
  const { data: subscriptionData } = useSubscription(MESSAGE_SUBSCRIPTION, {
    variables: { classNumber: student.Class }
  });

  // Scroll to bottom effect
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update messages when new data arrives
  useEffect(() => {
    if (messagesData?.classMessages) {
      setMessages(messagesData.classMessages);
    }
  }, [messagesData]);

  // Handle new message from subscription
  useEffect(() => {
    if (subscriptionData?.messageSent) {
      setMessages(prev => [...prev, subscriptionData.messageSent]);
    }
  }, [subscriptionData]);

  // Message sending handler
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' && !isUploading) return;

    try {
      await sendMessage({
        variables: {
          input: {
            MessageContent: newMessage,
            MessageType: 'text'
          }
        }
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  // File upload handler
  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Implement your file upload logic here
      const uploadedUrl = await uploadFile(file);
      
      await sendMessage({
        variables: {
          input: {
            MessageContent: file.name,
            MessageType: file.type.startsWith('image/') ? 'image' : 'file',
            AttachmentURL: uploadedUrl
          }
        }
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (messagesLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div 
        className={`fixed lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64 bg-white shadow-lg h-full z-20`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Class {student.Class}</h2>
          <button 
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {classmatesData?.classmates.map((classmate) => (
              <div key={classmate.StudentID} className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {classmate.FirstName[0]}
                </div>
                <span>{`${classmate.FirstName} ${classmate.LastName}`}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white p-4 shadow flex items-center">
          <button 
            className="lg:hidden mr-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6 text-blue-500" />
            <h1 className="text-xl font-semibold">Class {student.Class} Discussion</h1>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.MessageID}
              className={`flex ${message.Student.StudentID === student.StudentID ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] ${
                message.Student.StudentID === student.StudentID 
                  ? 'bg-blue-500 text-white rounded-l-lg rounded-tr-lg' 
                  : 'bg-white rounded-r-lg rounded-tl-lg'
              } p-3 shadow`}>
                <div className="font-medium text-sm">
                  {`${message.Student.FirstName} ${message.Student.LastName}`}
                </div>
                <div className="mt-1">
                  {message.MessageType === 'image' ? (
                    <img 
                      src={message.AttachmentURL} 
                      alt="attachment" 
                      className="max-w-full rounded"
                      loading="lazy"
                    />
                  ) : message.MessageType === 'file' ? (
                    <a 
                      href={message.AttachmentURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-200 underline"
                    >
                      {message.MessageContent}
                    </a>
                  ) : (
                    message.MessageContent
                  )}
                </div>
                <div className="text-xs mt-1 opacity-75">
                  {formatTimestamp(message.CreatedAt)}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="bg-white p-4 shadow-lg">
          <div className="flex items-center space-x-4">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <label 
              htmlFor="file-upload" 
              className="cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Image className="h-6 w-6" />
            </label>
            <label 
              htmlFor="file-upload" 
              className="cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Paperclip className="h-6 w-6" />
            </label>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isUploading}
            />
            <button 
              type="submit"
              className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 transition-colors"
              disabled={isUploading || (!newMessage.trim() && !isUploading)}
            >
              <Send className="h-6 w-6" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupChat;