import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import Navbar from "../Navbar";
import "../mainstyle.css";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../translations/translations";
import imgHero from '../Images/8B973CDC-B9A5-4B4E-BDB6-48263EA71907-Photoroom.png';
import imgCramp1 from '../Images/cramp1.webp';
import imgMasturbation from '../Images/MASTURBATION.png';
import imgDoctor1 from '../Images/Doctor-1.png';
import imgDoctor2 from '../Images/Doctor-2.png';
import imgHow from '../Images/how.png';

const HomePage = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const t = translations[language];

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
        <title>{t.title}</title>
        <meta name="description" content={t.description} />
        <meta name="keywords" content={t.keywords} />
        <link rel="canonical" href={window.location.href} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={t.ogTitle} />
        <meta property="og:description" content={t.ogDescription} />
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
          <h1>{t.heroTitle}</h1>
          <p>{t.heroDescription}</p>
          <div className="hero-buttons">
            <Link 
              to="/chatbot" 
              className="btn primary-btn"
              aria-label="Ask our AI chatbot health questions"
            >
              <i className="fas fa-robot" style={{ marginRight: "0.4em" }} aria-hidden="true"></i>{t.askAI}
            </Link>
            <Link 
              to="/patient-dashboard" 
              className="btn primary-btn"
              aria-label="Ask a doctor health questions"
            >
              <i className="fas fa-user-md" style={{ marginRight: "0.4em" }} aria-hidden="true"></i>{t.askDoctor}
            </Link>
          </div>
          <p style={{ fontSize: "0.9rem", marginTop: "0.7rem", color: "#555" }}>
            {t.heroNote}
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="offers-container fade-in">
        <h2 className="section-title">{t.featuresTitle}</h2>
        <section className="features">
          <article className="feature fade-in">
            <h3>{t.feature1Title}</h3>
            <p>{t.feature1Desc}</p>
          </article>
          <article className="feature fade-in">
            <h3>{t.feature2Title}</h3>
            <p>{t.feature2Desc}</p>
          </article>
          <article className="feature fade-in">
            <h3>{t.feature3Title}</h3>
            <p>{t.feature3Desc}</p>
          </article>
          <article className="feature fade-in">
            <h3>{t.feature4Title}</h3>
            <p>{t.feature4Desc}</p>
          </article>
        </section>
      </section>

      {/* About Section */}
      <section id="about-section" className="section-container fade-in">
        <h2 className="section-title">{t.aboutTitle}</h2>
        <p className="about-description">
          {t.aboutDescription.split('\n').map((line, index) => (
            <span key={index}>
              {line}
              {index < t.aboutDescription.split('\n').length - 1 && <br />}
            </span>
          ))}
        </p>
        
          <div className="founder-info">
            <p>{t.founderInfo}</p>
          </div>
      </section>

      {/* Articles Section */}
      <section id="posts-section" className="section-container fade-in">
        <h2 className="section-title">{t.postsTitle}</h2>
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
            <h3>{t.post1Title}</h3>
            <p>{t.post1Desc}</p>
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
            <h3>{t.post2Title}</h3>
            <p>{t.post2Desc}</p>
          </Link>
        </div>
      </section>

      {/* Medical Review Section */}
      <section className="doctors-container section-container fade-in">
        <h2 className="section-title">{t.doctorsTitle}</h2>
        <div className="doctors-card">
          <div className="doctors-grid">
            <article className="doctor-card fade-in">
              <img 
                src={imgDoctor1} 
                alt="Dr. Sagar Panthi - Medical Content Reviewer" 
                loading="lazy"
              />
              <h3>{t.doctor2Name}</h3>
              <p>{t.doctor2Degree}</p>
              <p>{t.doctor2Institution}</p>
              <p>{t.doctor2Role}</p>
            </article>
            <article className="doctor-card fade-in">
              <img 
                src={imgDoctor2} 
                alt="Dr. Rochana Acharya - Medical Content Reviewer" 
                loading="lazy"
              />
              <h3>{t.doctor1Name}</h3>
              <p>{t.doctor1Degree}</p>
              <p>{t.doctor1Institution}</p>
              <p>{t.doctor1Role}</p>
            </article>
          </div>
          <div className="doctors-cta">
            <Link 
              to="/our-doctors" 
              className="btn primary-btn"
              aria-label="View all medical content reviewers"
            >
              <i className="fas fa-users" style={{ marginRight: "0.5rem" }} aria-hidden="true"></i>
              {t.viewAllDoctors}
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section-container fade-in">
        <h2 className="section-title">{t.howTitle}</h2>
        <div className="how-it-works-content">
          <div className="how-image">
            <img 
              src={imgHow} 
              alt="How Namaste Doctor chatbot works for health education" 
              loading="lazy"
            />
          </div>
          <div className="how-text">
            <h3>{t.howSubtitle}</h3>
            <p>{t.howDescription}</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq-section" className="section-container fade-in">
        <h2 className="section-title">{t.faqTitle}</h2>
        <div className="faq-grid">
          <article className="faq-card" itemScope itemType="https://schema.org/Question">
            <h3 itemProp="name">{t.faq1Question}</h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p itemProp="text">{t.faq1Answer}</p>
            </div>
          </article>
          <article className="faq-card" itemScope itemType="https://schema.org/Question">
            <h3 itemProp="name">{t.faq2Question}</h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p itemProp="text">{t.faq2Answer}</p>
            </div>
          </article>
          <article className="faq-card" itemScope itemType="https://schema.org/Question">
            <h3 itemProp="name">{t.faq3Question}</h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p itemProp="text">{t.faq3Answer}</p>
            </div>
          </article>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer" style={{ background: "#f8f8f8", color: "#333", textAlign: "center", padding: "1.2rem 0", marginTop: "2rem", fontSize: "1rem", borderTop: "1px solid #eee" }}>
        <span>{t.footerText.split(' | ')[0]} | <Link to="/privacy-policy" style={{ color: "#1976d2", textDecoration: "underline" }}>{t.footerText.split(' | ')[1]}</Link></span>
      </footer>
    </>
  );
};

export default HomePage;