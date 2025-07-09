import React from "react";
import "../mainstyle.css";
import { Link } from "react-router-dom";

const PendingPage = () => (
  <>
    <header className="navbar">
      <div className="navbar-container">
        <div className="logo">Namaste<span>Doctor</span></div>
        <nav>
          <ul className="nav-links" id="navLinks">
            <li><a href="/#about-section">About</a></li>
            <li><a href="/#posts-section">Posts</a></li>
            <li><a href="/#how-it-works">How It Works</a></li>
            <li><a href="/#faq-section">FAQ</a></li>
            <li><Link to="/chatbot">Chatbot</Link></li>
          </ul>
        </nav>
      </div>
    </header>
    <div className="auth-wrapper">
      <h2>Pending Approval</h2>
      <p>Your request to join as a doctor has been received.</p>
      <p>Our admin team will review your application. If approved, you'll receive an email with access instructions.</p>
      <Link to="/" className="auth-btn" style={{ textAlign: "center", display: "block" }}>Return Home</Link>
    </div>
    <footer className="site-footer" style={{ background: "#f8f8f8", color: "#333", textAlign: "center", padding: "1.2rem 0", marginTop: "2rem", fontSize: "1rem", borderTop: "1px solid #eee" }}>
      <span>&copy; 2024 Namaste Doctor. All rights reserved. | <Link to="/privacy-policy" style={{ color: "#1976d2", textDecoration: "underline" }}>Privacy Policy</Link></span>
    </footer>
  </>
);

export default PendingPage; 