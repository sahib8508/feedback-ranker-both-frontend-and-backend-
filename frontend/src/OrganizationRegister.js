import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import "./OrganizationRegister.css";

const EnhancedOrganizationRegister = () => {
  const [formData, setFormData] = useState({
    collegeName: "",
    email: "",
    address: "",
    collegeCode: "",
    contactNumber: "",
    password: "",
    confirmPassword: "",
  });

  // Field-specific validation states
  const [fieldErrors, setFieldErrors] = useState({});
  const [fieldTouched, setFieldTouched] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const [verificationDoc, setVerificationDoc] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

  const navigate = useNavigate();

  // Enhanced validation rules
  const validationRules = {
    collegeName: {
      required: true,
      minLength: 3,
      maxLength: 100,
      pattern: /^[a-zA-Z0-9\s\-&'().]+$/,
      message:
        "College name must be 3-100 characters and contain only letters, numbers, spaces, and basic punctuation",
    },
    email: {
      required: true,
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      customValidation: (value) => {
        // Additional email validation
        const parts = value.split("@");
        if (parts.length !== 2) return "Invalid email format";

        const [localPart, domain] = parts;
        if (localPart.length > 64) return "Email local part too long";
        if (domain.length > 253) return "Email domain too long";

        // Check for consecutive dots
        if (value.includes(".."))
          return "Email cannot contain consecutive dots";

        // Check for valid domain
        const domainParts = domain.split(".");
        if (domainParts.some((part) => part.length === 0))
          return "Invalid domain format";

        // Educational email preference (warning, not error)
        const eduDomains = [".edu", ".ac.", ".edu."];
        const isEduEmail = eduDomains.some((edu) =>
          domain.toLowerCase().includes(edu)
        );
        if (
          !isEduEmail &&
          !value.toLowerCase().includes("college") &&
          !value.toLowerCase().includes("university")
        ) {
          return "warning:Consider using an official educational email address";
        }

        return null;
      },
      message: "Please enter a valid email address",
    },
    address: {
      required: true,
      minLength: 10,
      maxLength: 500,
      message: "Address must be between 10-500 characters",
    },
    collegeCode: {
      required: true,
      minLength: 2,
      maxLength: 20,
      pattern: /^[A-Z0-9\-]+$/,
      message:
        "College code must be 2-20 characters (uppercase letters, numbers, hyphens only)",
    },
    contactNumber: {
      required: true,
      pattern: /^(\+91|91)?[6-9]\d{9}$/,
      customValidation: (value) => {
        const cleaned = value.replace(/[\s\-\(\)]/g, "");
        if (cleaned.length < 10 || cleaned.length > 13) {
          return "Contact number must be 10-13 digits";
        }
        return null;
      },
      message: "Please enter a valid Indian mobile number",
    },
    password: {
      required: true,
      minLength: 8,
      maxLength: 128,
      customValidation: (value) => {
        const hasLower = /[a-z]/.test(value);
        const hasUpper = /[A-Z]/.test(value);
        const hasNumber = /\d/.test(value);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

        if (!hasLower) return "Password must contain lowercase letters";
        if (!hasUpper) return "Password must contain uppercase letters";
        if (!hasNumber) return "Password must contain numbers";
        if (!hasSpecial) return "Password must contain special characters";

        // Check for common patterns
        const commonPatterns = ["123456", "password", "qwerty", "abc123"];
        if (
          commonPatterns.some((pattern) =>
            value.toLowerCase().includes(pattern)
          )
        ) {
          return "Password contains common patterns";
        }

        return null;
      },
      message:
        "Password must be 8-128 characters with uppercase, lowercase, numbers, and special characters",
    },
    confirmPassword: {
      required: true,
      customValidation: (value, formData) => {
        if (value !== formData.password) {
          return "Passwords do not match";
        }
        return null;
      },
      message: "Please confirm your password",
    },
  };

  // Real-time field validation
  const validateField = (name, value, allFormData = formData) => {
    const rule = validationRules[name];
    if (!rule) return null;

    // Required check
    if (rule.required && (!value || value.trim() === "")) {
      return `${name.replace(/([A-Z])/g, " $1").toLowerCase()} is required`;
    }

    if (!value) return null; // Skip other validations if empty and not required

    // Length checks
    if (rule.minLength && value.length < rule.minLength) {
      return `Minimum ${rule.minLength} characters required`;
    }
    if (rule.maxLength && value.length > rule.maxLength) {
      return `Maximum ${rule.maxLength} characters allowed`;
    }

    // Pattern check
    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message;
    }

    // Custom validation
    if (rule.customValidation) {
      const customError = rule.customValidation(value, allFormData);
      if (customError) return customError;
    }

    return null;
  };

  // Validate entire form
 const validateForm = () => {
  const errors = {};
  let isValid = true;

  // Only validate fields that have been touched or have content
  Object.keys(formData).forEach(field => {
    if (fieldTouched[field] || formData[field]) {
      const error = validateField(field, formData[field], formData);
      if (error && !error.startsWith('warning:')) {
        errors[field] = error;
        isValid = false;
      }
    }
  });

  // File validations only if form has been interacted with
  if (Object.keys(fieldTouched).length > 0 || verificationDoc || studentData) {
    if (!verificationDoc) {
      errors.verificationDoc = 'Verification document is required';
      isValid = false;
    }
    if (!studentData) {
      errors.studentData = 'Student data file is required';
      isValid = false;
    }
  }

  setFieldErrors(errors);
  setIsFormValid(isValid);
  return isValid;
};

  // Handle input changes with real-time validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Sanitize input based on field type
    let sanitizedValue = value;

    if (name === "collegeCode") {
      sanitizedValue = value.toUpperCase().replace(/[^A-Z0-9\-]/g, "");
    } else if (name === "contactNumber") {
      sanitizedValue = value.replace(/[^0-9+\-\s\(\)]/g, "");
    } else if (name === "collegeName") {
      sanitizedValue = value.replace(/[^a-zA-Z0-9\s\-&'().]/g, "");
    }

    const newFormData = { ...formData, [name]: sanitizedValue };
    setFormData(newFormData);

    // Validate field if it has been touched or has content
    // Only validate field if it has been touched AND has content, or if it's been blurred
    if (fieldTouched[name] && sanitizedValue) {
      const error = validateField(name, sanitizedValue, newFormData);
      setFieldErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    } else if (fieldTouched[name] && !sanitizedValue) {
      // Clear error when field becomes empty after being touched
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle field blur (when user leaves field)
  const handleFieldBlur = (e) => {
    const { name, value } = e.target;

    setFieldTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, value, formData);
    setFieldErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // Enhanced file validation
  const validateFile = (file, fileType) => {
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file.size > maxSize) {
      return `File ${file.name} is too large. Maximum size is 5MB.`;
    }

    if (fileType === "verification") {
      const validTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];
      const validExtensions = ["pdf", "jpg", "jpeg", "png"];
      const fileExt = file.name.split(".").pop().toLowerCase();

      if (
        !validTypes.includes(file.type) ||
        !validExtensions.includes(fileExt)
      ) {
        return "Please upload a valid PDF or image (JPG, JPEG, PNG) file for verification.";
      }
    } else if (fileType === "studentData") {
      const validTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      const validExtensions = ["csv", "xls", "xlsx"];
      const fileExt = file.name.split(".").pop().toLowerCase();

      if (
        !validTypes.includes(file.type) ||
        !validExtensions.includes(fileExt)
      ) {
        return "Please upload a valid CSV or Excel file for student data.";
      }
    }

    return null;
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];

    if (!file) return;

    const validationError = validateFile(file, fileType);
    if (validationError) {
      setFieldErrors((prev) => ({
        ...prev,
        [fileType === "verification" ? "verificationDoc" : "studentData"]:
          validationError,
      }));
      e.target.value = null;
      return;
    }

    // Clear any previous errors for this file type
    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[
        fileType === "verification" ? "verificationDoc" : "studentData"
      ];
      return newErrors;
    });

    if (fileType === "verification") {
      setVerificationDoc(file);
    } else if (fileType === "studentData") {
      setStudentData(file);
    }
  };

  // Enhanced file upload with better error handling
  const uploadFileToStorage = async (file, uid, fileType) => {
    if (!file) return { url: "", path: "" };

    const storage = getStorage();
    const fileExtension = file.name.split(".").pop().toLowerCase();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);

    const storagePath = `${
      fileType === "verification" ? "verification_docs" : "student_data"
    }/${uid}_${timestamp}_${randomId}_${sanitizedFileName}`;

    const fileRef = ref(storage, storagePath);

    const metadata = {
      contentType: file.type,
      customMetadata: {
        uploadedBy: uid,
        originalName: file.name,
        uploadTimestamp: new Date().toISOString(),
      },
    };

    try {
      const uploadTask = uploadBytesResumable(fileRef, file, metadata);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`${fileType} upload progress: ${progress.toFixed(1)}%`);
          },
          (error) => {
            console.error(`${fileType} upload error:`, error);
            switch (error.code) {
              case "storage/unauthorized":
                reject(
                  new Error(
                    "Storage permission denied. Please contact support."
                  )
                );
                break;
              case "storage/canceled":
                reject(new Error("Upload was canceled"));
                break;
              case "storage/quota-exceeded":
                reject(
                  new Error("Storage quota exceeded. Please try again later.")
                );
                break;
              default:
                reject(new Error(`Upload failed: ${error.message}`));
            }
          },
          async () => {
            try {
              const downloadUrl = await getDownloadURL(fileRef);
              resolve({
                url: downloadUrl,
                path: storagePath,
                uploadedAt: new Date().toISOString(),
              });
            } catch (urlError) {
              console.error(
                `Error getting download URL for ${fileType}:`,
                urlError
              );
              reject(urlError);
            }
          }
        );
      });
    } catch (error) {
      console.error(`Error starting ${fileType} upload:`, error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Validate entire form
    if (!validateForm()) {
      setError("Please fix all errors before submitting");

      // Focus on first error field
      const firstErrorField = Object.keys(fieldErrors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        if (element) {
          element.focus();
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
      return;
    }

    setLoading(true);

    try {
      const auth = getAuth();
      const db = getFirestore();

      // Create user with email/password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const uid = userCredential.user.uid;

      // Upload files in parallel with progress tracking
      const [verificationDocResult, studentDataResult] = await Promise.all([
        uploadFileToStorage(verificationDoc, uid, "verification"),
        uploadFileToStorage(studentData, uid, "student"),
      ]);

      // Prepare college data with enhanced security
      const collegeData = {
        collegeName: formData.collegeName.trim(),
        email: formData.email.toLowerCase().trim(),
        address: formData.address.trim(),
        collegeCode: formData.collegeCode.toUpperCase().trim(),
        contactNumber: formData.contactNumber.replace(/[\s\-\(\)]/g, ""),
        verificationDocName: verificationDoc?.name || "",
        studentDataName: studentData?.name || "",
        verificationDocUrl: verificationDocResult.url,
        studentDataUrl: studentDataResult.url,
        verificationDocPath: verificationDocResult.path,
        studentDataPath: studentDataResult.path,
        verificationDocUploadedAt: verificationDocResult.uploadedAt,
        studentDataUploadedAt: studentDataResult.uploadedAt,
        submittedAt: new Date().toISOString(),
        status: "pending",
        ipAddress: "hidden_for_privacy", // Would need additional setup to get real IP
        userAgent: navigator.userAgent,
        submissionId: `ORG_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 8)
          .toUpperCase()}`,
      };

      // Add to pendingColleges collection
      await setDoc(doc(db, "pendingColleges", uid), collegeData);

      setSuccessMessage(
        "Your application has been submitted successfully and is under review. You will receive an email notification once it has been approved. This page will redirect to login in 5 seconds."
      );

      // Clear form
      setFormData({
        collegeName: "",
        email: "",
        address: "",
        collegeCode: "",
        contactNumber: "",
        password: "",
        confirmPassword: "",
      });

      setVerificationDoc(null);
      setStudentData(null);
      setFieldErrors({});
      setFieldTouched({});

      // Sign out the user until they're approved
      await auth.signOut();

      // Redirect after 5 seconds
      setTimeout(() => {
        navigate("/organization/login");
      }, 5000);
    } catch (err) {
      console.error("Registration error:", err);

      // Handle specific errors with user-friendly messages
      if (err.code === "auth/email-already-in-use") {
        setError(
          "This email is already registered. Please use a different email or try logging in."
        );
      } else if (err.code === "auth/weak-password") {
        setError(
          "Password is too weak. Please use a stronger password with uppercase, lowercase, numbers, and special characters."
        );
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email format. Please enter a valid email address.");
      } else if (err.code === "auth/operation-not-allowed") {
        setError(
          "Account registration is currently disabled. Please contact support."
        );
      } else if (err.message.includes("network")) {
        setError(
          "Network error. Please check your internet connection and try again."
        );
      } else {
        setError(
          `Registration failed: ${err.message}. Please try again or contact support if the problem persists.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Effect for handling notifications
  useEffect(() => {
    if (error) {
      setNotification({
        show: true,
        type: "error",
        message: error,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });

      const timer = setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
        setTimeout(() => setError(""), 300);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (successMessage) {
      setNotification({
        show: true,
        type: "success",
        message: successMessage,
      });
    }
  }, [successMessage]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    validateForm();
  }, [formData, verificationDoc, studentData]);
  const dismissNotification = () => {
    setNotification((prev) => ({ ...prev, show: false }));
    setTimeout(() => {
      setError("");
      setSuccessMessage("");
    }, 300);
  };

  const getFieldClassName = (fieldName) => {
    let className = "enh-form-input";

    // Only show error styling if field has been touched AND has an error
    if (fieldErrors[fieldName] && fieldTouched[fieldName]) {
      className += fieldErrors[fieldName].startsWith("warning:")
        ? " warning"
        : " error";
    } else if (
      fieldTouched[fieldName] &&
      formData[fieldName] &&
      !fieldErrors[fieldName]
    ) {
      className += " valid";
    }
    return className;
  };
 const checkFormValidity = () => {
  // Only check validity if user has actually interacted with the form
  if (Object.keys(fieldTouched).length === 0 && !verificationDoc && !studentData) {
    setIsFormValid(false);
    return;
  }

  const hasAllRequiredFields = Object.keys(formData).every(key => 
    formData[key] && formData[key].trim() !== ''
  );
  const hasFiles = verificationDoc && studentData;
  const hasNoBlockingErrors = Object.keys(fieldErrors).every(key => 
    !fieldErrors[key] || fieldErrors[key].startsWith('warning:')
  );
  const newIsValid = hasAllRequiredFields && hasFiles && hasNoBlockingErrors;
  
  if (newIsValid !== isFormValid) {
    setIsFormValid(newIsValid);
  }
};
  useEffect(() => {
    // Only check validity if user has started interacting with the form
    if (
      Object.keys(fieldTouched).length > 0 ||
      verificationDoc ||
      studentData
    ) {
      checkFormValidity();
    }
  }, [formData, verificationDoc, studentData, fieldErrors, fieldTouched]);

  return (
    <div className="enh-org-register-container">
      {/* Enhanced Notification System */}
      {notification.show && (
        <div
          className={`enh-notification ${notification.type} ${
            notification.show ? "show" : ""
          }`}
        >
          <div className="enh-notification-content">
            {notification.type === "success" ? (
              <svg viewBox="0 0 24 24" className="enh-notification-icon">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="enh-notification-icon">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" />
              </svg>
            )}
            <p>{notification.message.replace("warning:", "")}</p>
          </div>
          <button
            className="enh-notification-close"
            onClick={dismissNotification}
          >
            <svg viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
            </svg>
          </button>
        </div>
      )}

      <div className="enh-org-register-card">
        <div className="enh-org-register-header">
          <div className="enh-register-logo" onClick={() => navigate("/")}>
            <svg className="enh-campus-icon" viewBox="0 0 24 24">
              <path d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9ZM17 15.99L12 18.72L7 15.99V12.27L12 15L17 12.27V15.99Z" />
            </svg>
            <span>Feedback Ranker</span>
          </div>
          <h2>Organization Registration</h2>
          <p className="enh-register-subtitle">
            Join our platform to manage student feedback efficiently
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="enh-org-register-form"
          noValidate
        >
          {/* Basic Information Section */}
          <div className="enh-form-section">
            <h3>
              <svg viewBox="0 0 24 24" className="enh-section-icon">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L12 2L3 7V9C3 10.1 3.9 11 5 11V17C5 18.1 5.9 19 7 19H9C10.1 19 11 18.1 11 17V15H13V17C13 18.1 13.9 19 15 19H17C18.1 19 19 18.1 19 17V11C20.1 11 21 10.1 21 9Z" />
              </svg>
              Basic Information
            </h3>

            <div className="enh-form-group">
              <label htmlFor="collegeName" className="enh-form-label">
                College Name*
                <span className="enh-field-info">
                  Official name of your institution
                </span>
              </label>
              <div className="enh-input-container">
                <input
                  type="text"
                  id="collegeName"
                  name="collegeName"
                  value={formData.collegeName}
                  onChange={handleInputChange}
                  onBlur={handleFieldBlur}
                  className={getFieldClassName("collegeName")}
                  placeholder="Enter your college name"
                  maxLength="100"
                  required
                />
                {fieldErrors.collegeName && fieldTouched.collegeName && (
                  <div
                    className={`enh-field-error ${
                      fieldErrors.collegeName.startsWith("warning:")
                        ? "warning"
                        : ""
                    }`}
                  >
                    <svg viewBox="0 0 24 24" className="enh-error-icon">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" />
                    </svg>
                    {fieldErrors.collegeName.replace("warning:", "")}
                  </div>
                )}
              </div>
            </div>

            <div className="enh-form-group">
              <label htmlFor="email" className="enh-form-label">
                College HR Email Address*
                <span className="enh-field-info">
                  Official institutional email address
                </span>
              </label>
              <div className="enh-input-container">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleFieldBlur}
                  className={getFieldClassName("email")}
                  placeholder="hr@yourcollege.edu"
                  required
                />
                {fieldErrors.email && (
                  <div
                    className={`enh-field-error ${
                      fieldErrors.email.startsWith("warning:") ? "warning" : ""
                    }`}
                  >
                    <svg viewBox="0 0 24 24" className="enh-error-icon">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" />
                    </svg>
                    {fieldErrors.email.replace("warning:", "")}
                  </div>
                )}
              </div>
            </div>

            <div className="enh-form-group">
              <label htmlFor="address" className="enh-form-label">
                College Address*
                <span className="enh-field-info">Complete postal address</span>
              </label>
              <div className="enh-input-container">
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  onBlur={handleFieldBlur}
                  className={getFieldClassName("address")}
                  placeholder="Enter complete college address including city, state, and postal code"
                  rows="3"
                  maxLength="500"
                  required
                />
                {fieldErrors.address && (
                  <div className="enh-field-error">
                    <svg viewBox="0 0 24 24" className="enh-error-icon">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" />
                    </svg>
                    {fieldErrors.address}
                  </div>
                )}
              </div>
            </div>

            <div className="enh-form-row">
              <div className="enh-form-group">
                <label htmlFor="collegeCode" className="enh-form-label">
                  College Code*
                  <span className="enh-field-info">
                    Official institution code
                  </span>
                </label>
                <div className="enh-input-container">
                  <input
                    type="text"
                    id="collegeCode"
                    name="collegeCode"
                    value={formData.collegeCode}
                    onChange={handleInputChange}
                    onBlur={handleFieldBlur}
                    className={getFieldClassName("collegeCode")}
                    placeholder="ABC123"
                    maxLength="20"
                    required
                  />
                  {fieldErrors.collegeCode && (
                    <div className="enh-field-error">
                      <svg viewBox="0 0 24 24" className="enh-error-icon">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" />
                      </svg>
                      {fieldErrors.collegeCode}
                    </div>
                  )}
                </div>
              </div>

              <div className="enh-form-group">
                <label htmlFor="contactNumber" className="enh-form-label">
                  HR Contact Number*
                  <span className="enh-field-info">
                    Official contact number
                  </span>
                </label>
                <div className="enh-input-container">
                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    onBlur={handleFieldBlur}
                    className={getFieldClassName("contactNumber")}
                    placeholder="+91 9876543210"
                    maxLength="15"
                    required
                  />
                  {fieldErrors.contactNumber && (
                    <div className="enh-field-error">
                      <svg viewBox="0 0 24 24" className="enh-error-icon">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" />
                      </svg>
                      {fieldErrors.contactNumber}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="enh-form-section">
            <h3>
              <svg viewBox="0 0 24 24" className="enh-section-icon">
                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11C15.4,11 16,11.4 16,12V16C16,16.6 15.6,17 15,17H9C8.4,17 8,16.6 8,16V12C8,11.4 8.4,11 9,11V10C9,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.2,9.2 10.2,10V11H13.8V10C13.8,9.2 12.8,8.2 12,8.2Z" />
              </svg>
              Security & Authentication
            </h3>

            <div className="enh-form-row">
              <div className="enh-form-group">
                <label htmlFor="password" className="enh-form-label">
                  Password*
                  <span className="enh-field-info">
                    Must be strong and secure
                  </span>
                </label>
                <div className="enh-input-container">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={handleFieldBlur}
                    className={getFieldClassName("password")}
                    placeholder="Create a strong password"
                    maxLength="128"
                    required
                  />
                  {fieldErrors.password && (
                    <div className="enh-field-error">
                      <svg viewBox="0 0 24 24" className="enh-error-icon">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" />
                      </svg>
                      {fieldErrors.password}
                    </div>
                  )}
                  <div className="enh-password-requirements">
                    <div
                      className={`enh-req ${
                        /[a-z]/.test(formData.password) ? "met" : ""
                      }`}
                    >
                      <svg viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" />
                      </svg>
                      Lowercase letter
                    </div>
                    <div
                      className={`enh-req ${
                        /[A-Z]/.test(formData.password) ? "met" : ""
                      }`}
                    >
                      <svg viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" />
                      </svg>
                      Uppercase letter
                    </div>
                    <div
                      className={`enh-req ${
                        /\d/.test(formData.password) ? "met" : ""
                      }`}
                    >
                      <svg viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" />
                      </svg>
                      Number
                    </div>
                    <div
                      className={`enh-req ${
                        /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
                          ? "met"
                          : ""
                      }`}
                    >
                      <svg viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" />
                      </svg>
                      Special character
                    </div>
                    <div
                      className={`enh-req ${
                        formData.password.length >= 8 ? "met" : ""
                      }`}
                    >
                      <svg viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" />
                      </svg>
                      At least 8 characters
                    </div>
                  </div>
                </div>
              </div>

              <div className="enh-form-group">
                <label htmlFor="confirmPassword" className="enh-form-label">
                  Confirm Password*
                  <span className="enh-field-info">
                    Must match the password above
                  </span>
                </label>
                <div className="enh-input-container">
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onBlur={handleFieldBlur}
                    className={getFieldClassName("confirmPassword")}
                    placeholder="Confirm your password"
                    required
                  />
                  {fieldErrors.confirmPassword && (
                    <div className="enh-field-error">
                      <svg viewBox="0 0 24 24" className="enh-error-icon">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" />
                      </svg>
                      {fieldErrors.confirmPassword}
                    </div>
                  )}
                  {formData.confirmPassword &&
                    formData.password === formData.confirmPassword && (
                      <div className="enh-field-success">
                        <svg viewBox="0 0 24 24" className="enh-success-icon">
                          <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" />
                        </svg>
                        Passwords match
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Document Upload Section */}
          <div className="enh-form-section">
            <h3>
              <svg viewBox="0 0 24 24" className="enh-section-icon">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
              Document Upload
            </h3>

            <div className="enh-form-group">
              <label htmlFor="verificationDoc" className="enh-form-label">
                College Verification Document*
                <span className="enh-field-info">
                  Official college document (PDF, JPG, PNG - Max 5MB)
                </span>
              </label>
              <div className="enh-file-input-container">
                <input
                  type="file"
                  id="verificationDoc"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, "verification")}
                  className="enh-file-input"
                  required
                />
                <label htmlFor="verificationDoc" className="enh-file-label">
                  <svg viewBox="0 0 24 24" className="enh-upload-icon">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                  <span className="enh-file-text">
                    {verificationDoc
                      ? verificationDoc.name
                      : "Choose verification document"}
                  </span>
                  <span className="enh-file-browse">Browse Files</span>
                </label>
                {fieldErrors.verificationDoc && (
                  <div className="enh-field-error">
                    <svg viewBox="0 0 24 24" className="enh-error-icon">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" />
                    </svg>
                    {fieldErrors.verificationDoc}
                  </div>
                )}
                {verificationDoc && !fieldErrors.verificationDoc && (
                  <div className="enh-file-success">
                    <svg viewBox="0 0 24 24" className="enh-success-icon">
                      <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" />
                    </svg>
                    File uploaded successfully
                  </div>
                )}
              </div>
            </div>

            <div className="enh-form-group">
              <label htmlFor="studentData" className="enh-form-label">
                Student Authentication Data*
                <span className="enh-field-info">
                  CSV/Excel file with student details (Max 5MB)
                </span>
              </label>
              <div className="enh-file-input-container">
                <input
                  type="file"
                  id="studentData"
                  accept=".csv,.xlsx,.xls"
                  onChange={(e) => handleFileChange(e, "studentData")}
                  className="enh-file-input"
                  required
                />
                <label htmlFor="studentData" className="enh-file-label">
                  <svg viewBox="0 0 24 24" className="enh-upload-icon">
                    <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18H16.5A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13H7.5Z" />
                  </svg>
                  <span className="enh-file-text">
                    {studentData
                      ? studentData.name
                      : "Choose student data file"}
                  </span>
                  <span className="enh-file-browse">Browse Files</span>
                </label>
                {fieldErrors.studentData && (
                  <div className="enh-field-error">
                    <svg viewBox="0 0 24 24" className="enh-error-icon">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" />
                    </svg>
                    {fieldErrors.studentData}
                  </div>
                )}
                {studentData && !fieldErrors.studentData && (
                  <div className="enh-file-success">
                    <svg viewBox="0 0 24 24" className="enh-success-icon">
                      <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" />
                    </svg>
                    File uploaded successfully
                  </div>
                )}
              </div>
              <div className="enh-file-requirements">
                <h4>Required CSV Columns:</h4>
                <div className="enh-csv-columns">
                  <span>Name</span>
                  <span>Roll No</span>
                  <span>College ID</span>
                  <span>Father's Name</span>
                  <span>Mother's Name</span>
                  <span>Mobile</span>
                  <span>Email</span>
                  <span>DOB</span>
                  <span>Gender</span>
                  <span>Course</span>
                  <span>Branch</span>
                  <span>Year</span>
                  <span>Semester</span>
                  <span>Address</span>
                  <span>City</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="enh-form-actions">
            <div className="enh-form-summary">
              <div className="enh-progress-indicator">
                <div className="enh-progress-bar">
                  <div
                    className="enh-progress-fill"
                    style={{
                      width: `${(() => {
                        const totalFields = Object.keys(formData).length + 2; // +2 for file uploads
                        const filledFields =
                          Object.keys(fieldTouched).length +
                          (verificationDoc ? 1 : 0) +
                          (studentData ? 1 : 0);
                        return Math.round((filledFields / totalFields) * 100);
                      })()}%`,
                    }}
                  ></div>
                </div>
                <span className="enh-progress-text">
                  Form Progress:{" "}
                  {(() => {
                    const totalFields = Object.keys(formData).length + 2;
                    const filledFields =
                      Object.keys(fieldTouched).length +
                      (verificationDoc ? 1 : 0) +
                      (studentData ? 1 : 0);
                    return Math.round((filledFields / totalFields) * 100);
                  })()}
                  %
                </span>
              </div>
            </div>

            <button
              type="submit"
              className={`enh-submit-btn ${isFormValid ? "valid" : "invalid"} ${
                loading ? "loading" : ""
              }`}
              disabled={loading || !isFormValid}
            >
              {loading ? (
                <>
                  <div className="enh-button-spinner"></div>
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" className="enh-submit-icon">
                    <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" />
                  </svg>
                  <span>Submit Registration</span>
                </>
              )}
            </button>

            <div className="enh-auth-links">
              <p>
                Already have an account?{" "}
                <Link to="/organization/login" className="enh-auth-link">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>

      <div className="enh-org-register-footer">
        <div className="enh-footer-content">
          <p>
            © {new Date().getFullYear()} Feedback Ranker - Empowering
            Educational Excellence
          </p>
          <div className="enh-footer-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-of-service">Terms of Service</Link>
            <Link to="/support">Support</Link>
            <Link to="/about">About Us</Link>
          </div>
        </div>
      </div>
      <div className="org-login-footer">
        <p>
          © {new Date().getFullYear()} Feedback Ranker - All Rights Reserved
        </p>
        <div className="footer-links">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-of-service">Terms of Service</Link>
          <Link to="/contact-us">Contact Us</Link>
        </div>
      </div>
    </div>
  );
};

export default EnhancedOrganizationRegister;
