import React from 'react'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
export default function Loading() {
    const percentage = 66;
  return (
    <div className='flex w-1/2 h-28'>
        
        <CircularProgressbar value={percentage} text={`${percentage}%`} />;
    </div>
  )
}
