import { useState, useContext } from "react"
import axios from "axios"
import { AppContext } from '../contexts/AppContext'
import { toast } from 'react-toastify'

const AddOverTime = ({selectedDay,setAddOverTime,getOvertimeData}) => {
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [date, setDate] = useState("")
  const [overTimeMeetingLink,setOverTimeMeetingLink] = useState("")
  const {BACKEND_URL,token,setToken,getDateForDashBoard,timeSheet} = useContext(AppContext)

  const AddOverTime = async (e) => {
    e.preventDefault()
    const newOverTime = {
      [selectedDay] : {
        date: date,
        startTime: startTime,
        endTime: endTime,
        meetingLink: overTimeMeetingLink
      }
    }
    try {
      const {data} = await axios.post(BACKEND_URL + '/api/user/upload-overtime',{newOverTime},{headers:{token}})
      if(data.success){
        setAddOverTime(false)
        getDateForDashBoard()
        getOvertimeData()
        toast.success(data.message)
      } else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 w-full max-w-md shadow-xl border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Add Extra Time - {selectedDay}</h3>
              <button 
                onClick={() => setAddOverTime(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            
            <form className="space-y-4" onSubmit={AddOverTime}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input 
                  type="time" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input 
                  type="time" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Link</label>
                <input 
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="https://zoom.us/j/example"
                  value={overTimeMeetingLink}
                  onChange={(e) => setOverTimeMeetingLink(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAddOverTime(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Extra Time
                </button>
              </div>
            </form>
          </div>
        </div>
  )
}

export default AddOverTime
