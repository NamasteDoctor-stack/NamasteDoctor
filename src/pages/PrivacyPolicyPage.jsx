import React from "react";
import "../mainstyle.css";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";

const PrivacyPolicyPage = () => (
  <>
    <Navbar />
    <main>
      <div className="privacy-container fade-in visible">
        <h1>Namaste Doctor Privacy Policy</h1>
        <p>At Namaste Doctor, we are dedicated to maintaining the privacy and security of your personal information. This Privacy Policy outlines how we collect, use, and safeguard the data you provide while using our platform and services.</p>

        <h2>1. Information We Collect</h2>
        <ul>
           <li><strong>Health-Related Information:</strong> Such as your health-related questions, symptoms, and any details shared during consultations with doctors or the chatbot.</li>
          <li><strong>Session and Usage Data:</strong> Information regarding your interaction with the platform, such as the IP address, browser type, time zone settings, device type, operating system, and any usage data collected through cookies and analytics tools.</li>
           </ul>

        <h2>2. Use of Information</h2>
        <ul>
          <li>Providing and enhancing our consultation services, including doctor consultations and chatbot assistance.</li>
          <li>Communicating important updates, consultation confirmations, reminders, and service-related messages.</li>
          <li>Customizing your experience to offer tailored advice and relevant content.</li>
          <li>Ensuring compliance with applicable legal and regulatory requirements.</li>
          <li>Improving platform functionality and user experience through data analytics.</li>
        </ul>

        <h2>3. Data Sharing and Third Parties</h2>
        <ul>
          <li>With verified medical professionals who provide consultations, ensuring they adhere to confidentiality agreements.</li>
           <li>With legal authorities if required by law, to comply with legal obligations.</li>
          <li>With our trusted partners and service providers, with your explicit consent.</li>
          <li>We do not sell your personal information to advertisers or third-party marketing agencies.</li>
        </ul>

        <h2>4. Data Security Measures</h2>
        <ul>
          <li>SSL encryption to protect all data transmitted between you and our platform.</li>
          <li>Access control measures to restrict unauthorized access to your personal data.</li>
          <li>Secure data storage with Two-Factor Authentication (2FA) for staff accessing sensitive data.</li>
          <li>Regular security audits and continuous staff training on data security best practices.</li>
          <li>While we take all possible precautions to safeguard your data, please note that no online system is entirely immune to risks.</li>
        </ul>

        <h2>5. Your Rights</h2>
        <ul>
          <li>Access, correction, or deletion of your personal data.</li>
          <li>Withdrawal of consent for data processing, where applicable.</li>
          <li>Objection to data processing, particularly for marketing purposes.</li>
          <li>Request data portability to transfer your information.</li>
          <li>File complaints with relevant data protection authorities if you believe your rights have been violated.</li>
        </ul>

        <h2>6. Cookies</h2>
        <p>We use cookies to improve the functionality of our platform and personalize your experience. Cookies help us track site usage and tailor content to your preferences. You can manage or disable cookies through your browser settings, although this may affect certain features or functionality of the platform.</p>

        <h2>7. Data Retention</h2>
        <p>We retain your personal information only as long as necessary to fulfill the purposes outlined in this Privacy Policy, including providing services, resolving issues, and complying with legal obligations.</p>

        <h2>8. Policy Updates</h2>
        <p>We may update this Privacy Policy from time to time. Any changes will be reflected on this page, with a revised effective date. We encourage you to review this policy periodically to stay informed about how we protect your information.</p>
      </div>
    </main>
    <footer className="site-footer" style={{ background: "#f8f8f8", color: "#333", textAlign: "center", padding: "1.2rem 0", marginTop: "2rem", fontSize: "1rem", borderTop: "1px solid #eee" }}>
      <span>&copy; 2024 Namaste Doctor. All rights reserved. | <Link to="/privacy-policy" style={{ color: "#1976d2", textDecoration: "underline" }}>Privacy Policy</Link></span>
    </footer>
    <style>{`
      .privacy-container {
        max-width: 800px;
        margin: 4rem auto;
        background: #fff;
        border-radius: 15px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.08);
        padding: 2.5rem 2rem;
        color: #333;
      }
      .privacy-container h1 {
        color: #FF4081;
        font-size: 2.2rem;
        margin-bottom: 1.5rem;
        text-align: center;
      }
      .privacy-container h2 {
        color: #1976d2;
        font-size: 1.3rem;
        margin-top: 2rem;
        margin-bottom: 0.7rem;
      }
      .privacy-container ul, .privacy-container ol {
        margin-left: 1.5rem;
        margin-bottom: 1.2rem;
      }
      .privacy-container p {
        margin-bottom: 1.1rem;
        line-height: 1.7;
      }
      @media (max-width: 600px) {
        .privacy-container {
          padding: 1.2rem 0.5rem;
          margin: 1.2rem 0.5rem;
        }
        .privacy-container h1 {
          font-size: 1.3rem;
        }
      }
    `}</style>
  </>
);

export default PrivacyPolicyPage; 
