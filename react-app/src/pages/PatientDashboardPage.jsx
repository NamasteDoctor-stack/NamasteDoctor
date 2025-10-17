import React, { useEffect, useRef, useState } from "react";
import "../mainstyle.css";
import "../chat-ui.css";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import app from "../firebaseConfig";
import { getDatabase, ref, onValue, set, off, update } from "firebase/database";

const db = getDatabase(app);

const PatientDashboardPage = () => {
  const [patientId] = useState(() => {
    let id = localStorage.getItem("patientId");
    if (!id) {
      id = "p-" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("patientId", id);
    }
    return id;
  });
  const [messages, setMessages] = useState([
    { text: "Welcome! You can ask your health questions here. Our medical team will respond as soon as possible.", type: "system" }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [notificationPopup, setNotificationPopup] = useState(false);
  const [notificationBlocked, setNotificationBlocked] = useState(false);
  const [tabWarningPopup, setTabWarningPopup] = useState(true);
  const chatMessagesRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  // Notification permission popup logic
  useEffect(() => {
    if (window.Notification && Notification.permission !== "granted") {
      setNotificationPopup(true);
    }
  }, []);

  // Tab warning popup - show on page load
  useEffect(() => {
    setTabWarningPopup(true);
  }, []);

  // Listen for doctor messages
  useEffect(() => {
    const messagesRef = ref(db, `conversations/${patientId}/messages`);
    onValue(messagesRef, (snap) => {
      const msgs = snap.exists() ? Object.values(snap.val()) : [];
      const allMsgs = [
        { text: "Welcome! You can ask your health questions here. Our medical team will respond as soon as possible.", type: "system" },
        ...msgs.map(msg => ({ text: msg.text, type: msg.sender, timestamp: msg.timestamp }))
      ];
      setMessages(allMsgs);
      // Show browser notification for new doctor message
      if (window.Notification && Notification.permission === "granted") {
        const lastMsg = msgs[msgs.length - 1];
        if (lastMsg && lastMsg.sender === "doctor") {
          new Notification("New message from your doctor", {
            body: lastMsg.text,
            icon: "https://img.icons8.com/emoji/48/doctor-emoji.png"
          });
        }
      }
    });
    return () => off(messagesRef);
  }, [patientId]);

  // Listen for typing indicator
  useEffect(() => {
    const typingRef = ref(db, `typing/${patientId}`);
    const handleValue = (snap) => {
      setTyping(snap.val() === "doctor");
    };
    onValue(typingRef, handleValue);
    return () => off(typingRef);
  }, [patientId]);

  // Send message
  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const timestamp = Date.now();
    const conversationRef = ref(db, `conversations/${patientId}`);

    // Only set up the conversation if it doesn't exist
    // Use update so you don't overwrite messages
    update(conversationRef, {
      senderId: patientId,
      patientId: patientId,
      createdAt: timestamp,
      assignedDoctorId: null,
      status: "active",
      unread: true
    });

    // Add the patient message
    set(ref(db, `conversations/${patientId}/messages/${timestamp}`), {
      sender: "patient",
      text,
      timestamp
    });

    // Add the system message right after
    const sysTimestamp = timestamp + 1;
    set(ref(db, `conversations/${patientId}/messages/${sysTimestamp}`), {
      sender: "system",
      text: "Your message has been received. Our doctors will address it as soon as possible. Meanwhile, you can use our chatbot for quick answers.",
      timestamp: sysTimestamp
    });

    setInput("");
    setTypingStatus(false);
  };

  // Typing status
  const setTypingStatus = (isTyping) => {
    set(ref(db, `typing/${patientId}`), isTyping ? "patient" : "");
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      set(ref(db, `typing/${patientId}`), "");
    }, 2000);
  };

  // Notification permission
  const askPermission = () => {
    if (!window.Notification) {
      alert("This browser does not support desktop notification");
      setNotificationBlocked(true);
      return;
    }
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        setNotificationPopup(false);
        setNotificationBlocked(false);
      } else {
        setNotificationBlocked(true);
      }
    });
  };

  // Close tab warning popup
  const closeTabWarning = () => {
    setTabWarningPopup(false);
  };

  // Handle Enter key for sending message
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    const handleUnload = () => {
      const db = getDatabase(app);
      import('firebase/database').then(({ remove, ref }) => {
        remove(ref(db, `conversations/${patientId}`));
      });
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [patientId]);

  useEffect(() => {
    document.title = "Namaste Doctor - Patient Dashboard";
  }, []);

  return (
    <>
      <Navbar />
      <div className="chat-shell">
        <div className="topbar">
          <div className="brand">NamasteDoctor</div>
          <Link to="/chatbot" className="btn primary-btn" style={{ marginLeft: "1rem" }}>Sexual Health Chatbot</Link>
        </div>
        <div className="chat-body" id="chatMessages" ref={chatMessagesRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.type}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {(msg.type === 'doctor' || msg.type === 'patient') && (
                <img
                  src={process.env.PUBLIC_URL + '/avatar.jpg'}
                  alt="avatar"
                  style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                />
              )}
              <span>{msg.text}</span>
            </div>
          ))}
        </div>
        {typing && <div className="typing-indicator">Doctor is typing...</div>}
        <div className="chat-footer">
          <textarea
            id="chatInput"
            placeholder="Type your question..."
            value={input}
            onChange={e => {
              setInput(e.target.value);
              setTypingStatus(true);
            }}
            onKeyDown={handleInputKeyDown}
          />
          <button onClick={sendMessage} id="sendBtn">Send</button>
        </div>
      </div>
      
      {/* Tab Warning Popup */}
      {tabWarningPopup && (
        <div id="tab-warning-popup" style={{ 
          position: "fixed", 
          top: "50%", 
          left: "50%", 
          transform: "translate(-50%, -50%)", 
          background: "#fff", 
          borderRadius: 15, 
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)", 
          padding: "2rem", 
          zIndex: 10000, 
          textAlign: "center",
          maxWidth: "400px",
          width: "90%"
        }}>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#FF4081", marginBottom: "1rem" }}>
            ⚠️ Important Notice
          </div>
          <p style={{ color: "#333", fontSize: "1.1rem", lineHeight: "1.6", marginBottom: "1.5rem" }}>
            Please do not close this tab to ensure you receive answers from our medical team. 
            Keep this page open to get timely responses to your health questions.
          </p>
          <button 
            onClick={closeTabWarning} 
            style={{ 
              background: "#FF4081", 
              color: "#fff", 
              border: "none", 
              borderRadius: 8, 
              padding: "0.8rem 2rem", 
              fontWeight: "bold", 
              cursor: "pointer",
              fontSize: "1rem"
            }}
          >
            I Understand
          </button>
        </div>
      )}
      
      {/* Notification popup */}
      {notificationPopup && (
        <div id="notification-popup" style={{ position: "fixed", bottom: 30, left: "50%", transform: "translateX(-50%)", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.15)", padding: "1.5rem 2rem", zIndex: 9999, textAlign: "center" }}>
          <p>{notificationBlocked ? "Notifications are blocked. Please enable them in your browser settings." : "Enable notifications to receive instant alerts when your doctor replies."}</p>
          {!notificationBlocked && <button id="allow-notifications-btn" style={{ background: "#FF4081", color: "#fff", border: "none", borderRadius: 8, padding: "0.7rem 1.5rem", fontWeight: "bold", cursor: "pointer" }} onClick={askPermission}>Allow Notifications</button>}
        </div>
      )}
      <footer className="site-footer" style={{ background: "#f8f8f8", color: "#333", textAlign: "center", padding: "1.2rem 0", marginTop: "2rem", fontSize: "1rem", borderTop: "1px solid #eee" }}>
        <span>&copy; 2024 Namaste Doctor. All rights reserved. | <Link to="/privacy-policy" style={{ color: "#1976d2", textDecoration: "underline" }}>Privacy Policy</Link></span>
      </footer>
    </>
  );
};

export default PatientDashboardPage; 