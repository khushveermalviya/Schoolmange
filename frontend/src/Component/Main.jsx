import React, { useState } from 'react';
import { Navigate, NavLink } from 'react-router-dom';
import MainNav from './MainNav';
import axios from 'axios';

export default function Main() {
  const [info, setInfo] = useState({ std_name: '', mobile_number: '' });
  const [navigate, setNavigate] = useState(false);
  const [check, setCheck] = useState(false);

  function onHandle(e) {
    const { name, value } = e.target;
    setInfo(prevInfo => ({ ...prevInfo, [name]: value }));
  }

  async function handleClick() {
    try {
      const response = await axios.post('https://backend-mauve-ten.vercel.app/studentLogin', info);
      setCheck(response.data);
      if (response.data) {
        setNavigate(true);
      }
    } catch (error) {
      console.error("An error occurred while logging in", error);
    }
  }

  if (navigate) {
    return <Navigate to='/student' />;
  }

  return (
    <div className='min-h-screen'>
      <MainNav />
      <div className="flex justify-between items-center h-screen">
        <div className='bg-white w-full min-w-50 h-full justify-center flex items-center flex-col'>
          <NavLink to="/Student" className="text-blue-900 font-bold text-2xl">Student</NavLink>

          <label htmlFor="std_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Student Name</label>
          <input
            type="text"
            id="std_name"
            name="std_name"
            className="max-w-60 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Student Name"
            value={info.std_name}
            onChange={onHandle}
            required
          />

          <label htmlFor="mobile_number" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone number</label>
          <input
            type="tel"
            id="mobile_number"
            name="mobile_number"
            className="max-w-60 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="123-45-678"
            pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
            value={info.mobile_number}
            onChange={onHandle}
            required
          />

          <button className='bg-blue-500 w-20 mt-7 text-xl rounded-xl border-2 border-black hover:scale-75' onClick={handleClick}>Submit</button>
        </div>
        <div className='bg-slate-50 hidden'>df</div>
        <div className='hidden'></div>
      </div>
    </div>
  );
}