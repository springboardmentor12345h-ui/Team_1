import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import './Login.css'
import Lottie from "lottie-react";
import walkingAnimation from "../assets/walking2.json";
import logo from "../assets/logo.png";

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const reloaded = sessionStorage.getItem("loginReloaded");

    if (!reloaded) {
      sessionStorage.setItem("loginReloaded", "true");
      window.location.reload();
    }
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      alert("Please enter both email and password")
      return
    }

    try {
      const res = await axios.post("http://localhost:5000/auth/login", { email, password })
      console.log("Server Response:", res.data)

      if (res.data && res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);

        // Save full user object for registration & feedback
        localStorage.setItem("user", JSON.stringify(res.data.user));

        if (res.data.role === "college-admin") {
          navigate("/college-dashboard");
        } else {
          navigate("/student-dashboard");
        }
      } else {
        alert(res.data.message || "Invalid email or password")
      }
    } catch (err) {
      console.error("Login Error:", err.response || err);
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
        <div className="login-illustration">
          <Lottie
            animationData={walkingAnimation}
            loop={true}
          />
        </div>
        <div className="maincard">
          <div className="login-logo-wrapper">
            <img
              src={logo}
              alt="CampusEventHub Logo"
              className="login-logo"
            />
          </div>

          <h2 className="title">Login to CampusEventHub</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="email"
              placeholder="Email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div style={{ position: "relative", width: "100%",boxShadow:"none" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: "60px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                aria-pressed={showPassword}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "13px",
                  color: "#999",
                  padding: 0
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <button type="submit" className="login-btn">Sign In</button>
          </form>

          <div className="links">
            <button className="link-item" onClick={() => navigate("/signup")}>
              Sign Up
            </button>
          </div></div>
      </div>
      <div className="colrbox"></div>
    </div>
  )
}