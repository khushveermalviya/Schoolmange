import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
export default function Attendence() {
    const [value, setValue] = useState(new Date());

    return (
        <div>
            <div className='flex w-full h-screen justify-center items-center'>
            <Calendar onChange={setValue} value={value} />
            </div>
        </div>
    );
}