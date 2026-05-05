import React from "react";
import { Link } from "react-router-dom";
import "./privacyPolicy.css";
import { useDarkMode } from "./DarkModeContext";
import { useEffect } from 'react';
function PrivacyPolicy() {
  const { darkMode, toggleDarkMode } = useDarkMode();
useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className={`pp-container ${darkMode ? "pp-dark" : ""}`}>
      {/* Header Section */}
      <header className="pp-header">
        <div className="pp-header-wrapper">
          <div className="pp-logo-wrapper">
            <div className="pp-logo-icon">
              <svg width="50" height="50" viewBox="0 0 24 24" fill="white">
                <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
              </svg>
            </div>
            <h1 className="pp-title" style={{ margin: 0 }}>
              <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                Feedback Ranker
              </Link>
            </h1>
          </div>

          <div className="pp-theme-toggle-wrapper">
            <button
              className={`pp-theme-toggle ${darkMode ? "pp-dark" : ""}`}
              onClick={toggleDarkMode}
            >
              <div className="pp-toggle-thumb"></div>
              <span className="pp-toggle-moon">🌙</span>
              <span className="pp-toggle-sun">☀️</span>
            </button>
            <span className="pp-toggle-label">
              {darkMode ? "Dark Mode" : "Light Mode"}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pp-main">
        <div className="pp-content-wrapper">
          <div className="pp-title-block">
            <h2>Privacy Policy</h2>
            <div className="pp-update-date">Last Updated: April 10, 2025</div>
          </div>

          <div className="pp-section">
            <h3>1. Information We Collect</h3>
            <p className="unique-p">
              At Feedback Ranker, we value your privacy and are committed to
              protecting your personal information. This Privacy Policy explains
              how we collect, use, and safeguard your data when you use our
              platform.
            </p>
           <p className="unique-p">We collect the following types of information:</p>
            <ul className="pp-bullet-list">
              <li>
                <strong>Personal Information:</strong> Name, email address, and
                other contact details you voluntarily provide.
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you interact
                with our platform, including device information and IP address.
              </li>
              <li>
                <strong>Feedback Data:</strong> Content of feedback submissions
                and book requests you make through our system.
              </li>
            </ul>
          </div>

          <div className="pp-section">
            <h3>2. How We Use Your Information</h3>
           <p className="unique-p">We use the collected information for the following purposes:</p>
            <ul className="pp-bullet-list">
              <li>To provide and maintain our services</li>
              <li>To notify you about updates or changes to our platform</li>
              <li>To respond to your feedback, inquiries, and book requests</li>
              <li>
                To improve our platform based on your usage patterns and
                feedback
              </li>
              <li>To protect against misuse or unauthorized access</li>
            </ul>
          </div>

          <div className="pp-section">
            <h3>3. Data Security</h3>
           <p className="unique-p">
              We implement appropriate security measures to protect your
              personal information from unauthorized access, alteration,
              disclosure, or destruction. Your data is encrypted during
              transmission and secure in storage.
            </p>
            <p className="unique-p">
              While we strive to use commercially acceptable means to protect
              your personal information, we cannot guarantee its absolute
              security.
            </p>
          </div>

          <div className="pp-section">
            <h3>4. Sharing Your Information</h3>
           <p className="unique-p">
              We do not sell, trade, or otherwise transfer your personal
              information to third parties without your consent, except to
              trusted partners who assist us in operating our platform,
              conducting our business, or serving you.
            </p>
          </div>

          <div className="pp-section">
            <h3>5. Your Rights</h3>
           <p className="unique-p">You have the right to:</p>
            <ul className="pp-bullet-list">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your information</li>
              <li>Request restriction of processing</li>
              <li>Data portability</li>
            </ul>
          </div>

          <div className="pp-navigation">
            <Link to="/" className="pp-nav-button">
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
            <Link to="/contact-us" className="pp-nav-button">
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
      <footer className="pp-footer">
        <div className="pp-footer-wrapper">
         <p className="unique-p">© 2025 Feedback Ranker. All rights reserved.</p>
          <div className="pp-footer-links">
            <Link to="/">Home</Link>
            <Link to="/terms-of-service">Terms of Service</Link>
            <Link to="/contact-us">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PrivacyPolicy;