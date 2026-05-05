import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { useDarkMode } from "./DarkModeContext";
import LoadingSpinner from "./LoadingSpinner";
import "./StudentFeedbackSubmission.css"; // Reusing the same CSS
import ContentValidator from "./contentValidator";
import API_BASE_URL from './apiConfig';
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";
import Papa from "papaparse";
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
const LibraryBookRequest = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();

  // Form state
  const [step, setStep] = useState(1);
  const [colleges, setColleges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [verifyingCollege, setVerifyingCollege] = useState(false);
  const [validatingContent, setValidatingContent] = useState(false);
  const [contentValidator] = useState(() => new ContentValidator());
  const [emailError, setEmailError] = useState("");
  // College selection state
  const [collegeCode, setCollegeCode] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [collegeVerified, setCollegeVerified] = useState(false);
  const [studentRollId, setStudentRollId] = useState("");

  // Student details state
  const [studentName, setStudentName] = useState("");
  const [studentRoll, setStudentRoll] = useState("");
  const [studentDept, setStudentDept] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPhone, setStudentPhone] = useState("");

  // Library request specific state
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookISBN, setBookISBN] = useState("");
  const [bookPublisher, setBookPublisher] = useState("");
  const [bookYear, setBookYear] = useState("");
  const [requestReason, setRequestReason] = useState("");
  const [requestType, setRequestType] = useState("purchase");
  const [priority, setPriority] = useState("medium");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [anonymous, setAnonymous] = useState(false);

  // Fetch colleges on component mount
  useEffect(() => {
    const fetchColleges = async () => {
      setIsLoading(true);
      try {
        const collegesCollection = collection(db, "colleges");
        const collegesSnapshot = await getDocs(collegesCollection);
        const collegesList = collegesSnapshot.docs.map((doc) => {
          const data = doc.data();
          return ensureCollegeDataStructure({
            id: doc.id,
            ...data,
          });
        });

        setColleges(collegesList);
        setError(null);
      } catch (err) {
        console.error("Error fetching colleges:", err);
        setError("Failed to load colleges database. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchColleges();
  }, []);
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setStudentEmail(email);

    if (email && !validateEmail(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }

    if (error && error.includes("email")) {
      setError(null);
    }
  };
  const handleContinueToStep3 = () => {
    if (!validateEmail(studentEmail)) {
      setError("Please enter a valid email address");
      scrollToTop();
      return;
    }
    setStep(3);
    scrollToTop();
  };
  const ensureCollegeDataStructure = (collegeData) => {
    if (!collegeData.studentDataPath) {
      console.warn(
        `College ${
          collegeData.name || collegeData.collegeName || collegeData.id
        } is missing studentDataPath.`
      );

      const collegeCodeIdentifier = collegeData.uniqueCode || collegeData.id;
      const defaultPath = `csvs/${collegeCodeIdentifier}_students.csv`;
      console.info(`Using default path: ${defaultPath}`);

      return {
        ...collegeData,
        studentDataPath: defaultPath,
      };
    }

    return collegeData;
  };

  // Verify college exists in database and check student roll ID
  const verifyCollege = async () => {
    if (!collegeCode.trim()) {
      setError("Please enter a College Code");
      scrollToTop();
      return false;
    }

    if (!studentRollId.trim()) {
      setError("Please enter a valid Roll Number/College ID");
      scrollToTop();
      return false;
    }

    setVerifyingCollege(true);
    setStudentRoll(studentRollId.trim());
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/verify_student_roll`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            collegeCode: collegeCode.trim(),
            rollNumber: studentRollId.trim(),
          }),
        }
      );

      const result = await response.json();

      if (result.status === "success" && result.verified) {
        setCollegeName(result.collegeName || "Your College");
        setCollegeVerified(true);
        setError(null);
        return true;
      } else {
        setError(
          result.message ||
            "Verification failed. Please check your College Code and Roll Number/College ID."
        );
        setCollegeVerified(false);
        scrollToTop();
        return false;
      }
    } catch (err) {
      console.error("Error verifying college:", err);

      const verificationResult = await verifyStudentRoll(
        colleges.find(
          (c) =>
            c.uniqueCode === collegeCode.trim() || c.id === collegeCode.trim()
        ),
        studentRollId.trim()
      );

      if (verificationResult.verified) {
        setCollegeName(verificationResult.collegeName || "Your College");
        setCollegeVerified(true);
        setError(null);
        return true;
      } else {
        setError(
          verificationResult.error ||
            "Connection to verification service failed. Please try again later."
        );
        setCollegeVerified(false);
        scrollToTop();
        return false;
      }
    } finally {
      setVerifyingCollege(false);
    }
  };

  const verifyStudentRoll = async (college, studentRollId) => {
    try {
      if (!college || !college.studentDataPath) {
        console.warn(
          `College ${
            college?.name || college?.id || "unknown"
          } is missing studentDataPath.`
        );
        return {
          verified: false,
          error: "Student data not available for this college",
        };
      }

      const storage = getStorage();
      const csvFileRef = storageRef(storage, college.studentDataPath);

      try {
        const csvUrl = await getDownloadURL(csvFileRef);
        const response = await fetch(csvUrl);
        const csvText = await response.text();

        const { data, errors } = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          delimitersToGuess: [",", ";", "\t", "|"],
        });

        if (errors.length > 0 && errors[0].code !== "TooFewFields") {
          console.error("CSV parsing errors:", errors);
          return { verified: false, error: "Error parsing student data" };
        }

        if (!data || data.length === 0) {
          return {
            verified: false,
            error: "No student data found for this college",
          };
        }

        const csvHeaders = data[0] ? Object.keys(data[0]) : [];
        console.log("CSV Headers:", csvHeaders);

        let rollFound = false;

        for (const row of data) {
          for (const key in row) {
            if (row[key]) {
              const cellValue = String(row[key]).trim();
              if (cellValue === studentRollId.trim()) {
                rollFound = true;
                break;
              }
            }
          }
          if (rollFound) break;
        }

        if (rollFound) {
          return {
            verified: true,
            collegeName: college.name || college.collegeName || "",
            message: "Roll Number/College ID verified successfully",
          };
        } else {
          return {
            verified: false,
            error:
              "Your Roll Number/College ID is not registered with this college",
          };
        }
      } catch (downloadErr) {
        console.error("Error downloading CSV:", downloadErr);
        return {
          verified: false,
          error: "Could not access student data for verification",
        };
      }
    } catch (err) {
      console.error("Error verifying student roll:", err);
      return {
        verified: false,
        error: "Verification failed. Please try again later.",
      };
    }
  };

  const handleContinueToStep2 = async () => {
    if (!studentRollId.trim()) {
      setError("Please enter a valid Roll Number/College ID");
      scrollToTop();
      return;
    }

    const isVerified = await verifyCollege();
    if (isVerified) {
      setStep(2);
      scrollToTop();
    } else {
      scrollToTop();
    }
  };

  const validateRequestContent = async () => {
    if (!bookTitle.trim()) {
      setError("Please provide the book title.");
      scrollToTop();
      return false;
    }

    if (!requestReason.trim()) {
      setError("Please provide a reason for your book request.");
      scrollToTop();
      return false;
    }

    if (requestReason.trim().split(" ").length < 5) {
      setError("Please provide a more detailed reason (at least 5 words).");
      scrollToTop();
      return false;
    }

    setValidatingContent(true);
    setError(null);

    try {
      const contentToValidate =
        `Library book request: ${bookTitle} by ${bookAuthor}. Reason: ${requestReason}. Additional notes: ${additionalNotes}`.trim();
      const validation = await contentValidator.validateContent(
        contentToValidate
      );

      if (!validation.isValid) {
        setError(validation.error.replace("Feedback", "Request content"));
        setValidatingContent(false);
        scrollToTop();
        return false;
      }

      setValidatingContent(false);
      return true;
    } catch (err) {
      console.error("Content validation error:", err);
      setError("Error validating request content. Please try again.");
      setValidatingContent(false);
      scrollToTop();
      return false;
    }
  };
  const handleRequestReasonChange = async (e) => {
    const value = e.target.value;
    setRequestReason(value);

    if (error && (error.includes("reason") || error.includes("content"))) {
      setError(null);
    }
  };

  const handleSubmitLibraryRequest = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const isContentValid = await validateRequestContent();
    if (!isContentValid) {
      setSubmitting(false);
      return;
    }

    try {
      const finalCollegeName = collegeName || "Unknown College";
      const libraryRequestData = {
        collegeCode,
        collegeName: finalCollegeName,
        name: anonymous ? "Anonymous" : studentName,
        email: studentEmail,
        phone: studentPhone,
        studentRoll: anonymous ? "" : studentRoll || studentRollId,
        studentDept: anonymous ? "" : studentDept,
        bookTitle,
        bookAuthor: bookAuthor || "Not specified",
        bookISBN: bookISBN || "Not provided",
        bookPublisher: bookPublisher || "Not specified",
        bookYear: bookYear || "Not specified",
        requestReason,
        requestType,
        priority,
        additionalNotes: additionalNotes || "",
        date: new Date().toISOString(),
        status: "Pending",
        anonymous,
      };

      // Send to 'libraryRequests' collection
      const libraryRequestsCollection = collection(db, "libraryRequests");
      await addDoc(libraryRequestsCollection, libraryRequestData);
      setSuccess(true);
      scrollToTop();
    } catch (err) {
      console.error("Error submitting library request:", err);
      setError(`Failed to submit library request: ${err.message}`);
      scrollToTop();
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setCollegeCode("");
    setCollegeName("");
    setCollegeVerified(false);
    setStudentRollId("");
    setStudentPhone("");
    setStudentName("");
    setStudentRoll("");
    setStudentDept("");
    setStudentEmail("");
    setBookTitle("");
    setBookAuthor("");
    setBookISBN("");
    setBookPublisher("");
    setBookYear("");
    setRequestReason("");
    setRequestType("purchase");
    setPriority("medium");
    setAdditionalNotes("");
    setAnonymous(false);
    setStep(1);
    setError(null);
  };

  const handleNewSubmission = () => {
    setSuccess(false);
    resetForm();
  };

  return (
    <div
      className={`student-feedback-submission-container ${
        darkMode ? "dark-mode" : ""
      }`}
    >
      <header className="feedback-submission-header">
        <div className="feedback-submission-header-content">
          <div className="feedback-submission-logo-container">
            <div className="feedback-submission-campus-icon">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill={darkMode ? "var(--primary-dark)" : "white"}
              >
                <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
              </svg>
            </div>
            <Link to="/">
              <h1>Feedback Ranker</h1>
            </Link>
          </div>
          <nav className="feedback-submission-nav-links">
            <Link to="/student" className="feedback-submission-nav-link">
              Dashboard
            </Link>
            <Link
              to="/student/courses"
              className="feedback-submission-nav-link"
            >
              Courses
            </Link>
            <Link
              to="/student/feedback"
              className="feedback-submission-nav-link"
            >
              Feedback
            </Link>
            <Link
              to="/student/library-request"
              className="feedback-submission-nav-link active"
            >
              Library Request
            </Link>
            <Link
              to="/student/resources"
              className="feedback-submission-nav-link"
            >
              Resources
            </Link>
          </nav>
          <div className="feedback-submission-user-controls">
            <button
              className="feedback-submission-theme-toggle"
              onClick={toggleDarkMode}
              aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {darkMode ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              )}
            </button>
            <div className="feedback-submission-user-profile">
              <span>Student</span>
              <div className="feedback-submission-profile-avatar">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="feedback-submission-main">
        <main className="feedback-main">
          {isLoading ? (
            <LoadingSpinner message="Loading colleges database..." />
          ) : success ? (
            <div className="success-message">
              <div className="success-icon">📚</div>
              <h2>Library Book Request Submitted!</h2>
              <p>
                Your book request has been submitted successfully to{" "}
                {collegeName || "the college"} library.
              </p>
              <p>
                You will be notified via email when your request is processed.
              </p>
              <div className="success-actions">
                <button
                  className="primary-button"
                  onClick={handleNewSubmission}
                >
                  Submit Another Request
                </button>
                <Link to="/student" className="secondary-button">
                  Back to Student Dashboard
                </Link>
              </div>
            </div>
          ) : (
            <div className="feedback-form-container">
              <div className="steps-indicator">
                <div className={`step ${step >= 1 ? "active" : ""}`}>
                  <div className="step-number">1</div>
                  <div className="step-title">College Verification</div>
                </div>
                <div className="step-connector"></div>
                <div className={`step ${step >= 2 ? "active" : ""}`}>
                  <div className="step-number">2</div>
                  <div className="step-title">Your Information</div>
                </div>
                <div className="step-connector"></div>
                <div className={`step ${step >= 3 ? "active" : ""}`}>
                  <div className="step-number">3</div>
                  <div className="step-title">Book Request Details</div>
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              {step === 1 && (
                <div className="form-step college-verification">
                  <h2>Verify Your College</h2>
                  <p>Please enter your college details to continue</p>

                  <div className="form-group">
                    <label htmlFor="collegeName">College Name:</label>
                    <input
                      type="text"
                      id="collegeName"
                      value={collegeName || ""}
                      onChange={(e) => setCollegeName(e.target.value)}
                      placeholder="Enter your college name"
                      disabled={collegeVerified}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="collegeCode">College Code:</label>
                    <input
                      type="text"
                      id="collegeCode"
                      value={collegeCode}
                      onChange={(e) => {
                        setCollegeCode(e.target.value);
                        setCollegeVerified(false);
                      }}
                      placeholder="Enter your College Code"
                      disabled={collegeVerified}
                      required
                    />
                    <small>
                      Enter the College Code provided by your institution
                    </small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="studentRollId">
                      Roll Number/College ID:
                    </label>
                    <input
                      type="text"
                      id="studentRollId"
                      value={studentRollId}
                      onChange={(e) => setStudentRollId(e.target.value)}
                      placeholder="Enter your Roll Number or College ID"
                      required
                    />
                    <small>For verification purposes</small>
                  </div>

                  {!collegeVerified && (
                    <button
                      className="verify-button"
                      onClick={verifyCollege}
                      disabled={verifyingCollege || !collegeCode.trim()}
                    >
                      {verifyingCollege ? (
                        <>
                          <span className="button-spinner"></span>
                          Verifying...
                        </>
                      ) : (
                        "Verify Your Authenticity"
                      )}
                    </button>
                  )}

                  {collegeVerified && (
                    <div className="verified-college">
                      <div className="verified-badge">✓ Verified</div>
                      <p>
                        <strong>College:</strong> {collegeName || "Unknown"}
                      </p>
                      <p>
                        <strong>College Code:</strong> {collegeCode}
                      </p>
                    </div>
                  )}

                  <div className="form-actions">
                    <button
                      className="primary-button"
                      onClick={handleContinueToStep2}
                      disabled={!collegeVerified || !studentRollId}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="form-step student-info">
                  <h2>Your Information</h2>
                  <p>Please provide your details or submit anonymously</p>

                  <div className="form-group">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={anonymous}
                      onChange={(e) => setAnonymous(e.target.checked)}
                    />
                    <label htmlFor="anonymous" className="checkbox-label">
                      Submit anonymously
                    </label>
                  </div>

                  {!anonymous && (
                    <>
                      <div className="form-group">
                        <label htmlFor="studentName">Full Name:</label>
                        <input
                          type="text"
                          id="studentName"
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="studentRoll">Roll Number:</label>
                        <input
                          type="text"
                          id="studentRoll"
                          value={studentRoll || studentRollId}
                          onChange={(e) => setStudentRoll(e.target.value)}
                          placeholder="Enter your roll number"
                          required
                          readOnly={collegeVerified}
                          style={
                            collegeVerified
                              ? {
                                  backgroundColor: "#f5f5f5",
                                  cursor: "not-allowed",
                                }
                              : {}
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="studentDept">Department:</label>
                        <input
                          type="text"
                          id="studentDept"
                          value={studentDept}
                          onChange={(e) => setStudentDept(e.target.value)}
                          placeholder="Enter your department"
                          required
                        />
                      </div>
                    </>
                  )}

                  <div className="form-group">
                    <label htmlFor="studentEmail">Email Address:</label>
                    <input
  type="email"
  id="studentEmail"
  value={studentEmail}
  onChange={handleEmailChange}
  placeholder="Enter your email for notifications (e.g., student@college.edu)"
  required
  pattern="[a-zA-Z0-9._%\+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"  // ✅ FIXED
  title="Please enter a valid email address"
  className={emailError ? "error-input" : ""}
/>
                    {emailError && (
                      <div className="field-error">{emailError}</div>
                    )}
                    <small>
                      You'll receive notifications when your request is
                      processed
                    </small>
                  </div>

                  <div className="form-actions">
                    <button
                      className="secondary-button"
                      onClick={() => {
                        setStep(1);
                        scrollToTop();
                      }}
                      type="button"
                    >
                      Back
                    </button>
                    <button
                      className="primary-button"
                      onClick={handleContinueToStep3}
                      disabled={
                        !studentEmail ||
                        !validateEmail(studentEmail) ||
                        (!anonymous &&
                          (!studentName ||
                            !(studentRoll || studentRollId) ||
                            !studentDept))
                      }
                      type="button"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <form
                  className="form-step feedback-details"
                  onSubmit={handleSubmitLibraryRequest}
                >
                  <h2>Library Book Request Details</h2>

                  <div className="form-group">
                    <label htmlFor="requestType">Request Type:</label>
                    <select
                      id="requestType"
                      value={requestType}
                      onChange={(e) => setRequestType(e.target.value)}
                      required
                    >
                      <option value="purchase">Purchase New Book</option>
                      <option value="subscription">
                        Magazine/Journal Subscription
                      </option>
                      <option value="digital">Digital Access Request</option>
                      <option value="extend">Extend Book Availability</option>
                      <option value="repair">Book Repair Request</option>
                      <option value="other">Other Request</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="bookTitle">Book Title: *</label>
                    <input
                      type="text"
                      id="bookTitle"
                      value={bookTitle}
                      onChange={(e) => setBookTitle(e.target.value)}
                      placeholder="Enter the complete book title"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="bookAuthor">Author(s):</label>
                    <input
                      type="text"
                      id="bookAuthor"
                      value={bookAuthor}
                      onChange={(e) => setBookAuthor(e.target.value)}
                      placeholder="Enter author name(s)"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="bookISBN">ISBN:</label>
                    <input
                      type="text"
                      id="bookISBN"
                      value={bookISBN}
                      onChange={(e) => setBookISBN(e.target.value)}
                      placeholder="Enter ISBN if available"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="bookPublisher">Publisher:</label>
                    <input
                      type="text"
                      id="bookPublisher"
                      value={bookPublisher}
                      onChange={(e) => setBookPublisher(e.target.value)}
                      placeholder="Enter publisher name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="bookYear">Publication Year:</label>
                    <input
                      type="number"
                      id="bookYear"
                      value={bookYear}
                      onChange={(e) => setBookYear(e.target.value)}
                      placeholder="e.g., 2023"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="priority">Priority Level:</label>
                    <select
                      id="priority"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      required
                    >
                      <option value="low">Low - General Interest</option>
                      <option value="medium">Medium - Course Related</option>
                      <option value="high">High - Essential for Studies</option>
                      <option value="urgent">
                        Urgent - Required Immediately
                      </option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="requestReason">Reason for Request: *</label>
                    <textarea
                      id="requestReason"
                      value={requestReason}
                      onChange={handleRequestReasonChange}
                      required
                      rows={4}
                      placeholder="Please explain why you need this book (e.g., for course work, research project, thesis, etc.)"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="additionalNotes">Additional Notes:</label>
                    <textarea
                      id="additionalNotes"
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      rows={3}
                      placeholder="Any additional information or special requirements"
                    />
                  </div>

                  <div className="feedback-summary">
                    <h3>Request Summary:</h3>
                    <p>
                      <strong>College:</strong> {collegeName || "Unknown"} (ID:{" "}
                      {collegeCode})
                    </p>
                    <p>
                      <strong>Requesting as:</strong>{" "}
                      {anonymous ? "Anonymous" : studentName}
                    </p>
                    <p>
                      <strong>Contact:</strong> {studentEmail} | Roll ID:{" "}
                      {studentRollId}
                    </p>
                    <p>
                      <strong>Book:</strong> {bookTitle || "Not specified"}
                      {bookAuthor && ` by ${bookAuthor}`}
                    </p>
                    <p>
                      <strong>Request Type:</strong> {requestType} |{" "}
                      <strong>Priority:</strong> {priority}
                    </p>
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => {
                        setStep(2);
                        scrollToTop();
                      }}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="primary-button"
                      disabled={
                        submitting ||
                        validatingContent ||
                        !bookTitle ||
                        !requestReason
                      }
                    >
                      {submitting ? (
                        <>
                          <span className="button-spinner"></span>
                          Submitting Request...
                        </>
                      ) : validatingContent ? (
                        <>
                          <span className="button-spinner"></span>
                          Validating Content...
                        </>
                      ) : (
                        "Submit Library Request"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </main>
      </main>
    </div>
  );
};

export default LibraryBookRequest;
