import { useState } from "react";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const user = {
    name: "John",
    role: "Student"
  };

  return (
    <nav className="navbar">

      {/* Left Hamburger Icon */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <MenuIcon style={{ fontSize: 30 }} />
      </div>

      <div className="logo">CampusEventsHub</div>

      {/* Right Profile */}
      <div className="profile">
        <AccountCircleIcon className="profile-icon" />
        <div className="user-info">
          <span className="user-name">{user.name}</span>
          <span className="user-role">{user.role}</span>
        </div>
      </div>

      {/* Slide Menu */}
      {menuOpen && (
        <div className="side-menu">
          <p className="menu-item">Profile</p>
          <p className="menu-item">Logout</p>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
