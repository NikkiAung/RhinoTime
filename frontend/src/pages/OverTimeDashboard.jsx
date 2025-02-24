import { toast } from "react-toastify"
import { useContext, useState } from "react"
import { AppContext } from "../contexts/AppContext"
import axios from "axios"

const OverTimeDashboard = ({selectedDay,overtimeData,calculateDuration,formatTime,setShowOvertimeView,getOvertimeData}) => {
    const {BACKEND_URL,token} = useContext(AppContext)
    const [editingLink, setEditingLink] = useState(false)

    // Add this new handler
    const handleOverTimeMeetingLinkEdit = async (entry, newLink) => {
        try {
            const {data} = await axios.post(BACKEND_URL+'/api/user/update-overtime-meeting-link', {
                selectedDay,
                date: entry.date,
                startTime: entry.startTime,
                endTime: entry.endTime,
                meetingLink: newLink
            }, {headers:{token}})
            
            if(data.success){
                toast.success('Meeting link updated successfully')
                getOvertimeData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
        setEditingLink(null)
    }

    // In your JSX, update the meeting link section
    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-50">
              <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 w-full max-w-2xl shadow-xl border border-white/20 max-h-[80vh] flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">Overtime Hours - {selectedDay}</h2>
                      <button 
                          onClick={() => setShowOvertimeView(false)}
                          className="text-gray-500 hover:text-gray-700"
                      >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                      </button>
                  </div>
  
                  <div className="space-y-4 overflow-y-auto pr-2">
                      {overtimeData[selectedDay]?.map((entry, index) => (
                          <div key={index} className="bg-white/50 backdrop-blur-sm p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start">
                                  <p className="text-gray-500">{entry.date}</p>
                                  <div className="bg-amber-100 text-amber-800 text-sm font-medium px-2.5 py-0.5 rounded">
                                      {calculateDuration(entry.startTime, entry.endTime)}
                                  </div>
                              </div>
                              <div className="mt-3 space-y-2 flex justify-between items-center">
                                  <div className="flex items-center text-gray-600">
                                      <span className="font-medium">Time:</span>
                                      <span className="ml-2">
                                          {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                                      </span>
                                  </div>
                                  <button 
                                        onClick={() => handleOverTimeDelete(entry)}
                                        className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium shadow-md transition-all 
                                        hover:bg-red-600 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-red-300"
                                    >
                                        🗑️ Delete
                                  </button>
                              </div>
                              <div className="mt-2 flex items-center">
                                  <span className="font-medium">Meeting Link:</span>
                                  {editingLink ? (
                                      <input
                                          type="text"
                                          defaultValue={entry.meetingLink}
                                          className="ml-2 flex-1 p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          autoFocus
                                          onBlur={(e) => handleOverTimeMeetingLinkEdit(entry, e.target.value)}
                                          onKeyDown={(e) => {
                                              if (e.key === 'Enter') {
                                                handleOverTimeMeetingLinkEdit(entry, e.target.value)
                                              }
                                          }}
                                      />
                                  ) : (
                                      <span 
                                          className="ml-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded flex-1"
                                          onDoubleClick={() => setEditingLink('true')}
                                      >
                                          {entry.meetingLink || 'No link set'}
                                      </span>
                                  )}
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
  )
}

export default OverTimeDashboard
