import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { AppContext } from '../contexts/AppContext'
import { scheduleZoomMeetings } from '../utils/zoomAutomation'
import OverTimeDashboard from './OverTimeDashboard'
import AddOverTime from './AddOverTime'

const Dashboard = () => {
    const {BACKEND_URL,token,setToken,getDateForDashBoard,timeSheet} = useContext(AppContext)
    const [addOverTime, setAddOverTime] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [showOvertimeView, setShowOvertimeView] = useState(false);

    // Sample overtime data
    const overtimeData = {
        Monday: [
            { date: '2024-01-15', startTime: '17:00', endTime: '19:00'},
            { date: '2024-01-22', startTime: '16:30', endTime: '18:30'}
        ],
        Tuesday: [
            { date: '2024-01-16', startTime: '15:00', endTime: '17:00'}
        ],
        Wednesday: [
            { date: '2024-01-17', startTime: '14:00', endTime: '16:00'}
        ]
    };

    useEffect(()=>{
        getDateForDashBoard()
    },[token])

    const handleAutomation = () => {
        const zoomLink = "https://ccsf-edu.zoom.us/j/92121773277"; // Replace with actual Zoom link
        scheduleZoomMeetings(timeSheet, zoomLink);
    };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* title & del */}
      <div className='flex justify-between items-center'>
        <h1 className="font-serif text-3xl font-bold text-gray-800 mb-6">Tutoring Schedule</h1>
        <div 
          className="bg-red-500 px-4 py-1 rounded-full text-white font-semibold text-lg shadow-md transition duration-300 ease-in-out transform hover:bg-red-600 hover:scale-105 active:scale-95 focus:ring-4 focus:ring-red-300 cursor-pointer select-none"
        >
          🗑️ Delete All Schedule?
        </div>
      </div>
      {/* cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {timeSheet && Object.entries(timeSheet).map(([day, times]) => (
          <div key={day} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-gray-700">{day}</h2>
              <div className="flex items-center gap-2">


                <div className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    {calculateDuration(times.startTime, times.endTime)}
                </div>
              </div>
            </div>
            
            <div className="space-y-2 flex justify-between">
              {/* Start Time & End Time */}
              <div>
                {/* Start Time */}
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">Start:</span>
                  <span className="ml-2">{formatTime(times.startTime)}</span>
                </div>
                {/* End Time */}
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">End:</span>
                  <span className="ml-2">{formatTime(times.endTime)}</span>
                </div>
              </div>


              {/* overTime Div */}
              <div>
                  <button 
                      onClick={() => {
                          setSelectedDay(day);
                          setAddOverTime(true);
                      }}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      title="Add extra time"
                      >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                      </svg>
                  </button>
                  {overtimeData[day]?.length > 0 && (
                      <button
                          onClick={() => {
                              setSelectedDay(day);
                              setShowOvertimeView(true);
                          }}
                          className="p-1 hover:bg-amber-100 rounded-full transition-colors"
                          title="View overtime entries"
                      >
                          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                      </button>
                  )}
              </div>
          </div>
        </div>
        ))}
      </div>

      {/* OverTimeDashboard */}
      {showOvertimeView && 
        <OverTimeDashboard 
          selectedDay={selectedDay} 
          overtimeData={overtimeData} 
          calculateDuration={calculateDuration} 
          formatTime={formatTime}
          setShowOvertimeView={setShowOvertimeView}
        />
      }

      {/* AddOverTime */}
      {addOverTime && (
        <AddOverTime
          selectedDay={selectedDay}
          setAddOverTime={setAddOverTime}
        />
      )}
      
      {/* Remove or conditionally render the automation button */}
      {!addOverTime && (
        <div className="flex justify-center mt-6">
          <button 
              onClick={handleAutomation}
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-transparent px-6 font-medium text-neutral-600 transition-all duration-100 [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]"
          >
              Click To Automate?
          </button>
        </div>
      )}
    </div>
  )
}

const formatTime = (time) => {
  const [hours, minutes] = time.split(':');
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes} ${period}`;
};

const calculateDuration = (startTime, endTime) => {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  let durationMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  
  return `${hours}h ${minutes}m`;
};

export default Dashboard
