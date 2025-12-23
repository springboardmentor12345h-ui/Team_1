import './newuser.css'
import { useState, useEffect } from "react"
import axios from "axios"
import Lottie from "lottie-react";
import workingAnimation from "../assets/working.json";
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
  const [apiError, setApiError] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const res = await fetch("http://localhost:5000/health");
        if (!res.ok) throw new Error("Backend not healthy");
      } catch (err) {
        console.error("Backend health check failed", err);
        navigate("/error", { replace: true });
      }
    };

    checkBackendHealth();
  }, []);

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
      console.error("Signup Error:", err.response || err);
      setApiError(true);
    }
  }

  if (apiError) {
    navigate("/error", { replace: true });
    return null;
  }

  return (
    <div className="login-outer">
      <div className="login-container">
        <div className="login-illustration purple2">
          <div className='nu-back-container desktop-only'><button className="nu-back-link" onClick={() => navigate(-1)}>
            ← Back to Login
          </button></div>
          <Lottie
            animationData={workingAnimation}
            loop={true}
          />
        </div>
        <div className="maincard">
          <h2 className="title">Create Account</h2>

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
            <button
              type="button"
              className="nu-back-link mobile-only"
              onClick={() => navigate(-1)}
            >
              ← Back to Login
            </button>
          </form>
        </div>
      </div>
      <div className="colrbox"></div>
    </div>
  )
}