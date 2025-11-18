import './newuser.css'
import { useState } from "react"

export default function NewUser() {
  const [name, setName] = useState("")
  const [mobile, setMobile] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSignup = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    console.log({ name, mobile, email, password, confirmPassword })
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="title">Create Account</h2>

        <form onSubmit={handleSignup} className="login-form">
          <input
            type="text"
            placeholder="Full Name"
            className="input-field"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Mobile Number"
            className="input-field"
            onChange={(e) => setMobile(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="input-field"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Create Password"
            className="input-field"
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="input-field"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit" className="login-btn">Sign Up</button>
        </form>
      </div>
    </div>
  )
}