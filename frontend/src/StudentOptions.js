import React, { useState, useEffect } from "react";
import { useDarkMode } from "./DarkModeContext";
import {
  FiSun,
  FiMoon,
  FiHome,
  FiBook,
  FiAward,
  FiUser,
  FiLogOut,
  FiChevronDown,
  FiChevronUp,
  FiFolder,
    FiSearch,
} from "react-icons/fi";
import "./StudentOptions.css";
import { Link } from "react-router-dom"; // Make sure this is imported at the top

const StudentPortal = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [userProfileOpen, setUserProfileOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
const [error, setError] = useState(null);
useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  useEffect(() => {
    if (error) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [error]);
  useEffect(() => {
    const handleScroll = () => {
      setHeaderScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

 const portalNavItems = [
  {
    name: "Home",
    icon: <FiHome className="portal-nav-icon" />,
    path: "/student",
  },
  {
    name: "Reviews",
    icon: <FiAward className="portal-nav-icon" />,
    path: "/student/review",
  },
  {
    name: "Feedback",
    icon: <FiBook className="portal-nav-icon" />,
    path: "/student/feedback",
  },
    {
    name: "Library Request",
    icon: <FiFolder className="portal-nav-icon" />,
    path: "/student/library-request",
  },
  {
    name: "Resources",
    icon: <FiFolder className="portal-nav-icon" />,
    path: "/student/resources",
  },
  // {
  //   name: "Track",
  //   icon: <FiSearch className="portal-nav-icon" />,
  //   path: "/student/track_submissions",
  // },
];

  const portalUserMenu = [
    {
      name: "Profile",
      icon: <FiUser className="portal-dropdown-icon" />,
      path: "/student/profile",
    },
    {
      name: "Logout",
      icon: <FiLogOut className="portal-dropdown-icon" />,
      path: "/logout",
    },
  ];

  return (
    <div
      className={`portal-container ${
        darkMode ? "portal-dark" : "portal-light"
      }`}
    >
      {/* Header Section */}
      <header
        className={`portal-header ${
          headerScrolled ? "portal-header-scrolled" : ""
        }`}
      >
        <div className="portal-header-content">
          <div className="portal-brand">
            <Link to="/">
              <h1 className="portal-logo">Feedback Ranker</h1>
            </Link>
            <span className="portal-subtitle">Student Portal</span>
          </div>

          <div className="portal-nav-wrapper">
            {/* Desktop Navigation */}
            <nav className="portal-desktop-nav">
              <ul className="portal-nav-list">
                {portalNavItems.map((item, index) => (
                  <li key={index} className="portal-nav-item">
                    <Link to={item.path} className="portal-nav-link">
                      {item.icon}
                      <span className="portal-nav-text">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* User Controls */}
            <div className="portal-user-controls">
              <button
                onClick={toggleDarkMode}
                className="portal-theme-toggle"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <FiSun className="portal-theme-icon" />
                ) : (
                  <FiMoon className="portal-theme-icon" />
                )}
              </button>

              <div className="portal-user-menu">
                <button
                  className="portal-user-button"
                 
                  aria-expanded={userProfileOpen}
                  aria-label="User menu"
                >
                  <div className="portal-user-avatar">SC</div>
                  
                </button>

                {userProfileOpen && (
                  <div className="portal-user-dropdown">
                    {portalUserMenu.map((item, index) => (
                      <Link
                        key={index}
                        to={item.path}
                        className="portal-dropdown-item"
                      >
                        {item.icon}
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="portal-mobile-button"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              aria-label="Toggle mobile menu"
            >
              <div
                className={`portal-hamburger ${
                  mobileNavOpen ? "portal-hamburger-open" : ""
                }`}
              >
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {mobileNavOpen && (
        <div className="portal-mobile-nav">
          <ul className="portal-mobile-nav-list">
            {portalNavItems.map((item, index) => (
              <li key={index} className="portal-mobile-nav-item">
                <Link
                  to={item.path}
                  className="portal-mobile-nav-link"
                  onClick={() => setMobileNavOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
            {portalUserMenu.map((item, index) => (
              <li key={index} className="portal-mobile-nav-item">
                <Link
                  to={item.path}
                  className="portal-mobile-nav-link"
                  onClick={() => setMobileNavOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Content */}
      <main className="portal-main-content">
        <div className="portal-content-container">
          <h2 className="portal-welcome-heading">Welcome to Feedback Ranker</h2>

          <div className="portal-feature-grid">
            <Link
              to="/student/review"
              className="portal-feature-card portal-review-card"
            >
              <div className="portal-card-icon">📊</div>
              <h3 className="portal-card-title">College Reviews & Rankings</h3>
              <p className="portal-card-desc">
                Compare colleges based on feedback resolution rates and student
                reviews
              </p>
              <div className="portal-card-hover"></div>
            </Link>

            <Link
              to="/student/feedback"
              className="portal-feature-card portal-feedback-card"
            >
               
              <div className="portal-card-icon">📝</div>
              <h3 className="portal-card-title">
                Submit Feedback 
              </h3>
              <p className="portal-card-desc">
                Share your thoughts and feedback about your college experience.
              </p>
              <div className="portal-card-hover"></div>
            </Link>
          </div>
          <Link
            to="/student/resources"
            className="portal-feature-card portal-resources-card"
          >
            <div className="portal-card-icon">📚</div>
            <h3 className="portal-card-title">Academic Resources</h3>
            <p className="portal-card-desc">
              Access PYQs, notes, lab manuals, and academic resources from
              different colleges
            </p>
            <div className="portal-card-hover"></div>
          </Link>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="portal-footer">
        <div className="portal-footer-content">
          <p className="portal-copyright">
            © {new Date().getFullYear()} Feedback Ranker - All rights reserved
          </p>
          <div className="portal-footer-links">
            <a href="/" className="portal-footer-link">
              Home
            </a>
            <a href="/privacy-policy" className="portal-footer-link">
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="portal-footer-link">
              Terms of Service
            </a>
            <a href="/contact-us" className="portal-footer-link">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StudentPortal;
