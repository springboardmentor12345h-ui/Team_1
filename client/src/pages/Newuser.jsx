import './newuser.css'
import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function NewUser() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [college, setCollege] = useState("")
  const [role, setRole] = useState("student");
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()

    if (!name || !email || !password || !confirmPassword) {
      alert("All fields are required")
      return
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    try {
      const res = await axios.post("http://localhost:5000/auth/signup", {
        username: name,
        email,
        password,
        college,
        role
      })

      console.log("Signup Response:", res.data)

      if (res.data.success) {
        alert("Account created successfully")
        navigate("/")
      } else {
        alert(res.data.message || "Signup failed")
      }
    } catch (err) {
      console.error("Signup Error:", err.response || err)
      alert(err.response?.data?.message || "Server error")
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        {/* this portion is done by praveen kumar */}
        <h2 className="title">
          <img src="/Logo.png" alt="Logo" className="login-logo" />
          Create Account
        </h2>
        {/* this section of praveen kumar code is end here */}

        <form onSubmit={handleSignup} className="login-form">
          <input
            type="text"
            placeholder="Full Name"
            className="input-field"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="input-field"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="text"
            placeholder="College/University"
            className="input-field"
            onChange={(e) => setCollege(e.target.value)}
          />

          <select
            className="newuser-select"
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="college-admin">Admin</option>
          </select>

          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create Password"
              className="input-field"
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Create password"
              style={{ paddingRight: '60px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              aria-pressed={showPassword}
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                color: '#999',
                padding: 0
              }}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="input-field"
              onChange={(e) => setConfirmPassword(e.target.value)}
              aria-label="Confirm password"
              style={{ paddingRight: '60px' }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(prev => !prev)}
              aria-pressed={showConfirmPassword}
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                color: '#999',
                padding: 0
              }}
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button type="submit" className="login-btn">Sign Up</button>
        </form>
      </div>
    </div>
  )
}