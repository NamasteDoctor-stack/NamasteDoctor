import React, { useEffect } from "react";
import Navbar from "../Navbar";
import "../mainstyle.css";
import { Link, useLocation } from "react-router-dom";
import imgHero from '../Images/8B973CDC-B9A5-4B4E-BDB6-48263EA71907-Photoroom.png';
import imgCramp1 from '../Images/cramp1.webp';
import imgMasturbation from '../Images/MASTURBATION.png';
import imgDoctor1 from '../Images/Doctor-1.png';
import imgDoctor2 from '../Images/Doctor-2.png';
import imgHow from '../Images/how.png';

const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = "Namaste Doctor - Learn About Your Body";
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

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-image fade-in">
          <img src={imgHero} alt="Namaste Doctor Hero" />
        </div>
        <div className="hero-text fade-in">
          <h1>Understanding Your Body<br /> Starts with the Right Questions</h1>
          <p>Namaste Doctor is a safe, anonymous platform where adolescents can learn about sexual and reproductive health through verified, easy-to-understand information.</p>
          <div className="hero-buttons">
            <Link to="/chatbot" className="btn primary-btn">
              <i className="fas fa-robot" style={{ marginRight: "0.4em" }}></i>Ask Our AI
            </Link>
            <Link to="/patient-dashboard" className="btn primary-btn">
              <i className="fas fa-user-md" style={{ marginRight: "0.4em" }}></i>Ask a Doctor
            </Link>
          </div>
          <p style={{ fontSize: "0.9rem", marginTop: "0.7rem", color: "#555" }}>
            Both options are private, anonymous, and educational only. No prescriptions, no consultations.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="offers-container fade-in">
        <h2 className="section-title">Why Namaste Doctor?</h2>
        <section className="features">
          <div className="feature fade-in">
            <h3>🛡️ Anonymous & Non-Judgmental</h3>
            <p>No logins, no identity tracking—just honest answers to your most personal questions.</p>
          </div>
          <div className="feature fade-in">
            <h3>🧠 Science-Backed Education</h3>
            <p>Our content is reviewed by certified doctors and crafted to be accurate, inclusive, and youth-friendly.</p>
          </div>
          <div className="feature fade-in">
            <h3>🗣️ In Your Language</h3>
            <p>Available in both English and Nepali to ensure comfort and clarity for everyone.</p>
          </div>
          <div className="feature fade-in">
            <h3>💬 AI Learning Companion</h3>
            <p>Ask questions any time. Our AI assistant gives you medically-reviewed information in an accessible way—no prescriptions or diagnoses, just education.</p>
          </div>
        </section>
      </section>

      {/* About Section */}
      <section id="about-section" className="section-container fade-in">
  <h2 className="section-title">Our Mission</h2>
  <p className="about-description">
    <strong>Namaste Doctor</strong> is a youth-led, non-profit platform developed by an adolescent — for adolescents. It was created with the goal of breaking the silence, stigma, and confusion surrounding sexual and reproductive health topics among young people in Nepal and beyond.
    <br /><br />
    In many communities, natural experiences like puberty, menstruation, masturbation, and wet dreams are often considered taboo and left unspoken. This lack of open, accurate information can lead to fear, shame, and harmful misconceptions.
    <br /><br />
    Namaste Doctor exists to change that. We provide a safe, anonymous space where adolescents can ask honest questions and receive clear, respectful, and medically accurate answers. Our platform is strictly educational — we do not offer consultations, diagnoses, or prescriptions of any kind.
    <br /><br />
    Every answer is written or verified by qualified medical students and doctors to ensure scientific accuracy and age-appropriate guidance. Our aim is to empower young people to understand their bodies, make informed choices, and grow up with confidence and dignity.
  </p>
</section>


      {/* Articles Section */}
      <section id="posts-section" className="section-container fade-in">
        <h2 className="section-title">Explore Educational Topics</h2>
        <div className="posts-grid">
          <Link to="/post-1" className="post-card">
            <img src={imgCramp1} alt="Period Cramps" />
            <h4>Understanding Period Cramps</h4>
            <p>Why they happen, what’s normal, and how to manage them safely—without panic or shame.</p>
          </Link>
          <Link to="/post-2" className="post-card">
            <img src={imgMasturbation} alt="Masturbation Myths" />
            <h4>Masturbation & Guilt</h4>
            <p>Is it harmful? Is it okay? Let’s break the myths and look at what science says.</p>
          </Link>
        </div>
      </section>

      {/* Medical Review Section */}
      <section className="doctors-container section-container fade-in">
        <h2 className="section-title">Verified by Professionals</h2>
        <div className="doctors-card">
          <div className="doctors-grid">
            <div className="doctor-card fade-in">
              <img src={imgDoctor1} alt="Dr. Sagar Panthi" />
              <h3>Dr. Sagar Panthi</h3>
              <p>MBBS, BPKHS</p>
              <p>Medical Content Reviewer</p>
            </div>
            <div className="doctor-card fade-in">
              <img src={imgDoctor2} alt="Dr. Rochana Acharya" />
              <h3>Dr. Rochana Acharya</h3>
              <p>MBBS, BPKHS</p>
              <p>Medical Content Reviewer</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section-container fade-in">
        <h2 className="section-title">How It Works</h2>
        <div className="how-it-works-content">
          <div className="how-image">
            <img src={imgHow} alt="How Namaste Doctor Works" />
          </div>
          <div className="how-text">
            <h3>No Appointments. No Judgment. Just Answers.</h3>
            <p>Just visit the chatbot and type your question. It could be about periods, erections, acne, discharge—anything you're confused or anxious about. Our AI will reply with accurate info reviewed by doctors. It's fast, free, and anonymous.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq-section" className="section-container fade-in">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-card">
            <h4>Is Namaste Doctor a medical service?</h4>
            <p>No. We don’t diagnose or prescribe. We focus on education, awareness, and prevention.</p>
          </div>
          <div className="faq-card">
            <h4>Is my identity safe?</h4>
            <p>Yes. You can ask anything anonymously. We don’t store names, emails, or any identifying data.</p>
          </div>
          <div className="faq-card">
            <h4>Can I trust the information?</h4>
            <p>Absolutely. Our team of licensed doctors reviews the answers and content regularly to ensure accuracy.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer" style={{ background: "#f8f8f8", color: "#333", textAlign: "center", padding: "1.2rem 0", marginTop: "2rem", fontSize: "1rem", borderTop: "1px solid #eee" }}>
        <span>&copy; 2024 Namaste Doctor. All rights reserved. | <Link to="/privacy-policy" style={{ color: "#1976d2", textDecoration: "underline" }}>Privacy Policy</Link></span>
      </footer>
    </>
  );
};

export default HomePage;
