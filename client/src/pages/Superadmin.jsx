
import React, { useState } from "react"
import './superadmin.css'

export default function SuperAdmin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e) => {
    e.preventDefault()
    console.log({ email, password })
  }

  return (
    <div className="superadmin-container">
      <div className="superadmin-card">
        <h2 className="superadmin-title">Super Admin Login</h2>

        <form onSubmit={handleLogin} className="superadmin-form">
          <input
            type="email"
            placeholder="Email"
            className="superadmin-input"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="superadmin-input"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="superadmin-btn">Login</button>
        </form>
      </div>
    </div>
  )
}