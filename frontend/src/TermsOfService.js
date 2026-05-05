import React from "react";
import { Link } from "react-router-dom";
import "./termOfService.css";
import { useDarkMode } from "./DarkModeContext";
import { useEffect } from 'react';

function TermsOfService() {
  const { darkMode, toggleDarkMode } = useDarkMode();
 useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className={`tos-container ${darkMode ? "tos-dark" : ""}`}>
      {/* Header Section */}
      <header className="tos-header">
        <div className="tos-header-wrapper">
          <div className="tos-logo-wrapper">
            <div className="tos-logo-icon">
              <svg width="50" height="50" viewBox="0 0 24 24" fill="white">
                <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
              </svg>
            </div>
            <h1 className="tos-title" style={{ margin: 0 }}>
              <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                Feedback Ranker
              </Link>
            </h1>
          </div>

          <div className="tos-mode-toggle-wrapper">
            <button
              className={`tos-mode-toggle ${darkMode ? "tos-dark" : ""}`}
              onClick={toggleDarkMode}
            >
              <div className="tos-toggle-thumb"></div>
              <span className="tos-toggle-icon-moon">🌙</span>
              <span className="tos-toggle-icon-sun">☀️</span>
            </button>
            <span className="tos-toggle-text">
              {darkMode ? "Dark Mode" : "Light Mode"}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="tos-main">
        <div className="tos-content-wrapper">
          <div className="tos-content-header">
            <h2>Terms of Service</h2>
            <div className="tos-update-date">Last Updated: April 10, 2025</div>
          </div>

          <div className="tos-section">
            <h3>1. Acceptance of Terms</h3>
             <p className="unique-p">
              By accessing or using the Feedback Ranker platform, you agree to be
              bound by these Terms of Service. If you do not agree to all the
              terms and conditions, you may not access or use our services.
            </p>
          </div>

          <div className="tos-section">
            <h3>2. User Responsibilities</h3>
            <p className="unique-p">When using Feedback Ranker, you agree to:</p>
            <ul >
                              <li>Provide accurate and complete information</li>
                              <li>Maintain the confidentiality of your account information</li>
                              <li>
                                Be respectful and constructive in your feedback submissions
                              </li>
                              <li>
                                Not engage in any activity that could harm the platform or other
                                users
                              </li>
                              <li>
                                Not use the platform for any illegal or unauthorized purpose
                              </li>
            </ul>
          </div>

          <div className="tos-section">
            <h3>3. Intellectual Property</h3>
            <p className="unique-p">
              The Feedback Ranker platform, including all content, features, and
              functionality, is owned by Feedback Ranker and protected by
              copyright, trademark, and other intellectual property laws.
            </p>
            <p className="unique-p">
              You may not reproduce, distribute, modify, create derivative works
              of, publicly display, publicly perform, republish, download,
              store, or transmit any materials from our platform without our
              express written consent.
            </p>
          </div>

          <div className="tos-section">
            <h3>4. User Content</h3>
             <p className="unique-p">
              By submitting feedback, requests, or other content to Campus
              Connect, you grant us a non-exclusive, perpetual, royalty-free,
              transferable, sub-licensable right to use, reproduce, modify,
              adapt, publish, and display such content.
            </p>
            <p className="unique-p">
              You represent and warrant that you own or control all rights to
              the content you submit and that such content does not violate
              these Terms of Service.
            </p>
          </div>

          <div className="tos-section">
            <h3>5. Limitation of Liability</h3>
             <p className="unique-p">
              Feedback Ranker shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages resulting from your
              access to or use of, or inability to access or use, the platform
              or any content thereon.
            </p>
          </div>

          <div className="tos-navigation">
            <Link to="/" className="tos-nav-btn">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
              </svg>
              Back to Home
            </Link>
            <Link to="/contact-us" className="tos-nav-btn">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
              </svg>
              Contact Us
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="tos-footer">
        <div className="tos-footer-wrapper">
          <p className="unique-p">© 2025 Feedback Ranker. All rights reserved.</p>
          <div className="tos-footer-links">
            <Link to="/">Home</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/contact-us">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default TermsOfService;