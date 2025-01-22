import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { gql } from '@apollo/client';
import { Send, Image, Paperclip, Users, Menu, X } from 'lucide-react';
import useUserStore from '../../app/useUserStore';
import { motion, AnimatePresence } from 'framer-motion'; // Import Framer Motion

// GraphQL Operations (Remain the same)
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

// Placeholder for file upload logic (Replace with your actual implementation)
const uploadFile = async (file) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('https://via.placeholder.com/150'); // Dummy URL for demo
    }, 1000);
  });
};

const GroupChat = () => {
  const student = useUserStore((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  // Query for initial messages
  const { loading: messagesLoading, data: messagesData } = useQuery(
    GET_CLASS_MESSAGES,
    {
      variables: { limit: 50, offset: 0 },
      fetchPolicy: 'network-only',
    }
  );

  const { data: classmatesData } = useQuery(GET_CLASSMATES);

  // Optimistic update for sending messages
  const [sendMessage] = useMutation(SEND_MESSAGE, {
    optimisticResponse: (variables) => ({
      sendMessage: {
        MessageID: `temp-${Date.now()}`,
        MessageContent: variables.input.MessageContent,
        MessageType: variables.input.MessageType || 'text',
        AttachmentURL: variables.input.AttachmentURL || null,
        CreatedAt: new Date().toISOString(),
        Student: {
          StudentID: student.StudentID,
          FirstName: student.FirstName,
          LastName: student.LastName,
          Class: student.Class,
          __typename: 'Student',
        },
        __typename: 'Message',
      },
    }),
    update: (cache, { data }) => {
      const newMessage = data.sendMessage;
      const existingMessages = cache.readQuery({
        query: GET_CLASS_MESSAGES,
        variables: { limit: 50, offset: 0 },
      });

      if (existingMessages) {
        cache.writeQuery({
          query: GET_CLASS_MESSAGES,
          variables: { limit: 50, offset: 0 },
          data: {
            classMessages: [...existingMessages.classMessages, newMessage],
          },
        });
      }
    },
  });

  // Subscription for real-time messages
  useSubscription(MESSAGE_SUBSCRIPTION, {
    variables: { classNumber: parseInt(student.Class) },
    onData: ({ data }) => {
      if (data.data?.messageSent) {
        setMessages((prevMessages) => {
          // Check if message already exists to prevent duplicates
          const messageExists = prevMessages.some(
            (msg) => msg.MessageID === data.data.messageSent.MessageID
          );
          if (messageExists) return prevMessages;

          return [...prevMessages, data.data.messageSent];
        });
      }
    },
  });

  // Scroll to bottom effect
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Set initial messages
  useEffect(() => {
    if (messagesData?.classMessages) {
      setMessages(messagesData.classMessages);
    }
  }, [messagesData]);

  // Message sending handler
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' && !isUploading) return;

    try {
      await sendMessage({
        variables: {
          input: {
            MessageContent: newMessage,
            MessageType: 'text',
          },
        },
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
            AttachmentURL: uploadedUrl,
          },
        },
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
      minute: '2-digit',
    });
  };

  if (messagesLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  // Animation Variants
  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: '-100%', opacity: 0 },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AnimatePresence>
        <motion.div
          className={`fixed lg:relative w-64 bg-white shadow-lg h-full z-20`}
          initial="open"
          animate={isSidebarOpen ? 'open' : 'closed'}
          variants={sidebarVariants}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold">Class {student.Class}</h2>
            {/* Close button for mobile */}
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {classmatesData?.classmates.map((classmate) => (
                <motion.div
                  key={classmate.StudentID}
                  className="flex items-center space-x-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    {classmate.FirstName[0]}
                  </div>
                  <span>{`${classmate.FirstName} ${classmate.LastName}`}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white p-4 shadow flex items-center">
          {/* Menu button for mobile */}
          <button className="mr-4" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6 text-blue-500" />
            <h1 className="text-xl font-semibold">
              Class {student.Class} Discussion
            </h1>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.MessageID}
                className={`flex ${
                  message.Student.StudentID === student.StudentID
                    ? 'justify-end'
                    : 'justify-start'
                }`}
                initial="hidden"
                animate="visible"
                variants={messageVariants}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div
                  className={`max-w-[70%] ${
                    message.Student.StudentID === student.StudentID
                      ? 'bg-blue-500 text-white rounded-l-lg rounded-tr-lg'
                      : 'bg-white rounded-r-lg rounded-tl-lg'
                  } p-3 shadow`}
                >
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
              </motion.div>
            ))}
          </AnimatePresence>
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
            <motion.button
              type="submit"
              className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 transition-colors"
              disabled={isUploading || (!newMessage.trim() && !isUploading)}
              whileTap={{ scale: 0.95 }}
            >
              <Send className="h-6 w-6" />
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupChat;