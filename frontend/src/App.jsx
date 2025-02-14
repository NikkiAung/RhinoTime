import { Routes, Route, Navigate } from 'react-router-dom'
import SignInPage from './pages/SignIn'
import TutorSessionFrom from './pages/TutorSessionFrom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignInPage />} />
      <Route path="/session-form" element={<TutorSessionFrom />} />
    </Routes>
  )
}

export default App
