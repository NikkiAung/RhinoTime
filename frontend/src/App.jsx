import { Routes, Route, Navigate } from 'react-router-dom'
import SignInPage from './pages/SignIn'
import TutorSessionFrom from './pages/TutorSessionFrom'
import Dashboard from './pages/Dashboard'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ToastContainer/>
      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/session-form" element={<TutorSessionFrom />} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </>
  )
}

export default App
