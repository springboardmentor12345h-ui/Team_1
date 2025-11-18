import React, { useState } from "react"
import './collegeadmin.css'
export default function CollegeAdmin() {
  const [collegeName, setCollegeName] = useState("")
  const [password, setPassword] = useState("")
  const handleLogin = (e) => {
    e.preventDefault()
    console.log({ collegeName, password })
  }

  return (
    <div className="collegeadmin-container">
      <div className="collegeadmin-card">
        <h2 className="collegeadmin-title">College Admin Login</h2>

        <form onSubmit={handleLogin} className="collegeadmin-form">
          <input
            type="text"
            placeholder="College Name"
            className="collegeadmin-input"
            onChange={(e) => setCollegeName(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="collegeadmin-input"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="collegeadmin-btn">Login</button>
        </form>
      </div>
    </div>
  )
}