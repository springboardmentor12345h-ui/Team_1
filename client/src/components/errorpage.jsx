import React from "react";
import Lottie from "lottie-react";
import errorAnimation from "../assets/errorpg.json";
import "./errorpage.css";
import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <div className="error-card">
        <Lottie
          animationData={errorAnimation}
          loop
          className="error-animation"
        />
        <button className="error-btn" onClick={() => navigate("/")}>
          Retry
        </button>
      </div>
    </div>
  );
}