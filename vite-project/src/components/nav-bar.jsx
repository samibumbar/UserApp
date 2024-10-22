import React from "react";
import { Link } from "react-router-dom";
import "./nav-bar.css";

function Navbar() {
  return (
    <nav className="nav-bar">
      <ul>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <Link to="/messages">Messages</Link>
        </li>
        <li>
          <Link to="/friends">Friends</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
