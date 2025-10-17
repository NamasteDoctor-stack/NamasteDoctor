import React from "react";
import Navbar from "../Navbar";
import "../mainstyle.css";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import imgMast1 from '../Images/mast1.webp';

const Post2Page = () => {
  const { language } = useLanguage();
  
  // Test with hardcoded values first
  const testTranslations = {
    en: {
      post2Title: "Understanding Masturbation: Facts, Myths, and Health Implications",
      post2Published: "Published on:",
      post2By: "By:",
      post2Date: "March 20, 2025",
      post2Author: "Dr. Rochana Acharya",
      post2Heading1: "Is Masturbation Harmful?",
      post2Para2: "No, masturbation does not cause physical harm. There is no scientific evidence linking it to negative effects on the body or reproductive health.",
      post2List1: [
        "Stress relief",
        "Improved sleep",
        "Better understanding of one's own body and preferences"
      ],
      post2Para3: "However, if it becomes compulsive and begins to interfere with school, work, or relationships, it may indicate an underlying issue that should be addressed.",
      post2Heading2: "The Science Behind Masturbation",
      post2Para4: "Research shows that masturbation is a normal part of human development and sexual expression.",
      post2Para5: "Physical Benefits: Studies indicate that regular masturbation can have positive effects on physical health.",
      post2Para6: "Mental Health Benefits: Masturbation can also have antidepressant and anti-anxiety effects due to the release of endorphins.",
      post2Para7: "Psychological Benefits: Masturbation can also have antidepressant and anti-anxiety effects due to the release of endorphins and other mood-enhancing hormones.",
      post2Heading4: "Common Myths Debunked",
      post2List2: [
        "\"Masturbation causes blindness or infertility\": False. No scientific link exists between masturbation and these effects.",
        "\"It lowers testosterone and weakens the body\": Partially false. While testosterone levels may dip briefly after ejaculation, they return to normal quickly.",
        "\"It leads to mental health problems\": False. Masturbation can actually reduce stress and support emotional well-being."
      ],
      post2Heading5: "Potential Risks of Excessive Masturbation",
      post2Para8: "While masturbation is generally safe, doing it excessively may come with certain risks:",
      post2List3: [
        "Mental Health Concerns: Some studies associate frequent masturbation with depressive symptoms, anxiety, and dissatisfaction with relationships.",
        "Physical Health Concerns: Research links high frequency of masturbation to elevated prostate-specific antigen levels.",
        "Behavioral Issues: Compulsive masturbation may negatively affect productivity, focus, and social interactions."
      ],
      post2Heading6: "The Role of Individual Differences",
      post2Para9: "Age and Development: The frequency and meaning of masturbation can vary significantly across different life stages.",
      post2Para10: "Cultural and Religious Factors: Personal beliefs and cultural background play a significant role in how individuals perceive and experience masturbation.",
      post2Para11: "Gender Differences: Research shows that the psychological effects of masturbation are not significantly influenced by gender.",
      post2Heading7: "Rare but Serious Risks",
      post2List4: [
        "Fournier's Gangrene: Though extremely rare, one case linked this serious infection to excessive masturbation using soap as a lubricant.",
        "Prostate Dysfunction: High-frequency masturbation may be associated with raised prostate-specific antigen levels and potential dysfunction.",
        "Sexual Dysfunction: Excessive masturbation can impact sexual satisfaction and intimacy with partners."
      ],
      post2Heading8: "Final Thoughts: A Balanced Approach",
      post2Para12: "As a future surgeon and researcher, I support evidence-based sexual health education. In moderation, masturbation is a healthy and normal part of development.",
      post2Quote: "By providing accurate, stigma-free education and addressing concerns with facts, we can help young people develop a healthy, guilt-free understanding of their bodies and sexuality.",
      backToPosts: "Back to Posts",
      footerText: "© 2025 Namaste Doctor | Privacy Policy"
    },
    ne: {
      post2Title: "हस्तमैथुन बुझ्नुहोस्: तथ्यहरू, मिथकहरू र स्वास्थ्य प्रभावहरू",
      post2Published: "प्रकाशित मिति:",
      post2By: "लेखक:",
      post2Date: "मार्च २०, २०२५",
      post2Author: "डा. रोचना आचार्य",
      post2Heading1: "के हस्तमैथुन हानिकारक छ?",
      post2Para2: "होइन, हस्तमैथुनले शारीरिक हानि गर्दैन। यसले शरीर वा प्रजनन स्वास्थ्यमा नकारात्मक प्रभाव पार्ने भन्ने कुनै वैज्ञानिक प्रमाण छैन।",
      post2List1: [
        "तनाव निवारण",
        "निद्रा सुधार",
        "आफ्नो शरीर र प्राथमिकताहरूको राम्रो बुझाइ"
      ],
      post2Para3: "तर यदि यो बाध्यकारी बन्छ र स्कूल, काम वा सम्बन्धहरूमा हस्तक्षेप गर्न सुरु गर्छ भने, यसले अन्तर्निहित समस्या जनाउन सक्छ जसलाई सम्बोधन गर्नुपर्छ।",
      post2Heading2: "हस्तमैथुनको पछाडिको विज्ञान",
      post2Para4: "अनुसन्धानले देखाउँछ कि हस्तमैथुन मानव विकास र यौन अभिव्यक्तिको सामान्य भाग हो।",
      post2Para5: "शारीरिक फाइदाहरू: अध्ययनहरूले नियमित हस्तमैथुनले शारीरिक स्वास्थ्यमा सकारात्मक प्रभाव पार्न सक्छ भन्ने देखाउँछ।",
      post2Para6: "मानसिक स्वास्थ्य फाइदाहरू: हस्तमैथुनले एन्डोर्फिन रिलिजको कारणले एन्टिडिप्रेसेन्ट र एन्टि-एन्जाइटी प्रभाव पनि हुन सक्छ।",
      post2Para7: "मनोवैज्ञानिक फाइदाहरू: हस्तमैथुनले एन्डोर्फिन र अन्य मनोदशा सुधारने हर्मोनहरूको रिलिजको कारणले एन्टिडिप्रेसेन्ट र एन्टि-एन्जाइटी प्रभाव पनि हुन सक्छ।",
      post2Heading4: "सामान्य मिथकहरू खण्डन",
      post2List2: [
        "\"हस्तमैथुनले अन्धपन वा बाँझपन ल्याउँछ\": गलत। हस्तमैथुन र यी प्रभावहरू बीच कुनै वैज्ञानिक सम्बन्ध छैन।",
        "\"यसले टेस्टोस्टेरोन कम गर्छ र शरीर कमजोर बनाउँछ\": आंशिक रूपमा गलत। जबकि टेस्टोस्टेरोन स्तरहरू स्खलन पछि छोटो समयका लागि घट्न सक्छ, तिनीहरू छिटै सामान्यमा फर्किन्छन्।",
        "\"यसले मानसिक स्वास्थ्य समस्याहरू ल्याउँछ\": गलत। हस्तमैथुनले वास्तवमा तनाव कम गर्न सक्छ र भावनात्मक कल्याणलाई समर्थन गर्न सक्छ।"
      ],
      post2Heading5: "अत्यधिक हस्तमैथुनका सम्भावित जोखिमहरू",
      post2Para8: "जबकि हस्तमैथुन सामान्यतया सुरक्षित छ, यसलाई अत्यधिक गर्दा केही जोखिमहरू हुन सक्छन्:",
      post2List3: [
        "मानसिक स्वास्थ्य चिन्ताहरू: केही अध्ययनहरूले बारम्बार हस्तमैथुनलाई अवसादग्रस्त लक्षणहरू, चिन्ता र सम्बन्धहरूसँग असन्तुष्टिका साथ जोड्छन्।",
        "शारीरिक स्वास्थ्य चिन्ताहरू: अनुसन्धानले हस्तमैथुनको उच्च आवृत्तिलाई उच्च प्रोस्टेट-विशिष्ट एन्टिजेन स्तरहरूसँग जोड्छ।",
        "व्यवहारिक समस्याहरू: बाध्यकारी हस्तमैथुनले उत्पादकता, फोकस र सामाजिक अन्तरक्रियाहरूमा नकारात्मक प्रभाव पार्न सक्छ।"
      ],
      post2Heading6: "व्यक्तिगत भिन्नताहरूको भूमिका",
      post2Para9: "उमेर र विकास: हस्तमैथुनको आवृत्ति र अर्थ विभिन्न जीवन चरणहरूमा महत्वपूर्ण रूपमा फरक हुन सक्छ।",
      post2Para10: "सांस्कृतिक र धार्मिक कारकहरू: व्यक्तिगत विश्वासहरू र सांस्कृतिक पृष्ठभूमिले व्यक्तिहरूले हस्तमैथुनलाई कसरी बुझ्छन् र अनुभव गर्छन् भन्नेमा महत्वपूर्ण भूमिका खेल्छ।",
      post2Para11: "लिङ्ग भिन्नताहरू: अनुसन्धानले देखाउँछ कि हस्तमैथुनका मनोवैज्ञानिक प्रभावहरू लिङ्गद्वारा महत्वपूर्ण रूपमा प्रभावित हुँदैनन्।",
      post2Heading7: "दुर्लभ तर गम्भीर जोखिमहरू",
      post2List4: [
        "फोर्नियर ग्याङ्ग्रिन: यद्यपि अत्यन्त दुर्लभ, एक केसमा यो गम्भीर संक्रमणलाई साबुनलाई लुब्रिकेन्टको रूपमा प्रयोग गरेर अत्यधिक हस्तमैथुनसँग जोडिएको थियो।",
        "प्रोस्टेट दुष्क्रिया: उच्च-आवृत्ति हस्तमैथुनले उच्च प्रोस्टेट-विशिष्ट एन्टिजेन स्तरहरूसँग सम्बन्धित हुन सक्छ र सम्भावित दुष्क्रिया।",
        "यौन दुष्क्रिया: अत्यधिक हस्तमैथुनले यौन सन्तुष्टि र साझेदारहरूसँगको घनिष्ठतामा प्रभाव पार्न सक्छ।"
      ],
      post2Heading8: "अन्तिम विचार: संतुलित दृष्टिकोण",
      post2Para12: "भविष्यका सर्जन र अनुसन्धानकर्ताको रूपमा, म प्रमाण-आधारित यौन स्वास्थ्य शिक्षालाई समर्थन गर्छु। मध्यमतामा अभ्यास गर्दा हस्तमैथुन विकासको स्वस्थ र सामान्य भाग हो।",
      post2Quote: "सही, कलंक-मुक्त शिक्षा प्रदान गरेर र तथ्यहरूसँग चिन्ताहरू सम्बोधन गरेर, हामी युवाहरूलाई आफ्नो शरीर र यौनताको स्वस्थ, अपराधबोध-मुक्त बुझाइ विकसित गर्न मद्दत गर्न सक्छौं।",
      backToPosts: "पोस्टहरूमा फर्कनुहोस्",
      footerText: "© २०२५ नमस्ते डाक्टर | गोपनीयता नीति"
    }
  };
  
  const t = testTranslations[language] || testTranslations['en'];
  
  return (
  <>
    <Navbar />
    <main className="blog-container section-container fade-in">
        <h1 className="blog-title">{t.post2Title || "Loading..."}</h1>
      <div className="blog-image">
        <img src={imgMast1} alt="Healthcare Innovation" />
      </div>
      <article className="blog-content">
          <p><strong>{t.post2Published || "Published"}</strong> {t.post2Date || "Date"} | <strong>{t.post2By || "By"}</strong> {t.post2Author || "Author"}</p>
        <p>
            {t.post2Para1}
        </p>
          <h2>{t.post2Heading1}</h2>
        <p>
            {t.post2Para2}
        </p>
        <ul>
            {t.post2List1 && t.post2List1.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
        </ul>
        <p>
            {t.post2Para3}
        </p>
          <h2>{t.post2Heading2}</h2>
        <p>
            {t.post2Para4}
        </p>
          <h2>{t.post2Heading3}</h2>
        <p>
            <strong>{t.post2Para5.split(':')[0]}:</strong> {t.post2Para5.split(':')[1]}
        </p>
        <p>
            <strong>{t.post2Para6.split(':')[0]}:</strong> {t.post2Para6.split(':')[1]}
        </p>
        <p>
            <strong>{t.post2Para7.split(':')[0]}:</strong> {t.post2Para7.split(':')[1]}
          </p>
          <h2>{t.post2Heading4}</h2>
          <ul>
            {t.post2List2 && t.post2List2.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
        </ul>
          <h2>{t.post2Heading5}</h2>
        <p>
            {t.post2Para8}
        </p>
        <ul>
            {t.post2List3 && t.post2List3.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
        </ul>
          <h2>{t.post2Heading6}</h2>
        <p>
            <strong>{t.post2Para9.split(':')[0]}:</strong> {t.post2Para9.split(':')[1]}
        </p>
        <p>
            <strong>{t.post2Para10.split(':')[0]}:</strong> {t.post2Para10.split(':')[1]}
        </p>
        <p>
            <strong>{t.post2Para11.split(':')[0]}:</strong> {t.post2Para11.split(':')[1]}
          </p>
          <h2>{t.post2Heading7}</h2>
          <ul>
            {t.post2List4 && t.post2List4.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
        </ul>
          <h2>{t.post2Heading8}</h2>
        <p>
            {t.post2Para12}
        </p>
        <blockquote>
            {t.post2Quote}
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

export default Post2Page; 