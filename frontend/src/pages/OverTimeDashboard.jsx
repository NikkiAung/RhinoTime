import React from 'react'

const OverTimeDashboard = ({selectedDay,overtimeData,calculateDuration,formatTime,setShowOvertimeView}) => {
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-50">
              <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 w-full max-w-2xl shadow-xl border border-white/20">
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
  
                  <div className="space-y-4">
                      {overtimeData[selectedDay]?.map((entry, index) => (
                          <div key={index} className="bg-white/50 backdrop-blur-sm p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start">
                                  <p className="text-gray-500">{entry.date}</p>
                                  <div className="bg-amber-100 text-amber-800 text-sm font-medium px-2.5 py-0.5 rounded">
                                      {calculateDuration(entry.startTime, entry.endTime)}
                                  </div>
                              </div>
                              <div className="mt-3 space-y-2">
                                  <div className="flex items-center text-gray-600">
                                      <span className="font-medium">Time:</span>
                                      <span className="ml-2">
                                          {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                                      </span>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
  )
}

export default OverTimeDashboard
