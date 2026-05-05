import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "./OrganizationLogin.css";
import { collection, query, where, getDocs } from "firebase/firestore";

const OrganizationLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (error) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [error]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const db = getFirestore();

      // FIRST: Check database collections before attempting Firebase auth
      // Check if email exists in approved colleges FIRST
      const collegesRef = collection(db, "colleges");
      const collegeQuery = query(collegesRef, where("email", "==", email));
      const collegeSnapshot = await getDocs(collegeQuery);

      if (!collegeSnapshot.empty) {
        // College is approved, proceed with Firebase auth
        const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const collegeDoc = collegeSnapshot.docs[0];
        const collegeData = collegeDoc.data();

        const collegeInfo = {
          id: collegeDoc.id,
          name: collegeData.collegeName || collegeData.name,
          collegeName: collegeData.collegeName || collegeData.name,
          email: collegeData.email,
          collegeCode: collegeData.collegeCode,
          address: collegeData.address,
          contactNumber: collegeData.contactNumber,
          status: collegeData.status,
          uniqueId: collegeData.uniqueId,
        };

        if (!collegeInfo.collegeCode) {
          setError(
            "College configuration error. Please contact administration."
          );
          await getAuth().signOut();
          return;
        }

        localStorage.setItem("collegeData", JSON.stringify(collegeInfo));
        navigate("/college-dashboard");
        return;
      }

      // SECOND: If not in approved colleges, check if in pending
      const pendingRef = collection(db, "pendingColleges");
      const pendingQuery = query(pendingRef, where("email", "==", email));
      const pendingSnapshot = await getDocs(pendingQuery);

      if (!pendingSnapshot.empty) {
        setError(
          "Your college registration is still pending approval. Please wait for admin confirmation."
        );
        return;
      }

      // THIRD: Email not found in either collection
      setError("College not found. Please register first.");
      return;
    } catch (err) {
      console.error("Login error:", err);

      // More specific error handling for Firebase auth errors
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential"
      ) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="org-login-container">
      <div className="org-login-card">
        <div className="org-login-header">
          <div className="org-login-logo" onClick={() => navigate("/")}>
            <svg
              className="campus-icon"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9ZM17 15.99L12 18.72L7 15.99V12.27L12 15L17 12.27V15.99Z" />
            </svg>
            <span>Feedback Ranker</span>
          </div>
          <h2>Organization Login</h2>
        </div>

        <form onSubmit={handleSubmit} className="org-login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">College HR Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your college email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="auth-links">
            <p>
              Don't have an account?{" "}
              <Link to="/organization/register">Register</Link>
            </p>
            <p>
              <Link to="/forgot-password">Forgot Password?</Link>
            </p>
          </div>
        </form>
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

export default OrganizationLogin;
