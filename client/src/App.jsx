import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Download from './pages/Download'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/f/:token" element={<Download />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App