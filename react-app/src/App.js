import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import ChatbotPage from "./pages/ChatbotPage";
import ContactPage from "./pages/ContactPage";
import ContactSuccessPage from "./pages/ContactSuccessPage";
import DoctorDashboardPage from "./pages/DoctorDashboardPage";
import LoginPage from "./pages/LoginPage";
import PatientDashboardPage from "./pages/PatientDashboardPage";
import PendingPage from "./pages/PendingPage";
import Post1Page from "./pages/Post1Page";
import Post2Page from "./pages/Post2Page";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import SignupPage from "./pages/SignupPage";
import Info from "./pages/Info";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/contact-success" element={<ContactSuccessPage />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/patient-dashboard" element={<PatientDashboardPage />} />
        <Route path="/pending" element={<PendingPage />} />
        <Route path="/post-1" element={<Post1Page />} />
        <Route path="/post-2" element={<Post2Page />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/info" element={<Info />} />
      </Routes>
    </Router>
  );
}

export default App;
