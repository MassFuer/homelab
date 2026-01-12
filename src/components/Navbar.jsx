import { NavLink, Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-brand">
          <Link to="/" className="logo">
            <span className="logo-icon">🍄</span>
            <span className="logo-text">Mass' HomeLab</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="navbar-links">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active" : "")}
              end
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/api"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              API
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/weather"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Weather
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
