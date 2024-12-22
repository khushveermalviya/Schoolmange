import React, { useState, useEffect } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import MainNav from "./MainNav.jsx";
import useUserStore from '../app/useUserStore.js'; // Import the Zustand store

const LOGIN_QUERY = gql`
  query StudentLogin($StudentID: String!, $Password: String!) {
    studentLogin(StudentID: $StudentID, Password: $Password) {
      StudentID
      FirstName
      LastName
      token
      WeeklyPerformance

    }
  }
`;


export default function Main() {
  const [data, setData] = useState({
    username: "",
    password: ""
  });

  const [loginFailed, setLoginFailed] = useState(false);
  const [login, { data: queryData }] = useLazyQuery(LOGIN_QUERY);
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (queryData?.studentLogin?.token) {
      const { token, ...userDetails } = queryData.studentLogin;

      // Store token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("userData", JSON.stringify(userDetails));

      // Update the Zustand store with the new user data
      setUser(userDetails);

      // Fetch performance and attendance data after login
    

      // Navigate to dashboard
      navigate("/student");
    } else if (queryData && !queryData.studentLogin?.token) {
      setLoginFailed(true);
    }
  }, [queryData, navigate, setUser]);

 
  const onHandle = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

  const handleClick = (e) => {
    e.preventDefault();
    setLoginFailed(false);
    login({ variables: { StudentID: data.username, Password: data.password } });
  };

  return (
    <div className="min-h-screen bg-school bg-cover bg-center">
      <MainNav />
      <div className="flex justify-between items-center h-screen">
        <div className="w-full flex items-center flex-col p-4">
          <input
            type="text"
            name="username"
            placeholder="Student Name"
            value={data.username}
            onChange={onHandle}
            className="p-2 border"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={data.password}
            onChange={onHandle}
            className="p-2 border mt-4"
          />
          <button onClick={handleClick} className="bg-blue-500 text-white px-4 py-2 mt-4">Login</button>
          {loginFailed && <p className="text-red-500 mt-2">Login failed. Please try again.</p>}
        </div>
      </div>
    </div>
  );
}



  

