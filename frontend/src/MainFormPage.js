import React, { useState, useEffect } from "react";
import "./App.css";
import { Link } from 'react-router-dom';
import { useDarkMode } from "./DarkModeContext";
import API_BASE_URL from './apiConfig';

function MainFormPage() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("feedback");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let data;
    let url;

    if (activeSection === "feedback") {
      data = {
        name: e.target.name.value,
        department: e.target.department.value,
        message: e.target.message.value,
        email: e.target.email.value,
        anonymous: e.target.name.value.trim() === "", // Mark as anonymous if name is empty
      };
      url = `${API_BASE_URL}/submit_feedback`;
    } else {
      data = {
        name: e.target.name.value,
        bookTitle: e.target.bookTitle.value,
        author: e.target.author.value,
        email: e.target.email.value,
        requestDetails: e.target.requestDetails.value,
      };
      url = `${API_BASE_URL}/request_book`;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Submission result:", result);
        setSubmitted(true);
      } else {
        console.error("Failed to submit form:", response.statusText);
        alert("Failed to submit. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error connecting to server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`campus-portal ${darkMode ? "dark" : ""}`}>
      {/* Header Section */}
      <header className="portal-header">
        <div className="header-content">
          <div className="logo-container">
            <div className="campus-icon">
              <svg width="50" height="50" viewBox="0 0 24 24" fill="white">
                <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
              </svg>
            </div>
            <h1>Feedback Ranker</h1>
          </div>

          <div className="dark-mode-toggle-container">
            <button
              className={`dark-mode-toggle ${darkMode ? "dark" : ""}`}
              onClick={toggleDarkMode}
            >
              <div className="toggle-thumb"></div>
              <span className="toggle-icon moon">🌙</span>
              <span className="toggle-icon sun">☀️</span>
            </button>
            <span className="toggle-label">
              {darkMode ? "Dark Mode" : "Light Mode"}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="portal-content">
        <div className="welcome-banner">
          <div className="banner-text">
            <h2>Your Voice Shapes Our Campus</h2>
            <p>Help us build a better learning environment together</p>
          </div>

          <div className="illustration-container">
            {/* SVG Illustration */}
            <svg
              className="feedback-illustration"
              viewBox="0 0 600 400"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.6" />
                </linearGradient>
              </defs>

              {/* Background elements */}
              <circle cx="150" cy="150" r="80" fill="url(#grad1)" />
              <circle cx="450" cy="250" r="100" fill="url(#grad1)" />

              {/* Campus building */}
              <rect
                x="200"
                y="150"
                width="200"
                height="150"
                fill="white"
                opacity="0.8"
              />
              <rect
                x="230"
                y="90"
                width="140"
                height="60"
                fill="white"
                opacity="0.8"
              />
              <polygon
                points="200,150 300,90 400,150"
                fill="white"
                opacity="0.8"
              />

              {/* Windows */}
              <rect
                x="220"
                y="170"
                width="30"
                height="30"
                fill="#6e8efb"
                opacity="0.8"
              />
              <rect
                x="270"
                y="170"
                width="30"
                height="30"
                fill="#6e8efb"
                opacity="0.8"
              />
              <rect
                x="320"
                y="170"
                width="30"
                height="30"
                fill="#6e8efb"
                opacity="0.8"
              />
              <rect
                x="220"
                y="220"
                width="30"
                height="30"
                fill="#6e8efb"
                opacity="0.8"
              />
              <rect
                x="320"
                y="220"
                width="30"
                height="30"
                fill="#6e8efb"
                opacity="0.8"
              />

              {/* Door */}
              <rect
                x="270"
                y="220"
                width="30"
                height="60"
                fill="#6e8efb"
                opacity="0.9"
              />

              {/* Student figures */}
              <circle cx="150" cy="280" r="15" fill="white" />
              <rect x="145" y="295" width="10" height="30" fill="white" />
              <line
                x1="145"
                y1="310"
                x2="130"
                y2="330"
                stroke="white"
                strokeWidth="3"
              />
              <line
                x1="155"
                y1="310"
                x2="170"
                y2="330"
                stroke="white"
                strokeWidth="3"
              />

              <circle cx="450" cy="290" r="15" fill="white" />
              <rect x="445" y="305" width="10" height="30" fill="white" />
              <line
                x1="445"
                y1="320"
                x2="430"
                y2="340"
                stroke="white"
                strokeWidth="3"
              />
              <line
                x1="455"
                y1="320"
                x2="470"
                y2="340"
                stroke="white"
                strokeWidth="3"
              />

              {/* Speech bubbles */}
              <ellipse
                cx="190"
                cy="250"
                rx="40"
                ry="25"
                fill="white"
                opacity="0.9"
              />
              <polygon
                points="165,265 170,250 180,265"
                fill="white"
                opacity="0.9"
              />

              <ellipse
                cx="500"
                cy="260"
                rx="40"
                ry="25"
                fill="white"
                opacity="0.9"
              />
              <polygon
                points="475,275 480,260 490,275"
                fill="white"
                opacity="0.9"
              />
            </svg>
          </div>
        </div>

        <div className="features-section">
          <div className="feature-item">
            <div className="feature-icon">✓</div>
            <span>Anonymous</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">✓</div>
            <span>Secure</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">✓</div>
            <span>Action-oriented</span>
          </div>
        </div>

        <div className="portal-services">
          <div className="services-header">
            <h2>College Support Portal</h2>
            <p className="subtitle">
              Your feedback helps us improve campus services and academic
              experience
            </p>
          </div>

          <div className="services-navigation">
            <div
              className={`nav-item ${
                activeSection === "feedback" ? "active" : ""
              }`}
              onClick={() => {
                setSubmitted(false);
                setActiveSection("feedback");
              }}
            >
              General Feedback
            </div>
            <div
              className={`nav-item ${
                activeSection === "library" ? "active" : ""
              }`}
              onClick={() => {
                setSubmitted(false);
                setActiveSection("library");
              }}
            >
              Library Book Request
            </div>
          </div>

          <div className="service-container">
          {submitted ? (
  <div className="success-message">
    <div className="success-icon">✓</div>
    <h3>Thank you!</h3>
    <p>
      Your{" "}
      {activeSection === "feedback" ? "feedback" : "book request"}{" "}
      has been submitted successfully.
    </p>
    <p className="success-detail">
      Our team will review your input and take appropriate action.
    </p>
    <div className="action-buttons">
      <button
        className="submit-another"
        onClick={() => setSubmitted(false)}
      >
        Submit Another{" "}
        {activeSection === "feedback" ? "Feedback" : "Request"}
      </button>
      <button
        className="go-home-btn"
        onClick={() => {
          setSubmitted(false);
          setActiveSection("feedback");
        }}
      >
        Back to Home
      </button>
    </div>
  </div>
) : (
              <>
                {activeSection === "feedback" ? (
                  <form onSubmit={handleSubmit} className="service-form">
                    <div className="form-group">
                      <label htmlFor="name">Name (optional)</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Your Name"
                      />
                      <small>Leave blank to submit anonymously</small>
                    </div>

                    <div className="form-group">
                      <label htmlFor="department">Department</label>
                      <select
                        name="department"
                        id="department"
                        required
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select department
                        </option>
                        <option value="Academic">Academic</option>
                        <option value="Library">Library</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Mess">Mess</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">
                        Your Email (for notification)
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="you@example.com"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="message">Your Complaint / Feedback</label>
                      <textarea
                        id="message"
                        name="message"
                        placeholder="Describe your concern..."
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className={loading ? "loading" : ""}
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Submit Feedback"}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleSubmit} className="service-form">
                    <div className="form-group">
                      <label htmlFor="name">Name (optional)</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Your Name"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">
                        Your Email (for notification)
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="you@example.com"
                        required
                      />
                      <small>
                        We'll notify you when the book becomes available
                      </small>
                    </div>

                    <div className="form-group">
                      <label htmlFor="bookTitle">Book Title</label>
                      <input
                        type="text"
                        id="bookTitle"
                        name="bookTitle"
                        placeholder="Enter the book title"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="author">Author (if known)</label>
                      <input
                        type="text"
                        id="author"
                        name="author"
                        placeholder="Author's Name"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="requestDetails">Request Details</label>
                      <textarea
                        id="requestDetails"
                        name="requestDetails"
                        placeholder="Explain your need for this book..."
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className={loading ? "loading" : ""}
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Submit Book Request"}
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="portal-footer">
        <div className="footer-content">
          <p>© 2025 Feedback Ranker. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-of-service">Terms of Service</Link>
            <Link to="/contact-us">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MainFormPage;