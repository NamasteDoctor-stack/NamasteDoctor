import React, { useState, useRef, useEffect } from "react";
import "../mainstyle.css"; 
import "../chatboat.css";
import { marked } from "marked";

const GEMINI_PROXY_URL = "https://gemini-proxy.namastedoctornp.workers.dev";
const SYSTEM_PROMPT = `You are a friendly, respectful, and confidential assistant that provides accurate and age-appropriate information about adolescent sexual and reproductive health.
You must only answer questions within the scope of sexual and reproductive health education—such as puberty, menstruation, erections, wet dreams, masturbation, safe practices, consent, body changes, and anatomy.
Do not answer questions outside this domain. If asked anything unrelated, gently explain that you are only designed to support sexual and reproductive health learning.
Do not disclose or suggest anything about your identity, form, source, creators, or how you work. Avoid all references to being an AI, bot, model, or being powered by any system or organization.
Never store, infer, or refer to the user's identity or personal data. Always respond with complete confidentiality and respect for privacy.
If a question requires clinical evaluation, diagnosis, or treatment, politely recommend speaking to a licensed healthcare provider.
Always keep responses clear, concise, inclusive, non-judgmental, and scientifically accurate. Avoid slang or explicit phrasing unless necessary for clarity and empowerment.`;



const FALLBACK_RESPONSES = {
  greetings: [
    "Hello! I'm here to help with your sexual health questions. What would you like to know?",
    "Hi there! I'm your sexual health assistant. Feel free to ask me anything - your questions are confidential.",
    "Welcome! I'm here to provide accurate, non-judgmental information about sexual and reproductive health."
  ],
  general: [
    "That's a great question about sexual health. While I can provide general information, it's always best to consult with a healthcare provider for personalized advice.",
    "I understand your concern. This is a common question, and I'd be happy to share some general information with you.",
    "Thank you for asking this important question. Let me provide you with some helpful information about this topic."
  ],
  emergency: [
    "If you're experiencing a medical emergency, please contact emergency services immediately or visit the nearest hospital.",
    "For urgent medical concerns, please seek immediate medical attention from a healthcare provider.",
    "If this is an emergency situation, please call emergency services right away."
  ],
  referral: [
    "For personalized medical advice, I recommend consulting with a qualified healthcare provider who can assess your specific situation.",
    "While I can provide general information, your healthcare provider will be able to give you the most appropriate advice for your situation.",
    "It's always a good idea to discuss these matters with a healthcare professional who knows your medical history."
  ]
};

