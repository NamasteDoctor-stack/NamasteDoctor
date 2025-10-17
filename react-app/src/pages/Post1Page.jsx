import React from "react";
import Navbar from "../Navbar";
import "../mainstyle.css";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import imgCramp from '../Images/cramp.jpg';

const Post1Page = () => {
  const { language } = useLanguage();
  
  // Test with hardcoded values first
  const testTranslations = {
    en: {
      post1Title: "Understanding Period Cramps: Why They Happen and How to Feel Better",
      post1Published: "Published on:",
      post1By: "By:",
      post1Date: "March 20, 2025",
      post1Author: "Dr. Rochana Acharya",
      post1Heading1: "🌸 Period Pain? You're Not Alone! 🌸",
      post1Para1: "Did you know that 45% to 95% of girls and women who have periods experience period pain?",
      post1Para2: "But it's not just about cramps. During your period, you might feel tired, have a headache, feel nauseous.",
      post1Heading2: "Why Does This Happen?",
      post1Para3: "During your period, the lining of your uterus (womb) breaks down and comes out as period blood.",
      post1Heading3: "How Do You Know If It's Normal Pain?",
      post1Para4: "This normal period pain is called primary dysmenorrhea. You can recognize it because:",
      post1List1: [
        "It usually starts a year or two after your first period.",
        "It happens during your periods and gets better after 2 or 3 days.",
        "There's no other health problem causing it.",
        "It often improves as you get older or after having a baby."
      ],
      post1Heading4: "What Can You Do to Feel Better?",
      post1Para5: "The good news is there are simple ways to manage the pain!",
      post1List2: [
        "Put a warm cloth or heating pad on your lower belly.",
        "Do some light exercise like walking or stretching.",
        "Relax and rest when you need to.",
        "Pain relief medicines like ibuprofen can help."
      ],
      post1Quote: "Remember, period pain is common and normal, but you don't have to suffer in silence!",
      backToPosts: "Back to Posts",
      footerText: "© 2025 Namaste Doctor | Privacy Policy"
    },
    ne: {
      post1Title: "महिनावारीको दुखाइ बुझ्नुहोस्: किन हुन्छ र कसरी राम्रो महसुस गर्ने",
      post1Published: "प्रकाशित मिति:",
      post1By: "लेखक:",
      post1Date: "मार्च २०, २०२५",
      post1Author: "डा. रोचना आचार्य",
      post1Heading1: "🌸 महिनावारीको दुखाइ? तपाईं एक्लै हुनुहुन्न! 🌸",
      post1Para1: "के तपाईंलाई थाहा छ कि महिनावारी हुने ४५% देखि ९५% केटी र महिलाहरूले महिनावारीको दुखाइ अनुभव गर्छन्?",
      post1Para2: "तर यो केवल क्र्याम्पहरूको बारेमा मात्र होइन। तपाईंको महिनावारीको समयमा, तपाईं थकित महसुस गर्न सक्नुहुन्छ, टाउको दुख्न सक्छ, वाकवाकी लाग्न सक्छ।",
      post1Heading2: "यो किन हुन्छ?",
      post1Para3: "तपाईंको महिनावारीको समयमा, तपाईंको गर्भाशयको आवरण टुट्छ र महिनावारीको रगतको रूपमा बाहिर आउँछ।",
      post1Heading3: "यो सामान्य दुखाइ हो कि कसरी थाहा पाउनुहुन्छ?",
      post1Para4: "यो सामान्य महिनावारीको दुखाइलाई प्राथमिक डिसमेनोरिया भनिन्छ। तपाईंले यसलाई यसरी पहिचान गर्न सक्नुहुन्छ:",
      post1List1: [
        "यो सामान्यतया तपाईंको पहिलो महिनावारीको एक वा दुई वर्ष पछि सुरु हुन्छ।",
        "यो तपाईंको महिनावारीको समयमा हुन्छ र २ वा ३ दिन पछि राम्रो हुन्छ।",
        "यसलाई ल्याउने कुनै अन्य स्वास्थ्य समस्या छैन।",
        "यो प्रायः तपाईं बढ्दै जानुसँग वा बच्चा जन्माउनु पछि राम्रो हुन्छ।"
      ],
      post1Heading4: "राम्रो महसुस गर्न तपाईंले के गर्न सक्नुहुन्छ?",
      post1Para5: "राम्रो समाचार यो हो कि दुखाइ व्यवस्थापन गर्न सजिलो तरिकाहरू छन्!",
      post1List2: [
        "तपाईंको तल्लो पेटमा न्यानो कपडा वा हिटिंग प्याड राख्नुहोस्।",
        "हिँड्ने वा स्ट्रेचिंग जस्ता हल्का व्यायाम गर्नुहोस्।",
        "आवश्यकता अनुसार आराम गर्नुहोस् र विश्राम गर्नुहोस्।",
        "आइबुप्रोफेन जस्ता दुखाइ निवारक औषधिहरूले मद्दत गर्न सक्छन्।"
      ],
      post1Quote: "याद गर्नुहोस्, महिनावारीको दुखाइ सामान्य र सामान्य हो, तर तपाईंले चुपचाप दुःख सहनुपर्दैन!",
      backToPosts: "पोस्टहरूमा फर्कनुहोस्",
      footerText: "© २०२५ नमस्ते डाक्टर | गोपनीयता नीति"
    }
  };
  
  const t = testTranslations[language] || testTranslations['en'];
  
  return (
  <>
    <Navbar />
    <main className="blog-container section-container fade-in">
        <h1 className="blog-title">{t.post1Title || "Loading..."}</h1>
      <div className="blog-image">
        <img src={imgCramp} alt="Healthcare Innovation" />
      </div>
      <article className="blog-content">
          <p><strong>{t.post1Published || "Published"}</strong> {t.post1Date || "Date"} | <strong>{t.post1By || "By"}</strong> {t.post1Author || "Author"}</p>
          <h1>{t.post1Heading1}</h1>
        <p>
            {t.post1Para1}
        </p>
        <p>
            {t.post1Para2}
          </p>
          <h2>{t.post1Heading2}</h2>
          <p>
            {t.post1Para3}
          </p>
          <h2>{t.post1Heading3}</h2>
          <p>{t.post1Para4}</p>
          <ul>
            {t.post1List1 && t.post1List1.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
        </ul>
          <h2>{t.post1Heading4}</h2>
          <p>{t.post1Para5}</p>
          <ul>
            {t.post1List2 && t.post1List2.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
        </ul>
        <blockquote>
            {t.post1Quote}
        </blockquote>
        <div className="blog-footer">
            <Link to="/" className="btn primary-btn">{t.backToPosts}</Link>
        </div>
      </article>
    </main>
    <footer className="site-footer" style={{ background: "#f8f8f8", color: "#333", textAlign: "center", padding: "1.2rem 0", marginTop: "2rem", fontSize: "1rem", borderTop: "1px solid #eee" }}>
        <span>{t.footerText.split(' | ')[0]} | <Link to="/privacy-policy" style={{ color: "#1976d2", textDecoration: "underline" }}>{t.footerText.split(' | ')[1]}</Link></span>
    </footer>
  </>
);
};

export default Post1Page; 