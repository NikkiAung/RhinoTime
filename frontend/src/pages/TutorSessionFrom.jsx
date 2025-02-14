import React, { useState,useContext } from 'react'
import axios from 'axios';
import { AppContext } from '../contexts/AppContext';
import { useNavigate } from "react-router";
import { toast } from 'react-toastify';

const TutorSessionFrom = () => {
  const {BACKEND_URL,token,setToken} = useContext(AppContext)
  const navigate = useNavigate();
  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [timeSheet, setTimeSheet] = useState({
    Monday: { startTime: '', endTime: '' },
    Tuesday: { startTime: '', endTime: '' },
    Wednesday: { startTime: '', endTime: '' },
    Thursday: { startTime: '', endTime: '' },
    Friday: { startTime: '', endTime: '' },
    Saturday: { startTime: '', endTime: '' },
    Sunday: { startTime: '', endTime: '' }
  });

  const handleTimeChange = (day, field, value) => {
    setTimeSheet(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(token)
      const {data} = await axios.post(BACKEND_URL + '/api/user/upload-timesheet',{timeSheet},{headers:{token}});
      if(data.success) {
        // navigate('/dashboard')
        console.log(data.success)
      } else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred')
    }
  };

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='grid grid-cols-4 gap-4 bg-gray-100 p-3 font-semibold'>
          <div>Day</div>
          <div>Start Time</div>
          <div>End Time</div>
          <div></div>
        </div>

        {daysOrder.map((day) => (
          <div key={day} className='grid grid-cols-4 gap-4 items-center'>
            <div className='font-medium'>{day}</div>
            <input
              type="time"
              value={timeSheet[day].startTime}
              onChange={(e) => handleTimeChange(day, 'startTime', e.target.value)}
              className='p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <input
              type="time"
              value={timeSheet[day].endTime}
              onChange={(e) => handleTimeChange(day, 'endTime', e.target.value)}
              className='p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <div className='text-sm text-gray-500'>
              {timeSheet[day].startTime && timeSheet[day].endTime && 
                `${timeSheet[day].startTime} - ${timeSheet[day].endTime}`}
            </div>
          </div>
        ))}

        <button 
          type="submit"
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors'
        >
          Save Schedule
        </button>
      </form>
    </div>
  )
}

export default TutorSessionFrom

