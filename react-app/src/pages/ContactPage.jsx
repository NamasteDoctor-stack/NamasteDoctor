import React, { useState, useEffect } from "react";
import "../mainstyle.css";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Namaste Doctor - Contact";
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "7e9b94d7-b439-4975-a0dd-c444d00667c1",
          name: form.name,
          email: form.email,
          message: form.message,
          botcheck: "",
          redirect: ""
        })
      });
      if (res.ok) {
        setLoading(false);
        navigate("/contact-success");
      } else {
        setError("Failed to send message. Please try again later.");
        setLoading(false);
      }
    } catch (err) {
      setError("Failed to send message. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      
      <main style={{ background: "#C2E1FC", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem 1rem", marginTop: "80px" }}>
        <div className="contact-container fade-in">
          <div className="contact-title">Contact Us</div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <input 
              type="text" 
              name="name" 
              placeholder="Your Name" 
              value={form.name} 
              onChange={handleChange} 
              required 
            />
            <input 
              type="email" 
              name="email" 
              placeholder="Your Email" 
              value={form.email} 
              onChange={handleChange} 
              required 
            />
            <textarea 
              name="message" 
              placeholder="Your Message" 
              value={form.message} 
              onChange={handleChange} 
              required 
            />
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
          {error && <div className="contact-error">{error}</div>}
        </div>
      </main>
      
      <footer className="site-footer">
        <span>&copy; 2024 Namaste Doctor. All rights reserved. | <Link to="/privacy-policy">Privacy Policy</Link></span>
      </footer>
    </>
  );
};

export default ContactPage; 