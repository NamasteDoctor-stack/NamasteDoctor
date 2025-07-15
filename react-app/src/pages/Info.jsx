import React from "react";
import "../mainstyle.css";
import "../chatboat.css";

export default function Info() {
  return (
    <>
      <div className="nd-info-outer">
        <div className="nd-info-container">
          <h1 className="nd-info-title">About Namaste Doctor</h1>
          <p className="nd-info-lead">
            Namaste Doctor is a non-profit, youth-led platform committed to advancing sexual and reproductive health awareness among adolescents in Nepal. Initiated by a teenager with firsthand experience of the confusion and silence surrounding these issues, the platform is designed specifically to meet the needs of young people seeking trustworthy and judgment-free information.
          </p>
          <p>
            In many parts of Nepal, natural experiences such as puberty, menstruation, and emotional development are rarely discussed openly. As a result, adolescents are often left to deal with these important changes in isolation. Namaste Doctor aims to break that silence — offering a private, supportive space where young people can ask honest questions and receive accurate, age-appropriate answers verified by medical professionals.
          </p>

          <h2 className="nd-info-section-title">How It Started</h2>
          <p>
            The idea for Namaste Doctor began with a personal experience. As a teenager, our founder had questions about sexual health but didn’t know who to turn to. Even with a doctor in the family, the fear of embarrassment and judgment made it difficult to ask. After realizing that many peers felt the same way, the idea took shape: to create a platform where young people could access trusted information without fear.
          </p>

          <h2 className="nd-info-section-title">Our Mission</h2>
          <ul className="nd-info-list">
            <li>To bridge the gap between adolescents and reliable, science-based health information.</li>
            <li>To reduce shame, stigma, and misinformation around sexual and reproductive health.</li>
            <li>To empower young people to understand their bodies and make informed decisions.</li>
          </ul>

          <h2 className="nd-info-section-title">What We’re Doing Now</h2>
          <ul className="nd-info-list">
            <li>A fully anonymous chat system for adolescent users.</li>
            <li>A sexual health chatbot that understands and responds in both English and Romanized Nepali.</li>
            <li>Ongoing review and refinement by licensed medical professionals to ensure quality and accuracy.</li>
          </ul>
          <p>
            We’re also building a small team of passionate teenagers who share our values. This team will help raise awareness in schools and communities — introducing the platform and encouraging open, respectful conversations around sexual health.
          </p>

          <h2 className="nd-info-section-title">Looking Ahead</h2>
          <p>
            In the next five years, our goal is to support a generation that grows up informed, confident, and free from shame about their own development. We want to ensure that no adolescent has to suppress their questions or face confusion alone.
          </p>
          <p>
            Namaste Doctor is committed to making sexual and reproductive health education more accessible, inclusive, and empowering for all young people in Nepal.
          </p>
        </div>
      </div>
      {/* Volunteer Button at the very bottom, always visible */}
      <div className="nd-volunteer-btn-wrapper nd-volunteer-btn-fixed">
        <a
          href="https://forms.gle/1ymRMimp6qHqk8xy9"
          target="_blank"
          rel="noopener noreferrer"
          className="nd-volunteer-btn"
        >
          Become a Volunteer
        </a>
      </div>
    </>
  );
} 
