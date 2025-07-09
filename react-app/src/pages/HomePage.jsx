import React from "react";
import Navbar from "../Navbar";
import "../mainstyle.css";
import { Link, useLocation } from "react-router-dom";
import imgHero from '../Images/8B973CDC-B9A5-4B4E-BDB6-48263EA71907-Photoroom.png';
import imgCramp1 from '../Images/cramp1.webp';
import imgMasturbation from '../Images/MASTURBATION.png';
import imgDoctor1 from '../Images/Doctor-1.png';
import imgDoctor2 from '../Images/Doctor-2.png';
import imgHow from '../Images/how.png';
import { useEffect } from "react";

const HomePage = () => {
  const location = useLocation();
  useEffect(() => {
    document.title = "Namaste Doctor - Home";
    if (location.state?.scrollTo) {
      const section = document.getElementById(location.state.scrollTo);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <>
      <Navbar />

      <section className="hero">
        <div className="hero-image fade-in">
          <img src={imgHero} alt="HelloDoctor Doctors" />
        </div>
        <div className="hero-text fade-in">
          <h1>Consult Verified Doctors<br /> Anytime, Anywhere</h1>
          <p>Your health, our priority! Get answers from certified professionals.</p>
          <div className="hero-buttons">
            <Link to="/patient-dashboard" className="btn primary-btn">Ask a Doctor Now</Link>
            <Link to="/chatbot" className="btn primary-btn"><i className="fas fa-robot" style={{ marginRight: "0.4em" }}></i>Chat with AI</Link>
          </div>
        </div>
      </section>

      <section className="offers-container fade-in">
        <h2 className="section-title">What We Offer</h2>
        <section className="features">
          <div className="feature fade-in">
            <h3>🔒 Anonymous & Secure</h3>
            <p>Private consultations that keep your identity safe and secure with end-to-end encryption.</p>
          </div>
          <div className="feature fade-in">
            <h3>🩺 Verified Doctors</h3>
            <p>Consult qualified professionals and top medical students, all thoroughly verified.</p>
          </div>
          <div className="feature fade-in">
            <h3>🌐 Multi-Language Support</h3>
            <p>Available in English and Nepali to reach as many people as possible.</p>
          </div>
          <div className="feature fade-in">
            <h3>🤖 Advanced Chatbot</h3>
            <p>Your intelligent sexual health assistant, ready to provide reliable information and support.</p>
          </div>
        </section>
      </section>

      {/* About Section */}
      <section id="about-section" className="section-container fade-in">
        <h2 className="section-title">About NamasteDoctor</h2>
        <p className="about-description">
          Namaste Doctor is a youth-led initiative founded by an adolescent, with a vision to empower fellow adolescents by addressing a critical yet often overlooked aspect of their well-being—sexual and reproductive health. In Nepal, cultural taboos and social stigma frequently create barriers to open discussion on these topics, leading many young people to rely on misinformation or unsafe practices.
          <br /><br />
          At Namaste Doctor, we believe that sexuality is a natural and essential part of human life. Treating it as a taboo only deepens the cycle of ignorance and poor health outcomes. To break this silence, our platform was established with the guidance and support of licensed medical professionals in Nepal.
          <br /><br />
          We offer a safe, confidential, and judgment-free space where adolescents can directly consult qualified, verified doctors. All consultations are conducted with the utmost discretion, and users have the option to communicate in either English or Nepali, based on their comfort. Even while remaining anonymous, users can trust the credentials, integrity, and dedication of the healthcare professionals they interact with.
          <br /><br />
          Namaste Doctor is committed to providing accurate, evidence-based information and fostering an environment of trust and empowerment. Our goal is to help young people make informed decisions and take control of their sexual and reproductive health with confidence and clarity.
          <br /><br />
          Take the first step—because your health, dignity, and knowledge matter.
        </p>
      </section>

      {/* Our Posts Section */}
      <section id="posts-section" className="section-container fade-in">
        <h2 className="section-title">Our Latest Posts</h2>
        <div className="posts-grid">
          <Link to="/post-1" className="post-card">
            <img src={imgCramp1} alt="Post 1" />
            <h4>Period Cramps</h4>
            <p>Understanding Period Cramps: Why They Happen and How to Feel Better</p>
          </Link>
          <Link to="/post-2" className="post-card">
            <img src={imgMasturbation} alt="Post 2" />
            <h4>Masturbation</h4>
            <p>Understanding Masturbation: What's Normal, Common Myths, and When to Seek Help</p>
          </Link>
        </div>
      </section>

      <section className="doctors-container section-container fade-in">
        <h2 className="section-title">Meet Our Doctors</h2>
        <div className="doctors-card">
          <div className="doctors-grid">
            <div className="doctor-card fade-in">
              <img src={imgDoctor1} alt="Doctor 1" />
              <h3>Dr. Sagar Panthi</h3>
              <p>MBBS</p>
              <p>BPKHS</p>
            </div>
            <div className="doctor-card fade-in">
              <img src={imgDoctor2} alt="Doctor 2" />
              <h3>Dr. Rochana Acharya</h3>
              <p>MBBS</p>
              <p>BPKHS</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="section-container fade-in">
        <h2 className="section-title">How It Works</h2>
        <div className="how-it-works-content">
          <div className="how-image">
            <img src={imgHow} alt="How it Works" />
          </div>
          <div className="how-text">
            <h3>Submit Your Question – No Sign-Up Required</h3>
            <p>Simply submit your query, and verified medical professionals will provide answers. For instant responses, our advanced chatbot is available to assist you promptly.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq-section" className="section-container fade-in">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-card">
            <h4>How do I consult a doctor?</h4>
            <p>Submit your question directly and receive a quick response from a verified doctor, no sign up or plans required.</p>
          </div>
          <div className="faq-card">
            <h4>Are my consultations private?</h4>
            <p>Yes, we ensure end-to-end encryption for secure and confidential conversations.</p>
          </div>
          <div className="faq-card">
            <h4>Do you provide prescriptions?</h4>
            <p>Yes, verified doctors can provide e-prescriptions when applicable.</p>
          </div>
        </div>
      </section>

      <footer className="site-footer" style={{ background: "#f8f8f8", color: "#333", textAlign: "center", padding: "1.2rem 0", marginTop: "2rem", fontSize: "1rem", borderTop: "1px solid #eee" }}>
        <span>&copy; 2024 Namaste Doctor. All rights reserved. | <Link to="/privacy-policy" style={{ color: "#1976d2", textDecoration: "underline" }}>Privacy Policy</Link></span>
      </footer>
    </>
  );
};

export default HomePage; 