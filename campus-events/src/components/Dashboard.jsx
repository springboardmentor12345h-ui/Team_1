import React from "react";
import "../styles/Dashboard.css";

// MUI Icons
import EventNoteIcon from "@mui/icons-material/EventNote";        
import EventAvailableIcon from "@mui/icons-material/EventAvailable"; 
import GroupIcon from "@mui/icons-material/Group";                
import UpcomingIcon from "@mui/icons-material/Upcoming";          

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Student Dashboard</h2>

      <div className="stats-grid">

        {/* Total Events */}
        <div className="stat-card blue">
          <div className="icon-circle blue-bg">
            <EventNoteIcon style={{ fontSize: 36, color: "white" }} />
          </div>
          <h3>Total Events</h3>
          <p className="number">0</p>
        </div>

        {/* Active Events */}
        <div className="stat-card green">
          <div className="icon-circle green-bg">
            <EventAvailableIcon style={{ fontSize: 36, color: "white" }} />
          </div>
          <h3>Active Events</h3>
          <p className="number">0</p>
        </div>

        {/* Enrolled by Students */}
        <div className="stat-card purple">
          <div className="icon-circle purple-bg">
            <GroupIcon style={{ fontSize: 36, color: "white" }} />
          </div>
          <h3>Registered Events</h3>
          <p className="number">0</p>
        </div>

        {/* Upcoming Events */}
        <div className="stat-card orange">
          <div className="icon-circle orange-bg">
            <UpcomingIcon style={{ fontSize: 36, color: "white" }} />
          </div>
          <h3>Upcoming Events</h3>
          <p className="number">0</p>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
