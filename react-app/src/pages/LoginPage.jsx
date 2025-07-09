import React, { useState } from "react";
import "../mainstyle.css";
import { Link, useNavigate } from "react-router-dom";
import app from "../firebaseConfig";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Navbar from "../Navbar";

const auth = getAuth(app);
const firestore = getFirestore(app);

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(firestore, "users", user.uid));
      const userData = userDoc.data();
      if (!userData || userData.role !== "doctor") {
        setLoading(false);
        alert("Access denied. Only approved doctors can login.");
        return;
      }
      if (!userData.approved) {
        setLoading(false);
        alert("Your doctor account is not yet approved.");
        return;
      }
      setLoading(false);
      navigate("/doctor-dashboard");
    } catch (error) {
      setLoading(false);
      alert("Login failed: " + error.message);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent.");
    } catch (err) {
      alert("Failed to send reset link: " + err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-wrapper">
        <h2>Doctor Login</h2>
        <form onSubmit={handleLogin} id="loginForm">
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="button" id="forgotPasswordLink" className="forgot-link" onClick={handleForgotPassword} style={{ background: 'none', border: 'none', color: '#1976d2', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}>
            Forgot password?
          </button>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <span className="loader" style={{ width: 24, height: 24, border: "3px solid #4285f4", borderTop: "3px solid transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }}></span> : "Login"}
          </button>
        </form>
        <div className="link-text">
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
          <p><Link to="/chatbot" style={{ color: "#FF4081" }}>Try our Sexual Health Chatbot</Link></p>
        </div>
      </div>
      {loading && (
        <div id="loadingOverlay" style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(255,255,255,0.7)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div className="loader" style={{ width: 40, height: 40, border: "4px solid #4285f4", borderTop: "4px solid transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></div>
        </div>
      )}
      <footer className="site-footer" style={{ background: "#f8f8f8", color: "#333", textAlign: "center", padding: "1.2rem 0", marginTop: "2rem", fontSize: "1rem", borderTop: "1px solid #eee" }}>
        <span>&copy; 2024 Namaste Doctor. All rights reserved. | <Link to="/privacy-policy" style={{ color: "#1976d2", textDecoration: "underline" }}>Privacy Policy</Link></span>
      </footer>
    </>
  );
};

export default LoginPage; 