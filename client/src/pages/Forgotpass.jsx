import { useState } from "react"
import { useNavigate } from "react-router-dom"
import './forgotpass.css'

export default function ForgotPass() {
  const [email, setEmail] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({ email })
  }

  return (
    <div className="forgotpass-container">
      <div className="forgotpass-card">
        {/* this portion is done by praveen kumar */}
        <h2 className="forgotpass-title">
          <img src="/Logo.png" alt="Logo" className="login-logo" />
          Reset Password
        </h2>
        {/* this section of praveen kumar code is end here */}

        <form onSubmit={handleSubmit} className="forgotpass-form">
          <input
            type="email"
            placeholder="Enter your Email"
            className="forgotpass-input"
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit" className="forgotpass-btn">Send OTP</button>
        </form>
      </div>
    </div>
  )
}
