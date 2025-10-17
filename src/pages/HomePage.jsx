import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
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
    if (location.state?.scrollTo) {
      const section = document.getElementById(location.state.scrollTo);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Namaste Doctor",
    "description": "A safe, anonymous platform where adolescents can learn about sexual and reproductive health through verified, easy-to-understand information.",
    "publisher": {
      "@type": "Organization",
      "name": "Namaste Doctor"
    }
  };

  return (
    <>
      <Helmet>
        <title>Namaste Doctor - Learn About Your Body</title>
        <meta name="description" content="Namaste Doctor is a safe, anonymous platform where adolescents can learn about sexual and reproductive health through verified, easy-to-understand information." />
        <meta name="keywords" content="sexual health education, reproductive health, adolescent health, puberty education, menstruation, anonymous health questions, Nepal health education" />
        <link rel="canonical" href={window.location.href} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Namaste Doctor - Learn About Your Body" />
        <meta property="og:description" content="A safe, anonymous platform where adolescents can learn about sexual and reproductive health through verified information." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>

      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-image fade-in">
          <img 
            src={imgHero} 
            alt="Namaste Doctor - Sexual and reproductive health education for adolescents" 
            loading="eager"
          />
        </div>
        <div className="hero-text fade-in">
          <h1>Understanding Your Body<br /> Starts with the Right Questions</h1>
          <p>Namaste Doctor is a safe, anonymous platform where adolescents can learn about sexual and reproductive health through verified, easy-to-understand information.</p>
          <div className="hero-buttons">
            <Link 
              to="/chatbot" 
              className="btn primary-btn"
              aria-label="Ask our AI chatbot health questions"
            >
              <i className="fas fa-robot" style={{ marginRight: "0.4em" }} aria-hidden="true"></i>Ask Our AI
            </Link>
            <Link 
              to="/patient-dashboard" 
              className="btn primary-btn"
              aria-label="Ask a doctor health questions"
            >
              <i className="fas fa-user-md" style={{ marginRight: "0.4em" }} aria-hidden="true"></i>Ask a Doctor
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
          <article className="feature fade-in">
            <h3>Anonymous & Non-Judgmental</h3>
            <p>No logins, no identity tracking — just honest, stigma-free answers to your most personal questions.</p>
          </article>
          <article className="feature fade-in">
            <h3>Answers from Real Doctors</h3>
            <p>Our team of 54 verified doctors personally reviews and answers the questions you ask — clearly, respectfully, and with care.</p>
          </article>
          <article className="feature fade-in">
            <h3>In Your Language</h3>
            <p>Learn in English or Nepali, so you always feel comfortable and fully understand what your body is telling you.</p>
          </article>
          <article className="feature fade-in">
            <h3>AI Learning Companion</h3>
            <p>Ask anything, anytime. Our AI gives you quick, doctor-approved information — no prescriptions or diagnoses, just guidance.</p>
          </article>
        </section>
      </section>

      {/* About Section */}
      <section id="about-section" className="section-container fade-in">
        <h2 className="section-title">About Us</h2>
        <p className="about-description">
          <strong>Namaste Doctor</strong> is a youth-led, non-profit platform developed by an adolescent — for adolescents. It was created with the goal of breaking the silence, stigma, and confusion surrounding sexual and reproductive health topics among young people in Nepal and beyond.
          <br /><br />
          In many communities, natural experiences like puberty, menstruation, masturbation, and wet dreams are often considered taboo and left unspoken. This lack of open, accurate information can lead to fear, shame, and harmful misconceptions.
          <br /><br />
          Namaste Doctor exists to change that. We provide a safe, anonymous space where adolescents can ask honest questions and receive clear, respectful, and medically accurate answers. Our platform is strictly educational — we do not offer consultations, diagnoses, or prescriptions of any kind.
          <br /><br />
          Every answer is written or verified by qualified doctors to ensure scientific accuracy and age-appropriate guidance. Our aim is to empower young people to understand their bodies, make informed choices, and grow up with confidence and dignity.
        </p>
        
          <div className="founder-info">
            <p>Prabigya Acharya <br />Founder, CEO</p>
          </div>
      </section>

      {/* Articles Section */}
      <section id="posts-section" className="section-container fade-in">
        <h2 className="section-title">Explore Educational Topics</h2>
        <div className="posts-grid">
          <Link 
            to="/post-1" 
            className="post-card"
            aria-label="Read article about understanding period cramps"
          >
            <img 
              src={imgCramp1} 
              alt="Understanding period cramps and menstrual pain" 
              loading="lazy"
            />
            <h3>Understanding Period Cramps</h3>
            <p>Why they happen, what's normal, and how to manage them safely—without panic or shame.</p>
          </Link>
          <Link 
            to="/post-2" 
            className="post-card"
            aria-label="Read article about masturbation myths and facts"
          >
            <img 
              src={imgMasturbation} 
              alt="Masturbation myths and facts for adolescents" 
              loading="lazy"
            />
            <h3>Masturbation & Guilt</h3>
            <p>Is it harmful? Is it okay? Let's break the myths and look at what science says.</p>
          </Link>
        </div>
      </section>

      {/* Medical Review Section */}
      <section className="doctors-container section-container fade-in">
        <h2 className="section-title">Our Doctors</h2>
        <div className="doctors-card">
          <div className="doctors-grid">
            <article className="doctor-card fade-in">
              <img 
                src={imgDoctor1} 
                alt="Dr. Sagar Panthi - Medical Content Reviewer" 
                loading="lazy"
              />
              <h3>Dr. Sagar Panthi</h3>
              <p>MD</p>
              <p>Texas Tech University Health Sciences Center</p>
              <p>Medical Content Reviewer</p>
            </article>
            <article className="doctor-card fade-in">
              <img 
                src={imgDoctor2} 
                alt="Dr. Rochana Acharya - Medical Content Reviewer" 
                loading="lazy"
              />
              <h3>Dr. Rochana Acharya</h3>
              <p>MD</p>
              <p>Cleveland Clinic Foundation Program</p>
              <p>Medical Content Reviewer</p>
            </article>
          </div>
          <div className="doctors-cta">
            <Link 
              to="/our-doctors" 
              className="btn primary-btn"
              aria-label="View all medical content reviewers"
            >
              <i className="fas fa-users" style={{ marginRight: "0.5rem" }} aria-hidden="true"></i>
              View All Doctors
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section-container fade-in">
        <h2 className="section-title">How It Works</h2>
        <div className="how-it-works-content">
          <div className="how-image">
            <img 
              src={imgHow} 
              alt="How Namaste Doctor chatbot works for health education" 
              loading="lazy"
            />
          </div>
          <div className="how-text">
            <h3>No Appointments. No Judgment. Just Answers.</h3>
            <p>Just type your question — it could be about periods, erections, acne, discharge, or anything you’re curious or worried about.
               Our team of over 50 qualified doctors will review and respond with clear, confidential, and reliable guidance. You can also use our chatbot for quick answers.
               It’s fast, free, and completely anonymous.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq-section" className="section-container fade-in">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="faq-grid">
          <article className="faq-card" itemScope itemType="https://schema.org/Question">
            <h3 itemProp="name">Is Namaste Doctor a medical service?</h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p itemProp="text">No. We don't diagnose or prescribe. We focus on education, awareness, and prevention.</p>
            </div>
          </article>
          <article className="faq-card" itemScope itemType="https://schema.org/Question">
            <h3 itemProp="name">Is my identity safe?</h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p itemProp="text">Yes. You can ask anything anonymously. We don't store names, emails, or any identifying data.</p>
            </div>
          </article>
          <article className="faq-card" itemScope itemType="https://schema.org/Question">
            <h3 itemProp="name">Can I trust the information?</h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p itemProp="text">Absolutely. Our team of licensed doctors reviews the answers and content regularly to ensure accuracy.</p>
            </div>
          </article>
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