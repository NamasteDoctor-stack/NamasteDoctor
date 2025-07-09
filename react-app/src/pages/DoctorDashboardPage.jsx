import React, { useEffect, useState, useRef } from "react";
import "../mainstyle.css";
import "../chat-ui.css";
import { Link, useNavigate } from "react-router-dom";
import app from "../firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getDatabase,
  ref,
  onValue,
  set,
  update,
  off
} from "firebase/database";

const db = getDatabase(app);
const auth = getAuth(app);

const DoctorDashboardPage = () => {
  const [doctorId, setDoctorId] = useState(null);
  const [conversations, setConversations] = useState({});
  const [selectedConversationId, setSelectedConversationId] = useState(() => {
    return localStorage.getItem('selectedConversationId') || null;
  });
  const [search, setSearch] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatHeader, setChatHeader] = useState(null);
  const [showInputRow, setShowInputRow] = useState(false);
  const chatMessagesRef = useRef(null);
  const navigate = useNavigate();
  // Add a state to control mobile chat/sidebar view
  const [mobileShowChat, setMobileShowChat] = useState(false);

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Auth and doctor info
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (!user) return navigate("/login");
      setDoctorId(user.uid);
      // No need to fetch userDoc if not used
    });
    return () => unsubscribe();
  }, [navigate]);

  // Listen for all conversations
  useEffect(() => {
    if (!doctorId) return;
    const conversationsRef = ref(db, "conversations");
    const handleValue = (snap) => {
      const newConvos = {};
      snap.forEach(child => {
        const convo = child.val();
        if ((!convo.assignedDoctorId || convo.assignedDoctorId === doctorId) && convo.status !== "closed") {
          newConvos[convo.patientId] = {
            ...convo,
            lastMessage: convo.messages ? Object.values(convo.messages).sort((a, b) => b.timestamp - a.timestamp)[0]?.text : "",
            lastTimestamp: convo.messages ? Object.values(convo.messages).sort((a, b) => b.timestamp - a.timestamp)[0]?.timestamp : 0
          };
        }
      });
      setConversations(newConvos);
      // If selected conversation is removed, clear chat and localStorage
      if (selectedConversationId && !newConvos[selectedConversationId]) {
        setSelectedConversationId(null);
        localStorage.removeItem('selectedConversationId');
        setChatHeader(null);
        setChatMessages([]);
        setShowInputRow(false);
      }
    };
    onValue(conversationsRef, handleValue);
    return () => off(conversationsRef, "value", handleValue);
    // eslint-disable-next-line
  }, [doctorId, selectedConversationId]);

  // Listen for messages in selected conversation
  useEffect(() => {
    if (!selectedConversationId) return;
    const convo = conversations[selectedConversationId];
    setChatHeader(convo);
    if (!convo) return;
    const messagesRef = ref(db, `conversations/${selectedConversationId}/messages`);
    const handleValue = (snap) => {
      const messages = snap.exists() ? Object.values(snap.val()).sort((a, b) => a.timestamp - b.timestamp) : [];
      setChatMessages(messages);
      // Show browser notification for new patient message
      if (
        window.Notification &&
        Notification.permission === "granted" &&
        document.visibilityState !== "visible"
      ) {
        // show notification
      }
    };
    onValue(messagesRef, handleValue);
    setShowInputRow(true);
    return () => off(messagesRef, "value", handleValue);
    // eslint-disable-next-line
  }, [selectedConversationId, conversations]);

  // Render sidebar conversations
  const filteredConversations = Object.values(conversations)
    .filter(convo => !convo.assignedDoctorId || convo.assignedDoctorId === doctorId)
    .filter(convo => {
      if (!search) return true;
      return (convo.patientId && convo.patientId.toLowerCase().includes(search.toLowerCase())) ||
        (convo.lastMessage && convo.lastMessage.toLowerCase().includes(search.toLowerCase()));
    })
    .sort((a, b) => (b.lastTimestamp || 0) - (a.lastTimestamp || 0));

  // Select a conversation (lock it and show chat)
  const selectConversation = (patientId) => {
    const convo = conversations[patientId];
    if (!convo) return;
    const convoRef = ref(db, `conversations/${patientId}`);
    if (!convo.assignedDoctorId) {
      update(convoRef, { assignedDoctorId: doctorId, unread: false });
    } else if (convo.assignedDoctorId !== doctorId) {
      alert("This conversation is already being handled by another doctor.");
      return;
    }
    setSelectedConversationId(patientId);
    localStorage.setItem('selectedConversationId', patientId);
    // Show chat only on mobile
    if (window.innerWidth <= 600) setMobileShowChat(true);
  };

  // Send a message
  const handleSend = async () => {
    if (!chatInput.trim() || !selectedConversationId) return;
    const timestamp = Date.now();
    const convoRef = ref(db, `conversations/${selectedConversationId}`);
    await set(ref(db, `conversations/${selectedConversationId}/messages/${timestamp}`), {
      sender: "doctor",
      text: chatInput.trim(),
      timestamp
    });
    await update(convoRef, { unread: false });
    setChatInput("");
    // No optimistic update; rely on database listener
  };

  // Send message on Enter (without Shift)
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Add a back button handler for mobile
  const handleMobileBack = () => {
    setMobileShowChat(false);
    setSelectedConversationId(null);
    localStorage.removeItem('selectedConversationId');
    setChatHeader(null);
    setChatMessages([]);
    setShowInputRow(false);
  };

  return (
    <>
      <div className="dashboard-container">
        <aside className={"sidebar" + (mobileShowChat ? " hide-mobile" : "")}>
          <div className="sidebar-header">
            <input
              type="text"
              placeholder="Search..."
              className="search-bar"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <ul className="conversation-list" id="conversationList">
            {filteredConversations.map(convo => (
              <li
                key={convo.patientId}
                className={
                  "conversation-item" +
                  (convo.unread ? " unread" : "") +
                  (selectedConversationId === convo.patientId ? " selected" : "")
                }
                onClick={() => selectConversation(convo.patientId)}
              >
                <img
                  className="conversation-avatar"
                  src={convo.photo || "/avatar.jpg"}
                  alt="avatar"
                />
                <div className="conversation-info">
                  <div className="conversation-name">{convo.fullName || "Anonymous"}</div>
                  <div className="conversation-last">{convo.lastMessage ? convo.lastMessage : "No messages yet"}</div>
                </div>
                {convo.unread && <span className="unread-badge">!</span>}
              </li>
            ))}
          </ul>
        </aside>
        <main className={"chat-main" + (mobileShowChat ? " show-mobile" : "")}>
          <div className="chat-header" id="chatHeader">
            {/* Mobile back button */}
            {mobileShowChat && (
              <button onClick={handleMobileBack} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', marginRight: 10, cursor: 'pointer' }}>&larr;</button>
            )}
            {chatHeader && (
              <>
                <img
                  className="chat-header-avatar"
                  src={chatHeader.photo || "/avatar.jpg"}
                  alt="avatar"
                />
                <div className="chat-header-info">
                  <div className="chat-header-name">{chatHeader.fullName || "Anonymous"}</div>
                  <div className="chat-header-id">ID: {chatHeader.patientId}</div>
                </div>
              </>
            )}
          </div>
          <div className="chat-messages" id="chatMessages" ref={chatMessagesRef}>
            {chatMessages.length === 0 ? (
              <div className="chat-message system">No messages yet.</div>
            ) : (
              chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={
                    "chat-message " +
                    (msg.sender === "doctor"
                      ? "doctor"
                      : msg.sender === "patient"
                      ? "user"
                      : "system")
                  }
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  {(msg.sender === 'doctor' || msg.sender === 'patient') && (
                    <img
                      src={process.env.PUBLIC_URL + '/avatar.jpg'}
                      alt="avatar"
                      style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                    />
                  )}
                  <span>{msg.text}</span>
                </div>
              ))
            )}
          </div>
          {showInputRow && (
            <div className="chat-input-row" id="chatInputRow">
              <input
                type="text"
                id="chatInput"
                placeholder="Type your reply..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={handleInputKeyDown}
              />
              <button id="sendBtn" onClick={handleSend}>Send</button>
            </div>
          )}
        </main>
      </div>
      <footer className="site-footer" style={{ background: "#f8f8f8", color: "#333", textAlign: "center", padding: "1.2rem 0", marginTop: "2rem", fontSize: "1rem", borderTop: "1px solid #eee" }}>
        <span>&copy; 2024 Namaste Doctor. All rights reserved. | <Link to="/privacy-policy" style={{ color: "#1976d2", textDecoration: "underline" }}>Privacy Policy</Link></span>
      </footer>
    </>
  );
};

export default DoctorDashboardPage; 
