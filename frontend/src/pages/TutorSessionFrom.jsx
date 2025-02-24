import React, { useState,useContext, useEffect } from 'react'
import axios from 'axios';
import { AppContext } from '../contexts/AppContext';
import { useNavigate } from "react-router";
import { toast } from 'react-toastify';
import SaveScheduleButton from '../components/SaveScheduleButton';

const TutorSessionFrom = () => {
  const {BACKEND_URL,token,setToken,timeSheet} = useContext(AppContext)
  const navigate = useNavigate();
  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [timeSheetState, setTimeSheet] = useState({
    Monday: { startTime: '', endTime: '' },
    Tuesday: { startTime: '', endTime: '' },
    Wednesday: { startTime: '', endTime: '' },
    Thursday: { startTime: '', endTime: '' },
    Friday: { startTime: '', endTime: '' },
    Saturday: { startTime: '', endTime: '' },
    Sunday: { startTime: '', endTime: '' }
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (timeSheet && timeSheet !== null) {
      navigate('/dashboard');
    }
  }, [timeSheet]);

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
    setIsLoading(true);
    console.log(timeSheetState)
    try {
      console.log(token)
      const {data} = await axios.post(BACKEND_URL + '/api/user/upload-timesheet',{timeSheet : timeSheetState},{headers:{token}});
      console.log(data)
      if(data.success) {
        toast.success("Schedule saved! Redirecting...");
        setTimeout(() => {
          setIsLoading(false);
          navigate("/dashboard");
        }, 2000);
      } else{
        toast.error(data.message)
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(error.message)
      setIsLoading(false);
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
              value={timeSheetState[day].startTime}
              onChange={(e) => handleTimeChange(day, 'startTime', e.target.value)}
              className='p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <input
              type="time"
              value={timeSheetState[day].endTime}
              onChange={(e) => handleTimeChange(day, 'endTime', e.target.value)}
              className='p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <div className='text-sm text-gray-500'>
              {timeSheetState[day].startTime && timeSheetState[day].endTime && 
                `${timeSheetState[day].startTime} - ${timeSheetState[day].endTime}`}
            </div>
          </div>
        ))}
        <SaveScheduleButton isLoading={isLoading} />
      </form>
    </div>
  )
}

export default TutorSessionFrom

