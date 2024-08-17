import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import loading from "react-top-loading-bar"
export default function Main() {
  const[info , setInfo]=useState('')
  function onHandle(e){
setInfo(e.target.value)
  }
  console.log(info);
  
  return (
    <div className='bg-gray-700 min-h-screen  '>
<div className="flex justify-between  items-center h-screen ">
  <div className='bg-white w-1/2 h-full justify-center flex items-center flex-col'>
<NavLink to="/Student" className="text-blue-900 font-bold text-2xl ">Student</NavLink>
<NavLink to="/admin" className="text-blue-900 font-bold text-2xl ">Admin</NavLink>

<label for="rollno"></label>
<input 
type='number'
className='w-30 border-2 border-black rounded-md outline-2 bg-slate-400 appearance-none'
name='rollno'
placeholder='Roll no.'
onChange={onHandle}
/>

</div>
<div className='bg-slate-50'>df</div>
    </div>
   
  
    </div>
  )
}
