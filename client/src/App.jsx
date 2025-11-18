import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import NewUser from './pages/Newuser.jsx'
import ForgotPass from './pages/Forgotpass.jsx'
import CollegeAdmin from './pages/Collegeadmin.jsx'
import SuperAdmin from './pages/Superadmin.jsx'
import StudentDashboard from './pages/StudentDashboard.jsx'
import CollegeDashboard from './pages/CollegeDashboard.jsx'
import SuperDashboard from './pages/SuperDashboard.jsx'


function PrivateRoute({ children, role }) {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('role')
  if (!token) return <Navigate to="/" />
  if (role && userRole !== role) return <Navigate to="/" />
  return children
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<NewUser />} />
        <Route path="/forgot" element={<ForgotPass />} />
        <Route path="/college-admin-login" element={<CollegeAdmin />} />
        <Route path="/super-admin-login" element={<SuperAdmin />} />

        <Route
          path="/student-dashboard"
          element={
            <PrivateRoute role="student">
              <StudentDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/college-dashboard"
          element={
            <PrivateRoute role="college-admin">
              <CollegeDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/super-dashboard"
          element={
            <PrivateRoute role="super-admin">
              <SuperDashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}