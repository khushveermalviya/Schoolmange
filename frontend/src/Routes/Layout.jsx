import React, { useEffect, useState } from 'react';
import Nav from '../Component/student/Nav.jsx';
import Footer from '../Component/student/Footer';
import { Outlet } from 'react-router-dom';
import useUserStore from '../app/useUserStore.jsx'; // Import the Zustand store

export default function Layout() {
  const user = useUserStore((state) => state.user); // Get the user state from the Zustand store
  const [userData, setUserData] = useState(user || {});

  useEffect(() => {
    if (user) {
      setUserData(user);
      localStorage.setItem("userData", JSON.stringify(user)); // Update local storage with the new user data

    } else {
      const storedData = JSON.parse(localStorage.getItem("userData"));
      if (storedData) {
        setUserData(storedData);
   
      }
    }
  }, [user]); // Add user as a dependency to run the effect when user changes

  useEffect(() => {
  
  }, [userData]); // Log userData changes

  return (
    <>
      <Nav userData={userData} /> {/* Pass userData as props to Nav */}
    
      <Outlet />
   
    </>
  );
}