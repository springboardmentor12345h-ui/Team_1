import { useState } from "react"
import { useNavigate } from "react-router-dom"
import '../App.css'

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if(email && password){
      localStorage.setItem("token", "dummy_token")
      localStorage.setItem("role", "student") 
      navigate("/student-dashboard") 
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="title">Login to CampusGrid</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Email"
            className="input-field"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-btn">Sign In</button>
        </form>

        <div className="links">
          {/*
          <button className="link-item" onClick={() => navigate("/forgot")}>
            Forgot Password?
          </button>
          */}
          <button className="link-item" onClick={() => navigate("/signup")}>
            New User ? Sign Up
          </button>
          <button className="link-item" onClick={() => navigate("/college-admin-login")}>
            Login as College Admin
          </button>
          <button className="link-item" onClick={() => navigate("/super-admin-login")}>
            Super Admin Login
          </button>
        </div>
      </div>
    </div>
  )
}