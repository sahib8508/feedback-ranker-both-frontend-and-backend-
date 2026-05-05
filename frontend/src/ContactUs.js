import React from "react";
import { Link } from "react-router-dom";
import "./contactUs.css";
import { useDarkMode } from "./DarkModeContext";
import { useEffect } from 'react';

function ContactUs() {
  const { darkMode } = useDarkMode();
useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className={`cc-wrapper ${darkMode ? "cc-dark" : ""}`}>
      {/* Header Section */}
      <header className="cc-header">
        <div className="cc-header-content">
          <div className="cc-logo-wrapper">
            <div className="cc-icon-container">
              <svg width="50" height="50" viewBox="0 0 24 24" fill="white">
                <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
              </svg>
            </div>
            <h1 className="cc-title">
              <Link to="/" className="cc-title-link">Feedback Ranker</Link>
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="cc-main">
        <div className="cc-contact-container">
          <div className="cc-contact-header">
            <h2 className="cc-contact-title">Contact Us</h2>
            <span className="cc-contact-subtitle">
              We're here to help with any questions or concerns
            </span>
          </div>

          <div className="cc-contact-layout">
            <div className="cc-info-column">
              <div className="cc-info-card">
                <div className="cc-info-header">
                  <h3 className="cc-info-heading">Get in Touch</h3>
                  <div className="cc-info-divider"></div>
                </div>

                <div className="cc-info-item">
                  <div className="cc-info-icon">✉️</div>
                  <div className="cc-info-content">
                    <h4 className="cc-info-subtitle">Email</h4>
                    <span className="cc-info-text">sahibhussain8508@gmail.com</span>
                  </div>
                </div>

                <div className="cc-info-item">
                  <div className="cc-info-icon">📱</div>
                  <div className="cc-info-content">
                    <h4 className="cc-info-subtitle">Phone</h4>
                    <span className="cc-info-text">+91-7004032486</span>
                  </div>
                </div>

                <div className="cc-info-item">
                  <div className="cc-info-icon">🕒</div>
                  <div className="cc-info-content">
                    <h4 className="cc-info-subtitle">Hours</h4>
                    <span className="cc-info-text">Monday - Friday: 9:00 AM - 5:00 PM</span>
                    <span className="cc-info-text">Saturday: 10:00 AM - 2:00 PM</span>
                    <span className="cc-info-text">Sunday: Closed</span>
                  </div>
                </div>

                <div className="cc-social-section">
                  <h4 className="cc-social-heading">Connect With Us</h4>
                  <div className="cc-social-icons">
                    <a
                      href="https://www.facebook.com/sahibhussain3614"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cc-social-link"
                    >
                      <svg viewBox="0 0 24 24" width="24" height="24">
                        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                      </svg>
                    </a>
                    <a
                      href="https://x.com/SAHIBHU58672729"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cc-social-link"
                    >
                      <svg viewBox="0 0 24 24" width="24" height="24">
                        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z" />
                      </svg>
                    </a>
                    <a
                      href="https://www.linkedin.com/in/sahibhussainn"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cc-social-link"
                    >
                      <svg viewBox="0 0 24 24" width="24" height="24">
                        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                      </svg>
                    </a>
                    <a
                      href="https://www.instagram.com/_sahibhussain/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cc-social-link"
                    >
                      <svg viewBox="0 0 24 24" width="24" height="24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="cc-map-section">
            <h3 className="cc-map-title">Find Us on Campus</h3>
            <div className="cc-map-container">
              <div className="cc-map-placeholder">
                <div className="cc-map-icon">📍</div>
                <span className="cc-map-label">Interactive Campus Map</span>
                <span className="cc-map-details">Building 3, Administration Wing, 2nd Floor</span>
                <span className="cc-map-details">Student Services Center</span>
              </div>
            </div>
          </div>

          <div className="cc-navigation">
            <Link to="/" className="cc-nav-button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="cc-nav-icon">
                <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="cc-footer">
        <div className="cc-footer-content">
          <span className="cc-copyright">© 2025 Feedback Ranker. All rights reserved.</span>
          <div className="cc-footer-links">
            <Link to="/" className="cc-footer-link">Home</Link>
            <Link to="/privacy-policy" className="cc-footer-link">Privacy Policy</Link>
            <Link to="/terms-of-service" className="cc-footer-link">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ContactUs;
