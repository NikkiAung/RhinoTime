import { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';

export const AppContext = createContext();

const AppContextProvider = (props) => {

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):false)

  const [timeSheet, setTimeSheet] = useState(null);

  const getDateForDashBoard = async () => {
    try {
        const {data} = await axios.get(BACKEND_URL + '/api/user/get-timesheet',{headers:{token}})
        if(data.success) {
            const hasTimeSheet = data.timeSheet && Object.keys(data.timeSheet).length > 0;
            setTimeSheet(hasTimeSheet ? data.timeSheet : null)
        } else{
            setTimeSheet(null)
            toast.error(data.message)
        }
    } catch (error) {
        setTimeSheet(null)
        toast.error(error.message)
    }
}

    const value = {
        BACKEND_URL,
        token,
        setToken,
        getDateForDashBoard,
        timeSheet,
        setTimeSheet
    }
  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContextProvider