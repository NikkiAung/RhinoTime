import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { AppContext } from '../contexts/AppContext'
import { scheduleZoomMeetings } from '../utils/zoomAutomation'
import OverTimeDashboard from './OverTimeDashboard'
import AddOverTime from './AddOverTime'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import LogOutButton from '../components/LogOutButton'
import DeleteButton from '../components/DeleteButton'
import MeetingLinkDisplay from './MeetingLinkDisplay'

const Dashboard = () => {
    const {BACKEND_URL,token,setToken,getDateForDashBoard,timeSheet,setTimeSheet,userName} = useContext(AppContext)
    const [addOverTime, setAddOverTime] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [showOvertimeView, setShowOvertimeView] = useState(false);
    const [editingTime, setEditingTime] = useState(null); 
    const [overtimeData,setOvertimeData] = useState({});
    const navigate = useNavigate();
    const [isAutomated, setIsAutomated] = useState(false);
    const [showMeetingLink,setShowMeetingLink] = useState(false);
    const [updateMessage, setUpdateMessage] = useState('');

    // updating main time sheet
    const handleTimeEdit = async (day, field, value) => {
      // Here you would update the time in your backend
      // Updating startTime for Monday to 15:00
      console.log(`Updating ${field} for ${day} to ${value}`);
      setEditingTime(null);
      try {
        const {data} = await axios.post(BACKEND_URL + '/api/user/update-timesheet',{
          day,
          field,
          value
        },{headers:{token}})
        if(data.success){
            toast.success('Time updated successfully')
            getDateForDashBoard()
        }else{
            toast.error('Error updating time')
        }
      } catch (error) {
        toast.error(error.message)
      }

    };

    // getOvertimeData
    const getOvertimeData = async () => {
      try {
        const {data} = await axios.get(BACKEND_URL + '/api/user/get-overtime',{headers:{token}})
        if(data.success){
          setOvertimeData(data.overtimeSheet)
        }else{
          console.log('else',data.message)
          toast.error(data.message)
        }
      } catch (error) {
        console.log('catch',error.message)
        toast.error(error.message)
      }
    }

    // delete all time
    const deleteAllTime = async () => {
        try {
            const { data } = await axios.post(
                BACKEND_URL + '/api/user/delete-all-times',
                {}, // Empty body since userId will be extracted from token in middleware
                { 
                    headers: { 
                        token: token // Send token properly in headers
                    } 
                }
            );
    
            if(data.success){
                setTimeSheet(null); // Reset 
                toast.success('All times deleted successfully')
                navigate('/session-form')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
          toast.error(error.message)
        }
    };

    useEffect(()=>{
        if (token && token !== 'null') {
          getDateForDashBoard()
          getOvertimeData()
        }
    },[token])

    useEffect(()=> {
      setIsAutomated(false)
    },[overtimeData,timeSheet])

    useEffect(()=>{
      if(window.electronAPI) {
        window.electronAPI.updateMessage((message)=>{
          setUpdateMessage(message)
          toast.info(message)
        })
        return () => {
          if (window.electronAPI) {
            window.electronAPI.updateMessage(()=>{});
          }
        }
      }
    },[])

    const handleAutomation = async () => {
        // const zoomLink = "https://ccsf-edu.zoom.us/j/92121773277"; // Replace with actual Zoom link
        // scheduleZoomMeetings(timeSheet, overtimeData, zoomLink);
        try {
          await scheduleZoomMeetings(timeSheet, overtimeData);
          setIsAutomated(true);
          toast.success('Zoom meetings scheduled successfully!');
        } catch (error) {
            toast.error(error.message);
        }
    };

    const logOut = () => {
      let countdown = 3; // Start countdown from 2 seconds
    
      const toastId = toast.success(`Logging out in ${countdown}...`, {
        autoClose: false, // Prevent auto-close
      });
    
      const interval = setInterval(() => {
        countdown -= 1;
        toast.update(toastId, {
          render: `Logging out in ${countdown}...`,
        });
    
        if (countdown === 0) {
          clearInterval(interval);
          toast.update(toastId, {
            render: 'Logged out successfully!',
            autoClose: 3000, // Close after 3 seconds
          });
    
          // Perform logout
          localStorage.removeItem('token');
          setToken(null);
          navigate('/', { replace: true });
        }
      }, 1000);
    };
    

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {updateMessage && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-blue-500 animate-spin" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8Z"
              />
            </svg>
            <span className="text-blue-700">{updateMessage}</span>
          </div>
        </div>
      )}
      {/* title & del */}
      <div className='flex justify-between items-center'>
        <h1 className="font-serif text-3xl font-bold text-gray-800 mb-6">{userName}'s Schedule</h1>
        <div className='flex gap-2 mt-[-20px]'>
          <LogOutButton onClick={logOut}/>
          <DeleteButton onClick={deleteAllTime}/>
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
                  {editingTime === `${day}-start` ? (
                        <input
                            type="time"
                            defaultValue={times.startTime}
                            className="ml-2 px-2 py-1 border rounded-md text-sm"
                            autoFocus
                            onBlur={(e) => handleTimeEdit(day, 'startTime', e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleTimeEdit(day, 'startTime', e.target.value);
                                }
                            }}
                        />
                    ) : (
                        <span 
                            className="ml-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                            onDoubleClick={() => setEditingTime(`${day}-start`)}
                        >
                            {formatTime(times.startTime)}
                        </span>
                    )}
                </div>
                {/* End Time */}
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">End:</span>
                    {editingTime === `${day}-end` ? (
                        <input
                            type="time"
                            defaultValue={times.endTime}
                            className="ml-2 px-2 py-1 border rounded-md text-sm"
                            autoFocus
                            onBlur={(e) => handleTimeEdit(day, 'endTime', e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleTimeEdit(day, 'endTime', e.target.value);
                                }
                            }}
                        />
                    ) : (
                        <span 
                            className="ml-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                            onDoubleClick={() => setEditingTime(`${day}-end`)}
                        >
                            {formatTime(times.endTime)}
                        </span>
                    )}
                </div>
              </div>
              {/* AddOverTime + ShowOverTime Div */}
              <div className='flex flex-col'>
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
                  <div>
                    <button className='hover:bg-gray-100 rounded-full transition-colors flex-wrap' onClick={()=>
                      {
                        setSelectedDay(day)
                        setShowMeetingLink(true)
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 24 24"><path fill="currentColor" d="M10.616 16.077H7.077q-1.692 0-2.884-1.192T3 12t1.193-2.885t2.884-1.193h3.539v1H7.077q-1.27 0-2.173.904Q4 10.731 4 12t.904 2.173t2.173.904h3.539zM8.5 12.5v-1h7v1zm4.885 3.577v-1h3.538q1.27 0 2.173-.904Q20 13.269 20 12t-.904-2.173t-2.173-.904h-3.538v-1h3.538q1.692 0 2.885 1.192T21 12t-1.193 2.885t-2.884 1.193z"/></svg>
                    </button>
                  </div>
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
          getOvertimeData={getOvertimeData}
        />
      }

      {/* AddOverTime */}
      {addOverTime && (
        <AddOverTime
          selectedDay={selectedDay}
          setAddOverTime={setAddOverTime}
          getOvertimeData={getOvertimeData}
        />
      )}

      {showMeetingLink &&
        <MeetingLinkDisplay
          selectedDay={selectedDay}
          setShowMeetingLink={setShowMeetingLink}
          specificDayMeetingLink={timeSheet[selectedDay]?.meetingLink || ''}
        />
      }
      
      {/* Remove or conditionally render the automation button */}
      {!addOverTime && !showMeetingLink && (
        <div className="flex justify-center mt-6">
          <button 
              onClick={handleAutomation}
              disabled={isAutomated}
              className={`group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border px-6 font-medium transition-all duration-100 ${
                isAutomated 
                  ? 'bg-gradient-to-r from-green-400 to-green-500 text-white cursor-not-allowed border-green-400 shadow-lg hover:shadow-green-200/50' 
                  : 'border-neutral-200 bg-transparent text-neutral-600 [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]'
              }`}
          >
              {isAutomated ? '✓ Automated' : 'Click To Automate?'}
          </button>
        </div>
      )}
    </div>
  )
}

const formatTime = (time) => {
  if (time === "00:00") return "00:00";
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
