// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainFormPage from "./MainFormPage";

import PrivacyPolicy from "./PrivacyPolicy";
import TermsOfService from "./TermsOfService";
import ContactUs from "./ContactUs";
import { DarkModeProvider } from "./DarkModeContext";
import LandingPage from "./LandingPage";
import OrganizationRegister from "./OrganizationRegister";
import OrganizationLogin from "./OrganizationLogin";
import SuperAdminPanel from "./SuperAdminPanel";
import CollegeDashboard from "./CollegeDashboard";
import StudentOptions from "./StudentOptions";
import ReviewColleges from "./ReviewColleges";
import StudentFeedbackSubmission from "./StudentFeedbackSubmission";
import CollegeResources from "./CollegeResources.js"; // Adjust path as needed
import LibraryBookRequest from './LibraryBookRequest';
import UnderConstruction from './UnderConstruction.js'
function App() {
  return (
    <DarkModeProvider>
      <Router>
        <Routes>
          {/* New Landing Page Route */}
          <Route path="/" element={<LandingPage />} />

          {/* Organization Routes */}
          <Route path="/organization/login" element={<OrganizationLogin />} />
          <Route
            path="/organization/register"
            element={<OrganizationRegister />}
          />

          {/* Super Admin Route */}
          <Route path="/admin" element={<SuperAdminPanel />} />

          {/* College Dashboard Route - Main Combined Dashboard */}
          <Route path="/college-dashboard" element={<CollegeDashboard />} />

          {/* Student Routes */}
          <Route path="/student" element={<StudentOptions />} />
          <Route path="/student/review" element={<ReviewColleges />} />
          <Route
            path="/student/feedback"
            element={<StudentFeedbackSubmission />}
          />
          <Route path="/student/resources" element={<CollegeResources />} />
          {/* Your Existing Routes - Main form now moved to /support path */}
          <Route path="/support" element={<MainFormPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/contact-us" element={<ContactUs />} />

          {/* Keep these routes for backward compatibility and direct access */}
        <Route path="/under-construction" element={<UnderConstruction />} />

          <Route path="/student/library-request" element={<LibraryBookRequest />} />
        </Routes>
      </Router>
    </DarkModeProvider>
  );
}

export default App;
