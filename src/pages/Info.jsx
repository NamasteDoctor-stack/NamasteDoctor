import React from "react";
import "../mainstyle.css";
import "../chatboat.css";
import Navbar from "../Navbar";

export default function Info() {
  return (
    <>
      <Navbar />
      <div className="nd-info-outer">
        <div className="nd-info-container">
          <h1 className="nd-info-title">About Namaste Doctor</h1>
          <p className="nd-info-lead">
            Puberty doesn’t come with a manual.<br/>
            And for many adolescents in Nepal, neither does access to trusted, judgment-free information about their changing bodies.
          </p>
          <p>
            Namaste Doctor is a youth-led, non-profit platform dedicated to improving adolescent sexual and reproductive health literacy in Nepal. It was created to address the silence and confusion that surrounds essential topics like puberty, menstruation, consent, and emotional development.
          </p>
          <p>
            In many communities, these natural experiences remain taboo. As a result, young people are often left without support—navigating personal and physical changes alone, with limited access to reliable information.
          </p>
          <p>
            Namaste Doctor aims to change that by providing a safe, anonymous space where users can ask real questions and receive clear, medically reviewed answers that are accurate, respectful, and age-appropriate.
          </p>
          <p>
            Because no one should have to choose between curiosity and shame—and everyone deserves the right to grow up informed, confident, and understood.
          </p>

          <h2 className="nd-info-section-title">How It Started</h2>
          <p>
            Namaste Doctor was born from a shared experience—many young people had important questions but nowhere safe to turn for answers. This platform was created to fill that gap, offering access to honest, science-based information without fear or judgment.
          </p>

          <h2 className="nd-info-section-title">Our Mission</h2>
          <ul className="nd-info-list">
            <li>To bridge the gap between adolescents and reliable, science-based health information.</li>
            <li>To reduce shame, stigma, and misinformation around sexual and reproductive health.</li>
            <li>To empower individuals to understand their bodies and make informed decisions.</li>
          </ul>

          <h2 className="nd-info-section-title">What We’re Doing Now</h2>
          <ul className="nd-info-list">
            <li>A fully anonymous chat system designed for ease and privacy.</li>
            <li>A sexual health chatbot that responds in both English and Romanized Nepali.</li>
            <li>Expert review from licensed medical professionals to ensure clarity and accuracy.</li>
          </ul>
          <p>
            We’re also building a team of motivated young advocates who will help raise awareness in schools and communities—introducing the platform and encouraging open, respectful dialogue around sexual health.
          </p>

          <h2 className="nd-info-section-title">Looking Ahead</h2>
          <p>
            Over the next five years, our goal is to support a generation that grows up informed, confident, and free from shame. We aim to ensure that no one has to suppress their questions or face critical changes alone.
          </p>
          <p>
            Namaste Doctor is committed to making sexual and reproductive health education more accessible, inclusive, and empowering for all young people in Nepal.
          </p>
          {/* Volunteer Button at the very bottom of the page content */}
          <div className="nd-volunteer-btn-wrapper" style={{ marginTop: '2.5rem', marginBottom: '0.5rem' }}>
            <a
              href="https://forms.gle/1ymRMimp6qHqk8xy9"
              target="_blank"
              rel="noopener noreferrer"
              className="nd-volunteer-btn"
            >
              Become a Volunteer
            </a>
          </div>
        </div>
      </div>
    </>
  );
} 
