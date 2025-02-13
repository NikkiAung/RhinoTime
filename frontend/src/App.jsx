import { Routes, Route, Navigate } from 'react-router-dom'
import SignInPage from './pages/SignIn'

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignInPage />} />
    </Routes>
  )
}

export default App
