import React from "react";
import "../mainstyle.css";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import { useEffect } from "react";

const ContactSuccessPage = () => {
  useEffect(() => {
    document.title = "Namaste Doctor - Message Sent";
  }, []);
  return (
  <>
    <Navbar />
    <div style={{ background: "#C2E1FC", minHeight: "100vh", margin: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem 1rem", marginTop: "80px" }}>
      <div className="success-container fade-in">
        <div className="success-title">Thank You!</div>
        <div className="success-message">Your Message has been delivered to NamasteDoctor Team.</div>
        <Link to="/" className="back-link">Back to Home</Link>
      </div>
      <footer className="site-footer">
        <span>&copy; 2024 Namaste Doctor. All rights reserved. | <Link to="/privacy-policy">Privacy Policy</Link></span>
      </footer>
    </div>
  </>
);
};

export default ContactSuccessPage; 