import React, { useEffect, useState } from 'react';
import Nav from '../Component/student/Nav.jsx';
import Footer from '../Component/student/Footer';
import { Outlet } from 'react-router-dom';
import useUserStore from '../app/useUserStore.js'; // Import the Zustand store

export default function Layout() {
  const user = useUserStore((state) => state.user); // Get the user state from the Zustand store
  const [userData, setUserData] = useState(user || {});

  useEffect(() => {
    if (user) {
      setUserData(user);
      localStorage.setItem("userData", JSON.stringify(user)); // Update local storage with the new user data
      console.log("User data updated from context:", user);
    } else {
      const storedData = JSON.parse(localStorage.getItem("userData"));
      if (storedData) {
        setUserData(storedData);
        console.log("User data updated from local storage:", storedData);
      }
    }
  }, [user]); // Add user as a dependency to run the effect when user changes

  useEffect(() => {
    console.log("User data state changed:", userData);
  }, [userData]); // Log userData changes

  return (
    <>
      <Nav userData={userData} /> {/* Pass userData as props to Nav */}
      <h1 className="text-2xl text-red">Welcome, {userData.FirstName} {userData.LastName}</h1>
      <p>Student ID: {userData.StudentID}</p>
      {/* Display other details */}
      <Outlet />
      <div className='h-screen place-content-end relative'>
        <Footer />
      </div>
    </>
  );
}