import { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';

export const AppContext = createContext();

const AppContextProvider = (props) => {

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):false)
    const value = {
        BACKEND_URL
    }
  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContextProvider