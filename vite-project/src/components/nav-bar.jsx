import React from "react";
import { Link } from "react-router-dom";
import "./nav-bar.css";

function Navbar() {
  return (
    <nav className="nav-bar">
      <ul>
        <li>
          <Link to="/profile">
            <i className="fa-solid fa-user"></i>
          </Link>
        </li>
        <li>
          <Link to="/messages">
            <i className="fa-solid fa-message"></i>
          </Link>
        </li>
        <li>
          <Link to="/friends">
            <i className="fa-solid fa-user-group"></i>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
