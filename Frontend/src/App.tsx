import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing';
import Login from './pages/Login';  
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard';
import DashboardOverview from './pages/DashboardOverview';
import Practice from './pages/Practice';
import Performance from './pages/Performance';
import Profile from './pages/Profile';
import MyCourses from './pages/MyCourses';
import ProtectedRoute from './components/protectedRoute'; 
import ForgotPassword from './pages/ForgotPassword';
import EmailVerification from './pages/EmailVerification';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />}/>
        <Route path='/forgot-password' element={<ForgotPassword/>} />
        <Route path='/email-verification' element={<EmailVerification/>} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>}>
          <Route index element={<DashboardOverview />} />
          <Route path="courses" element={<MyCourses />} />
          <Route path="quiz" element={<Practice />} />
          <Route path="performance" element={<Performance />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  )
}

export default App