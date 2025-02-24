import React, { useState, useContext } from 'react'
import { AppContext } from '../contexts/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MeetingLinkDisplay = ({ selectedDay, setShowMeetingLink, specificDayMeetingLink }) => {
  const { BACKEND_URL, token, getDateForDashBoard } = useContext(AppContext)
  const [isEditing, setIsEditing] = useState(false)
  const [meetingLink, setMeetingLink] = useState(specificDayMeetingLink)

  const handleLinkEdit = async (newLink) => {
    try {
      const { data } = await axios.post(
        BACKEND_URL + '/api/user/update-timesheet-meeting-link',{ 
          meetingLink: newLink,
          selectedDay : selectedDay
        },{headers:{token}})
      if (data.success) {
        setMeetingLink(newLink)
        await getDateForDashBoard()
        toast.success('Meeting link updated successfully')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setIsEditing(false)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800/25 backdrop-blur-sm">
      <div className="relative bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/20">
        <button 
          onClick={() => setShowMeetingLink(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">{`Zoom Meeting Link - ${selectedDay}`}</h2>
        
        {isEditing ? (
          <div className="mt-2">
            <input
              type="text"
              defaultValue={meetingLink}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
              autoFocus
              onBlur={(e) => handleLinkEdit(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleLinkEdit(e.target.value)
                }
              }}
            />
            <p className="text-sm text-gray-500 mt-1">Press Enter or click outside to save</p>
          </div>
        ) : (
          <div
            className="p-3 bg-white/40 backdrop-blur-sm rounded cursor-pointer hover:bg-white/60 transition-colors"
            onDoubleClick={() => setIsEditing(true)}
          >
            <p className="text-gray-700 break-all">{meetingLink}</p>
            <p className="text-sm text-gray-500 mt-1">Double click to edit</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MeetingLinkDisplay
