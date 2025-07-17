import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../mainstyle.css";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import app from "../firebaseConfig";
import Navbar from "../Navbar";

const auth = getAuth(app);
const db = getFirestore(app);

const SignupPage = () => {
  const [fullName, setFullName] = useState("");
  const [nmcNumber, setNmcNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [certificatePreview, setCertificatePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Show image preview
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      setPhotoPreview(null);
    }
  };

  // Show certificate preview
  const handleCertificateChange = (e) => {
    const file = e.target.files[0];
    setCertificate(file);
    if (file) {
      setCertificatePreview(URL.createObjectURL(file));
    } else {
      setCertificatePreview(null);
    }
  };

  // Upload to ImageBB
  async function uploadToImageBB(imageFile) {
    const apiKey = "52f2894f6129f25dc68325351dc986db"; // Replace with your real key
    const formData = new FormData();
    formData.append("image", imageFile);
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData
    });
    const data = await response.json();
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error("Image upload failed");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!photo) {
      alert("Please upload a profile photo.");
      setLoading(false);
      return;
    }
    if (!nmcNumber && !certificate) {
      alert("Please provide either your NMC Number or upload your Equivalent Certificate.");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      setLoading(false);
      return;
    }
    try {
      const imageUrl = await uploadToImageBB(photo);
      const certificateUrl = await uploadToImageBB(certificate);
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;
      await setDoc(doc(db, "users", user.uid), {
        fullName,
        nmc: nmcNumber,
        email,
        photo: imageUrl,
        certificate: certificateUrl,
        role: "doctor",
        approved: false
      });
      navigate("/pending");
    } catch (error) {
      alert("Signup failed: " + error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-wrapper">
        <h2>Doctor Signup</h2>
        <form id="signupForm" onSubmit={handleSubmit}>
          <input type="text" id="fullName" placeholder="Enter your Full Name" value={fullName} onChange={e => setFullName(e.target.value)} required />
          <input type="text" id="nmcNumber" placeholder="Enter your NMC Number" value={nmcNumber} onChange={e => setNmcNumber(e.target.value)} />
          <input type="email" id="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" id="password" placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} required />
          <input type="password" id="confirmPassword" placeholder="Confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />

          <label className="upload-label">Upload Profile Photo</label>
          <input type="file" id="photo" accept="image/*" onChange={handlePhotoChange} required />
          {photoPreview && <img className="preview-img" src={photoPreview} alt="Profile preview" style={{ display: "block" }} />}

          <label className="upload-label">Upload Equivalent Certificate</label>
          <input type="file" id="certificate" accept="image/*" onChange={handleCertificateChange} />
          {certificatePreview && <img className="preview-img" src={certificatePreview} alt="Certificate preview" style={{ display: "block" }} />}

          <button type="submit" className={`auth-btn${loading ? " loading" : ""}`} id="submitBtn" disabled={loading}>
            <div className="spinner" style={{ display: loading ? "block" : "none" }}></div>
            <span style={{ opacity: loading ? 0 : 1, visibility: loading ? "hidden" : "visible" }}>Sign Up</span>
          </button>
        </form>
        <div className="link-text">
          <p>Already have an account? <Link to="/login">Login</Link></p>
          <p><Link to="/chatbot" style={{ color: "#FF4081" }}>Try our Sexual Health Chatbot</Link></p>
        </div>
      </div>
      <footer className="site-footer" style={{ background: "#f8f8f8", color: "#333", textAlign: "center", padding: "1.2rem 0", marginTop: "2rem", fontSize: "1rem", borderTop: "1px solid #eee" }}>
        <span>&copy; 2024 Namaste Doctor. All rights reserved. | <Link to="/privacy-policy" style={{ color: "#1976d2", textDecoration: "underline" }}>Privacy Policy</Link></span>
      </footer>
      <style>{`
        .preview-img {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 50%;
          margin: 10px auto;
          display: block;
        }
        .upload-label {
          font-size: 0.9rem;
          color: #333;
          margin-top: 0.5rem;
        }
        .spinner {
          display: none;
          width: 18px;
          height: 18px;
          border: 3px solid rgba(255,255,255,0.4);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .auth-btn {
          position: relative;
          transition: all 0.3s ease;
        }
        .auth-btn.loading span {
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.2s ease;
        }
        .auth-btn.loading .spinner {
          display: block;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      `}</style>
    </>
  );
};

export default SignupPage; 
