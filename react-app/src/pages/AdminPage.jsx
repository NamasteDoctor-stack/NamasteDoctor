import React, { useState, useEffect } from "react";
import "../mainstyle.css";
import { Link, useNavigate } from "react-router-dom";
import app from '../firebaseConfig';
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import emailjs from "@emailjs/browser";

const db = getFirestore(app);
const auth = getAuth(app);

const AdminPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    emailjs.init("xO-QOM1l2Vf1lQixD");
  }, []);

  const navigate = useNavigate();
  const handleSectionNav = (sectionId) => (e) => {
    e.preventDefault();
    if (window.location.pathname !== "/") {
      navigate("/", { state: { scrollTo: sectionId } });
    } else {
      const section = document.getElementById(sectionId);
      if (section) {
        const yOffset = -80; // Adjust to your navbar height
        const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  };

  const sendApprovalEmail = async (toEmail, fullName) => {
    try {
      await emailjs.send(
        "service_ytcipqf",
        "template_m5ldr1o",
        {
          user_name: fullName || "Doctor",
          user_email: toEmail
        }
      );
    } catch (err) {
      // Optionally handle error
    }
  };

  const loadPendingDoctors = async () => {
    setLoading(true);
    setError("");
    try {
      const snapshot = await getDocs(collection(db, "users"));
      const doctors = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.role === "doctor" && data.approved === false) {
          doctors.push({ ...data, id: docSnap.id });
        }
      });
      setPendingDoctors(doctors);
      setLoading(false);
    } catch (err) {
      setError("Error loading doctor list. Check console for details.");
      setLoading(false);
    }
  };

  const approveDoctor = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);
      const data = userDoc.data();
      if (!data) {
        alert("User data not found.");
        return;
      }
      await updateDoc(userRef, { approved: true });
      await sendApprovalEmail(data.email, data.fullName);
      alert("Doctor approved and email sent.");
      loadPendingDoctors();
    } catch (err) {
      alert("Error approving doctor: " + err.message);
    }
  };

  const rejectDoctor = async (uid) => {
    if (!window.confirm("Are you sure you want to reject and delete this request?")) return;
    try {
      await deleteDoc(doc(db, "users", uid));
      alert("Doctor request rejected and removed.");
      loadPendingDoctors();
    } catch (err) {
      alert("Error rejecting doctor: " + err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();
      if (!userData || userData.role !== "admin") {
        alert("Access denied. Only admins can access this page.");
        await signOut(auth);
        window.location.href = "/";
        return;
      }
      setIsLoggedIn(true);
      loadPendingDoctors();
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-container">
          <div className="logo">Namaste<span>Doctor</span></div>
          <nav>
            <ul className="nav-links" id="navLinks">
              <li><a href="#about-section" onClick={handleSectionNav('about-section')}>About</a></li>
              <li><a href="#posts-section" onClick={handleSectionNav('posts-section')}>Posts</a></li>
              <li><a href="#how-it-works" onClick={handleSectionNav('how-it-works')}>How It Works</a></li>
              <li><a href="#faq-section" onClick={handleSectionNav('faq-section')}>FAQ</a></li>
              <li><Link to="/chatbot">Chatbot</Link></li>
            </ul>
          </nav>
        </div>
      </header>
      {!isLoggedIn ? (
        <div className="auth-wrapper" id="adminLoginWrapper">
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin} id="adminLoginForm">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter admin email" required />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" required />
            <button type="submit" className="auth-btn">Login</button>
          </form>
          <div className="link-text">
            <p><Link to="/">Back to Home</Link></p>
          </div>
        </div>
      ) : (
        <div className="auth-wrapper" id="adminDashboard">
          <h2>Admin – Doctor Approvals</h2>
          <button className="auth-btn" onClick={loadPendingDoctors} style={{ marginBottom: "1rem" }}>Refresh Approvals</button>
          <div id="pending-list">
            {loading ? <p>Loading pending doctor requests...</p> : null}
            {error && <p>{error}</p>}
            {!loading && !error && pendingDoctors.length === 0 && <p>No pending doctor approvals.</p>}
            {!loading && !error && pendingDoctors.map(doc => (
              <div key={doc.id} className="pending-doctor" style={{ marginBottom: "1.5rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
                <p><strong>Full Name:</strong> {doc.fullName || "—"}</p>
                <p><strong>Email:</strong> {doc.email}</p>
                <p><strong>NMC Number:</strong> {doc.nmc || "Not Provided"}</p>
                <button className="auth-btn" onClick={() => approveDoctor(doc.id)}>Approve</button>
                <button className="auth-btn" style={{ backgroundColor: "#d9534f", marginLeft: "1rem" }} onClick={() => rejectDoctor(doc.id)}>Reject</button>
              </div>
            ))}
          </div>
        </div>
      )}
      <footer className="site-footer" style={{ background: "#f8f8f8", color: "#333", textAlign: "center", padding: "1.2rem 0", marginTop: "2rem", fontSize: "1rem", borderTop: "1px solid #eee" }}>
        <span>&copy; 2024 Namaste Doctor. All rights reserved. | <Link to="/privacy-policy" style={{ color: "#1976d2", textDecoration: "underline" }}>Privacy Policy</Link></span>
      </footer>
    </>
  );
};

export default AdminPage; 