export default function ChatbotPage() {
  const [conversation, setConversation] = useState([
    {
      sender: "bot",
      text: "Hi! I am your sexual health assistant. Ask me anything about sexual and reproductive health. Your questions are anonymous and confidential."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [stopTypewriter, setStopTypewriter] = useState(false);
  const [showStop, setShowStop] = useState(false);
  const [showSend, setShowSend] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(true);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, loading]);

  // Cleanup effect for component unmount
  useEffect(() => {
    return () => {
      // Cleanup any pending requests when component unmounts
      setLoading(false);
      setShowStop(false);
      setShowSend(true);
      setApiAvailable(false); // Force offline mode on unmount
    };
  }, []);

  const typeWriterEffect = async (text) => {
    let i = 0;
    setShowStop(true);
    setShowSend(false);
    setStopTypewriter(false);
    let displayed = "";

    const type = () => {
      if (stopTypewriter) {
        setConversation((prev) => [
          ...prev.slice(0, -1),
          { sender: "bot", text }
        ]);
        setShowStop(false);
        setShowSend(true);
        return;
      }
      if (i <= text.length) {
        displayed = text.slice(0, i);
        setConversation((prev) => [
          ...prev.slice(0, -1),
          { sender: "bot", text: displayed }
        ]);
        i++;
        setTimeout(type, 10);
      } else {
        setShowStop(false);
        setShowSend(true);
      }
    };
    type();
  };

  const getFallbackResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Check for greetings
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return FALLBACK_RESPONSES.greetings[Math.floor(Math.random() * FALLBACK_RESPONSES.greetings.length)];
    }
    
    // Check for emergency keywords
    if (message.includes('emergency') || message.includes('urgent') || message.includes('pain') || message.includes('bleeding')) {
      return FALLBACK_RESPONSES.emergency[Math.floor(Math.random() * FALLBACK_RESPONSES.emergency.length)];
    }
    
    // Check for specific health topics
    if (message.includes('pregnancy') || message.includes('contraception') || message.includes('std') || message.includes('sti')) {
      return FALLBACK_RESPONSES.referral[Math.floor(Math.random() * FALLBACK_RESPONSES.referral.length)];
    }
    
    // Default response
    return FALLBACK_RESPONSES.general[Math.floor(Math.random() * FALLBACK_RESPONSES.general.length)];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input.trim();
    setConversation((prev) => [...prev, { sender: "user", text: userMsg }]);
    setInput("");
    setLoading(true);
    setShowStop(true);
    setShowSend(false);

    try {
      // Try to fetch from the API first
      if (apiAvailable) {
        const fullPrompt = `${SYSTEM_PROMPT}\n\nUser: ${userMsg}`;
        
        // Use Promise.race to handle timeout without AbortController
        const fetchPromise = fetch(GEMINI_PROXY_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: fullPrompt })
        });
        
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), 15000);
        });
        
        try {
          const res = await Promise.race([fetchPromise, timeoutPromise]);
          
          if (res.ok) {
            const data = await res.json();
            if (data.answer) {
              setConversation((prev) => [...prev, { sender: "bot", text: "" }]);
              await typeWriterEffect(data.answer);
              return;
            }
          }
        } catch (fetchError) {
          // Handle timeout and other fetch errors
          if (fetchError.message === 'Request timeout') {
            console.log("Request timed out - switching to offline mode");
          } else {
            console.log("Fetch error - switching to offline mode");
          }
          throw fetchError; // Re-throw to be caught by outer catch
        }
      }
      
      // If API fails or is not available, use fallback
      setApiAvailable(false);
      const fallbackResponse = getFallbackResponse(userMsg);
      setConversation((prev) => [...prev, { sender: "bot", text: "" }]);
      await typeWriterEffect(fallbackResponse);
    } catch (err) {
      console.error("Error fetching from proxy:", err);
      
      // Switch to offline mode for any error
      setApiAvailable(false);
      
      // Use fallback response for any error
      const fallbackResponse = getFallbackResponse(userMsg);
      setConversation((prev) => [...prev, { sender: "bot", text: "" }]);
      await typeWriterEffect(fallbackResponse);
    } finally {
      setLoading(false);
      setShowStop(false);
      setShowSend(true);
    }
  };

  const handleStopTypewriter = () => {
    setStopTypewriter(true);
    setShowStop(false);
    setShowSend(true);
  };

  return (
    <div className="nd-chatbot-outer">
      <div className="nd-chatbot-container">
        <div className="nd-chatbot-title">Sexual Health Chatbot</div>
        
        {/* API Status Indicator */}
        {!apiAvailable && (
          <div style={{ 
            textAlign: 'center', 
            padding: '0.5rem', 
            background: '#fff3cd', 
            color: '#856404', 
            fontSize: '0.9rem',
            borderBottom: '1px solid #ffeaa7'
          }}>
            ⚠️ Currently using offline mode - AI service temporarily unavailable
          </div>
        )}
        
        <div className="nd-chat-messages" id="ndChatMessages">
          {conversation.map((msg, idx) =>
            msg.sender === "bot" ? (
              <div
                key={idx}
                className={`nd-chat-message bot`}
                dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) }}
              />
            ) : (
              <div
                key={idx}
                className={`nd-chat-message user`}
              >
                {msg.text}
              </div>
            )
          )}
          <div ref={chatEndRef} />
        </div>
        
        {/* Loading indicator */}
        {loading && (
          <div id="nd-chatLoading">
            <span>{apiAvailable ? "AI is processing..." : "Processing..."}</span>
          </div>
        )}
        
        {/* Stop button */}
        {showStop && (
          <button
            id="nd-stopGeneratingBtn"
            onClick={handleStopTypewriter}
            title="Stop generating"
          >
            ■
          </button>
        )}
        
        {/* Input form */}
        <form onSubmit={handleSubmit} className="nd-chatbot-input-row">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            disabled={loading}
          />
          {showSend && (
            <button
              type="submit"
              disabled={loading || !input.trim()}
              title="Send message"
            >
              ➤
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
