// components/LandingPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UniqueLoadingScreen } from './UniqueLoadingScreen';
import './LandingPage.css';
import { useDarkMode } from "./DarkModeContext";
const LandingPage = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
const { darkMode, toggleDarkMode } = useDarkMode();
  useEffect(() => {
    // Simulate loading time (1.5 seconds)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const handleOrganizationClick = () => {
    navigate('/organization/login');
  };

  const handleStudentClick = () => {
    navigate('/student');
  };

  // Main Landing Page Content
  const LandingContent = () => {
    return (
      <div className={`cc-wrapper ${darkMode ? "pp-dark" : ""}`}>
        <header className="landing-header">
          <div className="landing-logo">
            <svg className="campus-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9ZM17 15.99L12 18.72L7 15.99V12.27L12 15L17 12.27V15.99Z" />
            </svg>
            <span>Feedback Ranker</span>
            
          </div>
        </header>

        <main className="landing-main">
          <div className="landing-hero">
            <h1>Welcome to Feedback Ranker</h1>
            <p>A platform to bridge the gap between educational institutions and students</p>
          </div>

          <div className="landing-container">
            <div className="landing-card">
              <h2>Choose how you want to proceed</h2>
              
              <div className="landing-buttons">
                <button className="btn-organization" onClick={handleOrganizationClick}>
                  <svg className="btn-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 21V5C19 3.9 18.1 3 17 3H7C5.9 3 5 3.9 5 5V21H19ZM7 5H17V19H7V5ZM13 11H17V13H13V11ZM13 7H17V9H13V7ZM13 15H17V17H13V15ZM7 11H11V13H7V11ZM7 7H11V9H7V7ZM7 15H11V17H7V15Z" />
                  </svg>
                  Continue as Organization
                </button>

                <button className="btn-student" onClick={handleStudentClick}>
                  <svg className="btn-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 6C13.1 6 14 6.9 14 8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8C10 6.9 10.9 6 12 6ZM12 13C9.33 13 4 14.34 4 17V20H20V17C20 14.34 14.67 13 12 13ZM12 15C14.67 15 18 16.25 18 17V18H6V17C6 16.25 9.33 15 12 15Z" />
                  </svg>
                  Continue as Student
                </button>
              </div>
            </div>

            <div className="landing-features">
              <div className="feature-item">
                <svg className="feature-icon feedback-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" />
                  <path d="M12 14H16V12H12V14ZM8 14H10V12H8V14ZM12 11H16V9H12V11ZM8 11H10V9H8V11ZM8 8H16V6H8V8Z" />
                </svg>
                <h3>Submit Feedback</h3>
                <p>Share your college experience and help improve campus services</p>
              </div>

              <div className="feature-item">
                <svg className="feature-icon library-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 5C19.89 4.65 18.67 4.5 17.5 4.5C15.55 4.5 13.45 4.9 12 6C10.55 4.9 8.45 4.5 6.5 4.5C4.55 4.5 2.45 4.9 1 6V20.65C1 20.9 1.25 21.15 1.5 21.15C1.6 21.15 1.65 21.1 1.75 21.1C3.1 20.45 5.05 20 6.5 20C8.45 20 10.55 20.4 12 21.5C13.35 20.65 15.8 20 17.5 20C19.15 20 20.85 20.3 22.25 21.05C22.35 21.1 22.4 21.1 22.5 21.1C22.75 21.1 23 20.85 23 20.6V6C22.4 5.55 21.75 5.25 21 5ZM21 18.5C19.9 18.15 18.7 18 17.5 18C15.8 18 13.35 18.65 12 19.5V8C13.35 7.15 15.8 6.5 17.5 6.5C18.7 6.5 19.9 6.65 21 7V18.5Z" />
                  <path d="M17.5 10.5C18.38 10.5 19.23 10.59 20 10.76V9.24C19.21 9.09 18.36 9 17.5 9C16.22 9 15.01 9.16 14 9.46V11.05C14.99 10.69 16.18 10.5 17.5 10.5Z" />
                  <path d="M17.5 13.5C18.38 13.5 19.23 13.59 20 13.76V12.24C19.21 12.09 18.36 12 17.5 12C16.22 12 15.01 12.16 14 12.46V14.05C14.99 13.69 16.18 13.5 17.5 13.5Z" />
                  <path d="M17.5 16.5C18.38 16.5 19.23 16.59 20 16.76V15.24C19.21 15.09 18.36 15 17.5 15C16.22 15 15.01 15.16 14 15.46V17.05C14.99 16.69 16.18 16.5 17.5 16.5Z" />
                </svg>
                <h3>Library Requests</h3>
                <p>Request books and resources easily through our streamlined system</p>
              </div>

              <div className="feature-item">
                <svg className="feature-icon rankings-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 14H5V19H7V14Z" />
                  <path d="M12.67 4H11.33L12 1L12.67 4Z" />
                  <path d="M13 14H11V19H13V14Z" />
                  <path d="M19 14H17V19H19V14Z" />
                  <path d="M20 10H4V12H20V10Z" />
                  <path d="M21 8H3C2.45 8 2 8.45 2 9V21C2 21.55 2.45 22 3 22H21C21.55 22 22 21.55 22 21V9C22 8.45 21.55 8 21 8ZM20 20H4V10H20V20Z" />
                  <path d="M17.24 6.65L18.32 5.57C18.71 5.18 18.71 4.55 18.32 4.16L17.84 3.68C17.45 3.29 16.82 3.29 16.43 3.68L15.35 4.76L17.24 6.65Z" />
                  <path d="M15.52 6.13L14.58 7.07L16.92 9.41L17.86 8.47L15.52 6.13Z" />
                </svg>
                <h3>College Rankings</h3>
                <p>Compare colleges based on feedback resolution and service quality</p>
              </div>
            </div>
          </div>
        </main>

        <footer className="landing-footer">
          <p>© {new Date().getFullYear()} Feedback Ranker - All Rights Reserved</p>
          <div className="footer-links12">
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms-of-service">Terms of Service</a>
            <a href="/contact-us">Contact Us</a>
          </div>
        </footer>
      </div>
    );
  };

  return loading ? <UniqueLoadingScreen message="Connecting Colleges & Students" /> : <LandingContent />;
};

export default LandingPage;