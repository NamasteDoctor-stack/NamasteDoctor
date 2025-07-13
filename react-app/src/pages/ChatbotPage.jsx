import React, { useState, useRef, useEffect } from "react";
import "../mainstyle.css"; 
import "../chatboat.css";
import { marked } from "marked";

const GEMINI_PROXY_URL = "https://gemini-proxy.namastedoctornp.workers.dev";
const SYSTEM_PROMPT = `You are a friendly, supportive assistant helping adolescents (ages 12-18) understand their bodies and sexual health.

CRITICAL GUIDELINES:
1. Keep answers SHORT and SIMPLE (max 2-3 sentences)
2. Use language a 6th grader can understand - NO medical jargon
3. Be direct but gentle - adolescents need clear, honest answers
4. Focus on what's normal and healthy
5. Use simple, everyday words instead of medical terms
6. Be encouraging and supportive, not scary or judgmental
7. If you need to use a medical term, explain it in simple words

EXAMPLES:
"Menstruation is the monthly shedding of the uterine endometrium"
"Periods are when your body gets rid of blood and tissue from your uterus each month"

"Masturbation is a normal physiological response"
"Touching yourself is normal and healthy - it's your body's way of feeling good"

Remember: You're talking to young people who are confused and need simple, honest answers. Be their friend, not their doctor.`;



const FALLBACK_RESPONSES = {
  greetings: [
    "Hey! I'm here to help with your body questions. What's on your mind?",
    "Hi! Ask me anything about your body - it's totally normal to be curious!",
    "Hello! I'm here to answer your questions about growing up and your body."
  ],
  general: [
    "That's a great question! Let me give you a simple answer.",
    "I'm glad you asked! Here's what you should know.",
    "Good question! This is totally normal to wonder about."
  ],
  emergency: [
    "If you're really worried or in pain, tell a trusted adult or go to a doctor.",
    "If something doesn't feel right, it's okay to ask for help from a grown-up.",
    "When in doubt, talk to someone you trust or see a doctor."
  ],
  referral: [
    "For personal advice, talk to a doctor or trusted adult.",
    "A doctor can give you better advice for your specific situation.",
    "It's always good to talk to a grown-up you trust about these things."
  ]
};

export default function ChatbotPage() {
  const [conversation, setConversation] = useState([
    {
      sender: "bot",
      text: "Hey! I'm here to help with your body questions. Growing up can be confusing - ask me anything! Everything is private and anonymous."
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
    setInput("");
    setLoading(true);
    setShowStop(true);
    setShowSend(false);

    try {
      // Try to fetch from the API first
      if (apiAvailable) {
        // Build conversation history for context (including the new user message)
        const updatedConversation = [...conversation, { sender: "user", text: userMsg }];
        const conversationHistory = updatedConversation
          .filter(msg => msg.sender === "user" || msg.sender === "bot")
          .map(msg => `${msg.sender === "user" ? "User" : "Assistant"}: ${msg.text}`)
          .join("\n");
        
        const fullPrompt = `${SYSTEM_PROMPT}\n\nPrevious conversation:\n${conversationHistory}`;
        
        // Add user message to conversation state
        setConversation((prev) => [...prev, { sender: "user", text: userMsg }]);
        
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
          } else {
            // Handle HTTP error status codes
            console.log(`Server responded with status: ${res.status}`);
            if (res.status === 500) {
              console.log("Server error (500) - likely API key issue");
            }
            throw new Error(`HTTP ${res.status}: Server error`);
          }
        } catch (fetchError) {
          // Handle timeout and other fetch errors
          if (fetchError.message === 'Request timeout') {
            console.log("Request timed out - switching to offline mode");
          } else if (fetchError.message.includes('HTTP 500')) {
            console.log("Server error (500) - switching to offline mode");
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

  const clearChat = () => {
    setConversation([
      {
        sender: "bot",
        text: "Hey! I'm here to help with your body questions. Growing up can be confusing - ask me anything! Everything is private and anonymous."
      }
    ]);
  };

  return (
    <div className="nd-chatbot-outer">
      <div className="nd-chatbot-container">
        <div className="nd-chatbot-title">
          Sexual Health Chatbot
          {conversation.length > 1 && (
            <button 
              onClick={clearChat}
              style={{
                float: 'right',
                background: '#ff6b6b',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '0.3rem 0.8rem',
                fontSize: '0.8rem',
                cursor: 'pointer',
                marginTop: '0.2rem'
              }}
              title="Clear conversation"
            >
              🗑️ Clear Chat
            </button>
          )}
        </div>
        
        {/* Conversation Memory Indicator */}
        <div style={{ 
          textAlign: 'center', 
          padding: '0.5rem', 
          background: '#e8f5e8', 
          color: '#2e7d32', 
          fontSize: '0.9rem',
          borderBottom: '1px solid #c8e6c9'
        }}>
          💬 AI remembers our conversation - feel free to ask follow-up questions!
        </div>
        
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
            ⚠️ Currently using offline mode - AI service temporarily unavailable. You can still ask questions and get helpful responses.
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
