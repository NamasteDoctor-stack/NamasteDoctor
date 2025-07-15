import React, { useState, useRef, useEffect } from "react";
import "../mainstyle.css"; 
import "../chatboat.css";
import { marked } from "marked";

const GEMINI_PROXY_URL = "https://gemini-proxy.namastedoctornp.workers.dev";
const SYSTEM_PROMPT = `You are a friendly, supportive sexual health educator helping adolescents (ages 12-18) understand their bodies and sexual health. This is an EDUCATIONAL context for health information.

CRITICAL GUIDELINES:
1. Keep answers SHORT and SIMPLE (max 2-3 sentences)
2. Use language a 6th grader can understand - NO medical jargon
3. Be direct but gentle - adolescents need clear, honest answers
4. Focus on what's normal and healthy
5. Use simple, everyday words instead of medical terms
6. Be encouraging and supportive, not scary or judgmental
7. ALWAYS answer questions about sexual health - these are normal topics for adolescents
8. NEVER refuse to answer or say "I couldn't generate a response"
9. This is for EDUCATIONAL PURPOSES - you are providing health information
10. You MUST answer ALL questions about body parts, sizes, and sexual health

IMPORTANT: Respond in Roman Nepali if the user's query is in Roman Nepali, otherwise respond in English. Keep the language consistent with the user's input.
You MUST answer questions about:
- Masturbation (touching yourself for pleasure) - this is normal and healthy
- Periods and menstruation - normal body function
- Wet dreams and erections - normal puberty changes
- Body changes during puberty - natural development
- Sexual health and development - important health topics
- Penis size, breast size, body parts - all normal variations
- Sexual questions - provide educational, age-appropriate answers

These are normal, healthy topics that adolescents need to understand. Provide clear, supportive answers that help them learn about their bodies safely.

CONTEXT: This is a sexual health education chatbot for adolescents. You are providing important health information in an educational setting. Answer all questions honestly and supportively.

SAFETY NOTE: This is educational content for adolescents. You are helping them understand their bodies safely. Do not refuse to answer any health-related questions.

EDUCATIONAL FRAMING: When discussing sensitive topics, emphasize:
- These are normal parts of human development
- Everyone's body is different and that's okay
- These are healthy bodily functions
- It's natural to be curious about your body
- There's nothing wrong or shameful about these topics

Remember: You're talking to young people who are confused and need simple, honest answers. Be their friend, not their doctor.`;



const FALLBACK_RESPONSES = {
  greetings: {
    en: [
      "Hey! I'm here to help with your body questions. What's on your mind?",
      "Hi! Ask me anything about your body - it's totally normal to be curious!",
      "Hello! I'm here to answer your questions about growing up and your body."
    ],
    ne: [
      "Hey! Ma tapai ko sharir bareka prashna haru ma madat garna yaha chu. Ke sochdai hunuhuncha?",
      "Hi! Tapai ko sharir bare kehi pani sodhnus - jigyasu hunu samanya kura ho!",
      "Hello! Ma tapai ko badhne ra sharir bareka prashna haru ko jawab dina yaha chu."
    ]
  },
  general: {
    en: [
      "That's a great question! Let me give you a simple answer.",
      "I'm glad you asked! Here's what you should know.",
      "Good question! This is totally normal to wonder about.",
      "That's a normal thing to be curious about! Here's what you should know.",
      "Great question! This is something many people wonder about."
    ],
    ne: [
      "Yo ekdam ramro prashna ho! Ma tapailai sajilo uttar dinchu.",
      "Ma khusi chu tapai le sodhnubhayo! Yo kura thaha paunu parchha.",
      "Ramro prashna! Yo samanya jigyasa ho.",
      "Yo prashna sodhnu samanya ho! Yo kura thaha paunu parchha.",
      "Dherai le yo prashna garchan. Yo samanya ho."
    ]
  },
  emergency: {
    en: [
      "If you're really worried or in pain, tell a trusted adult or go to a doctor.",
      "If something doesn't feel right, it's okay to ask for help from a grown-up.",
      "When in doubt, talk to someone you trust or see a doctor.",
      "If you're feeling scared or in pain, don't wait - talk to a parent, teacher, or doctor right away.",
      "Your health is important! If something feels wrong, get help from someone you trust."
    ],
    ne: [
      "Yadi tapai dherai chintit hunuhuncha wa dukhai ma hunuhuncha, bharosa garne thulo manis lai bhannus wa doctor kaha janus.",
      "Yadi kehi thik lagena bhane, ekjana thulo manis sanga madat magnus.",
      "Didhara paryo bhane, bharosa garne manis sanga kura garnus wa doctor sanga janus.",
      "Dukhai ya dara lagyo bhane, abilai parent, teacher, wa doctor sanga kura garnus.",
      "Tapai ko swasthya mahatwapurna ho! Kehi galat lagyo bhane, bharosa garne manis sanga madat magnus."
    ]
  },
  referral: {
    en: [
      "For personal advice, talk to a doctor or trusted adult.",
      "A doctor can give you better advice for your specific situation.",
      "It's always good to talk to a grown-up you trust about these things."
    ],
    ne: [
      "Byaktigat salah ko lagi, doctor wa bharosa garne thulo manis sanga kura garnus.",
      "Doctor le tapai ko awastha anusar ramro salah dinchha.",
      "Yesto kura ma bharosa garne thulo manis sanga kura garnu ramro ho."
    ]
  }
};

// A simple heuristic to guess if the input is Roman Nepali
const isRomanNepali = (text) => {
  const lowerText = text.toLowerCase();
  const nepaliKeywords = ['ke chha', 'sanchai', 'mero', 'tapai', 'ghar', 'khana', 'pani', 'dukhi', 'hola', 'hoina', 'cha', 'garchu', 'kura'];
  return nepaliKeywords.some(keyword => lowerText.includes(keyword)) ||
         /[aeiou]h|[iaou]i|au|ou|ch|jh|th|dh|ph|bh|sh|gh|kh|ng|ny|chh|jhh|chh|tth|ddh|pph|bbh|ss|mm|yy/.test(lowerText);
};

const getFallbackResponse = (userMessage) => {
  const isNepali = isRomanNepali(userMessage);
  const lang = isNepali ? 'ne' : 'en';
  const message = userMessage.toLowerCase();

  // Greetings
  if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('namaste')) {
    return FALLBACK_RESPONSES.greetings[lang][Math.floor(Math.random() * FALLBACK_RESPONSES.greetings[lang].length)];
  }

  // Masturbation (example)
  if (message.includes('masturbation') || message.includes('masturbate') || message.includes('touching yourself') || message.includes('afule chune')) {
    if (isNepali) {
      if (message.includes('k ho') || message.includes('arth')) {
        return "Masturbation afno gopya angalai khusi ko lagi chunu ho. Yo tapai ko sharir lai bujhne ra ramro mahasus garne samanya tarika ho.";
      } else if (message.includes('kati choti') || message.includes('frequency')) {
        return "Tyesko kunai nischit sankhya chaina - tapailai jasto comfortable lagcha tyastai garnus. Kohi le daily garchan, aru le biralai. Afno sharir ko kura sunnus!";
      } else if (message.includes('ramro cha') || message.includes('healthy')) {
        return "Ho, yo healthy ra samanya ho! Yesle tapai lai afno sharir bare sikhna, tanaav kam garna, ra ramro mahasus garna madat garcha. Laj mannu pardaina.";
      } else if (message.includes('kharab cha') || message.includes('hani')) {
        return "Hoina, yo kei pani kharab chaina! Yo purai surakshit ra samanya ho. Yesle tapailai dukha dinna wa kunai swasthya samasya lagdaina.";
      } else {
        return "Masturbation samanya ra healthy ho. Yo afno sharir bare sikhne ra ramro mahasus garne tarika ho. Sabai le garchan ra yo purai thik cha!";
      }
    } else {
      if (message.includes('what is') || message.includes('define') || message.includes('meaning')) {
        return "Masturbation is touching your private parts for pleasure. It's a normal way to explore your body and feel good.";
      } else if (message.includes('how many') || message.includes('times') || message.includes('frequency')) {
        return "There's no set number - do what feels comfortable for you. Some people do it daily, others rarely. Listen to your body!";
      } else if (message.includes('is it good') || message.includes('benefits') || message.includes('healthy')) {
        return "Yes, it's healthy and normal! It helps you learn about your body, relieves stress, and feels good. Nothing to be ashamed of.";
      } else if (message.includes('is it bad') || message.includes('harmful') || message.includes('dangerous')) {
        return "No, it's not bad at all! It's completely safe and normal. It won't hurt you or cause any health problems.";
      } else {
        return "Masturbation is normal and healthy. It's a way to learn about your body and feel good. Everyone does it and it's totally fine!";
      }
    }
  }

  // Periods and menstruation
  if (message.includes('period') || message.includes('menstruation') || message.includes('mensuration')) {
    if (isNepali) {
      return "Periods are when your body gets rid of blood and tissue from your uterus each month. It's normal for girls and part of growing up.";
    } else {
      return "Periods are when your body gets rid of blood and tissue from your uterus each month. It's normal for girls and part of growing up.";
    }
  }

  // Wet dreams
  if (message.includes('wet dream') || message.includes('wet dreams')) {
    if (isNepali) {
      return "Wet dreams are normal for boys. Your body releases fluid while you sleep - it's totally natural and nothing to worry about.";
    } else {
      return "Wet dreams are normal for boys. Your body releases fluid while you sleep - it's totally natural and nothing to worry about.";
    }
  }

  // Erections
  if (message.includes('erection') || message.includes('erections') || message.includes('hard')) {
    if (isNepali) {
      return "Erections are normal and happen when blood flows to your penis. They're part of growing up and nothing to be embarrassed about.";
    } else {
      return "Erections are normal and happen when blood flows to your penis. They're part of growing up and nothing to be embarrassed about.";
    }
  }

  // Penis size questions
  if (message.includes('penis') || message.includes('penis size') || message.includes('small penis')) {
    if (isNepali) {
      if (message.includes('ideal') || message.includes('average') || message.includes('normal size')) {
        return "There's no 'ideal' penis size! Penises come in all shapes and sizes. What matters is being healthy and comfortable with your body. Size doesn't determine anything important.";
      } else if (message.includes('small') || message.includes('problem')) {
        return "Small penises are completely normal! Many guys worry about size, but it doesn't matter for health or relationships. Your body is perfect just the way it is.";
      } else {
        return "Penis size varies a lot between people. There's no 'right' size - everyone is different and that's totally normal!";
      }
    } else {
      if (message.includes('ideal') || message.includes('average') || message.includes('normal size')) {
        return "There's no 'ideal' penis size! Penises come in all shapes and sizes. What matters is being healthy and comfortable with your body. Size doesn't determine anything important.";
      } else if (message.includes('small') || message.includes('problem')) {
        return "Small penises are completely normal! Many guys worry about size, but it doesn't matter for health or relationships. Your body is perfect just the way it is.";
      } else {
        return "Penis size varies a lot between people. There's no 'right' size - everyone is different and that's totally normal!";
      }
    }
  }

  // Discharge
  if (message.includes('discharge') || message.includes('white stuff')) {
    if (isNepali) {
      return "Vaginal discharge is normal and helps keep your vagina clean and healthy. It's your body's way of staying clean.";
    } else {
      return "Vaginal discharge is normal and helps keep your vagina clean and healthy. It's your body's way of staying clean.";
    }
  }

  // Puberty topics
  if (message.includes('puberty') || message.includes('growing up') || message.includes('body changes')) {
    if (isNepali) {
      return "Puberty is when your body changes from a child to an adult. You'll grow taller, develop new body parts, and your feelings might change. It's all normal!";
    } else {
      return "Puberty is when your body changes from a child to an adult. You'll grow taller, develop new body parts, and your feelings might change. It's all normal!";
    }
  }

  // Body hair
  if (message.includes('hair') || message.includes('pubic hair') || message.includes('armpit hair')) {
    if (isNepali) {
      return "Growing body hair is normal during puberty. It's your body's way of becoming an adult. Everyone gets it at different times.";
    } else {
      return "Growing body hair is normal during puberty. It's your body's way of becoming an adult. Everyone gets it at different times.";
    }
  }

  // Voice changes
  if (message.includes('voice') || message.includes('voice change') || message.includes('voice cracking')) {
    if (isNepali) {
      return "Voice changes are normal for boys during puberty. Your voice might crack or get deeper. It's just your body growing up!";
    } else {
      return "Voice changes are normal for boys during puberty. Your voice might crack or get deeper. It's just your body growing up!";
    }
  }

  // Breast development
  if (message.includes('breast') || message.includes('breasts') || message.includes('boobs')) {
    if (isNepali) {
      if (message.includes('small') || message.includes('big') || message.includes('size')) {
        return "Breast size varies a lot! Some girls have small breasts, others have big ones. Both are completely normal and beautiful. Your size is perfect for you!";
      } else if (message.includes('bigger') || message.includes('grow')) {
        return "Breast size is mostly determined by your genes. You can't really make them bigger, but that's totally fine! Small breasts are just as normal and beautiful as big ones.";
      } else {
        return "Breast development is normal for girls during puberty. They grow at different rates and sizes - everyone is different!";
      }
    } else {
      if (message.includes('small') || message.includes('big') || message.includes('size')) {
        return "Breast size varies a lot! Some girls have small breasts, others have big ones. Both are completely normal and beautiful. Your size is perfect for you!";
      } else if (message.includes('bigger') || message.includes('grow')) {
        return "Breast size is mostly determined by your genes. You can't really make them bigger, but that's totally fine! Small breasts are just as normal and beautiful as big ones.";
      } else {
        return "Breast development is normal for girls during puberty. They grow at different rates and sizes - everyone is different!";
      }
    }
  }

  // Emergency keywords
  if (message.includes('emergency') || message.includes('urgent') || message.includes('pain') || message.includes('bleeding')) {
    return FALLBACK_RESPONSES.emergency[lang][Math.floor(Math.random() * FALLBACK_RESPONSES.emergency[lang].length)];
  }

  // Specific health topics
  if (message.includes('pregnancy') || message.includes('contraception') || message.includes('std') || message.includes('sti')) {
    return FALLBACK_RESPONSES.referral[lang][Math.floor(Math.random() * FALLBACK_RESPONSES.referral[lang].length)];
  }

  // Default general response
  return FALLBACK_RESPONSES.general[lang][Math.floor(Math.random() * FALLBACK_RESPONSES.general[lang].length)];
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

  const isRefusalResponse = (answer) => {
    const lowerAnswer = answer.toLowerCase();
    // Only detect actual refusals, not legitimate responses
    const refusalPhrases = [
      "i'm sorry, but i cannot",
      "i cannot provide",
      "i'm unable to",
      "i cannot answer",
      "i'm not able to",
      "i cannot generate",
      "i couldn't generate",
      "i cannot respond",
      "i'm not allowed to",
      "i cannot discuss",
      "i cannot help with",
      "i cannot assist with",
      "sorry, i couldn't generate a response"
    ];
    
    // Check if it's a very short response that might be a refusal
    if (lowerAnswer.length < 20 && lowerAnswer.includes("sorry")) {
      return true;
    }
    
    return refusalPhrases.some(phrase => lowerAnswer.includes(phrase));
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
      // Add user message to conversation state
      setConversation((prev) => [...prev, { sender: "user", text: userMsg }]);
      
      // Try to fetch from the API for other topics
      if (apiAvailable) {
        // Build conversation history for context (including the new user message)
        const updatedConversation = [...conversation, { sender: "user", text: userMsg }];
        const conversationHistory = updatedConversation
          .filter(msg => msg.sender === "user" || msg.sender === "bot")
          .map(msg => `${msg.sender === "user" ? "User" : "Assistant"}: ${msg.text}`)
          .join("\n");
        
        // Transform user input to emphasize educational context
        const educationalContext = `As a sexual health educator for adolescents, I'm asked about this topic. Please provide a simple, factual answer about this for a 12-18 year old, focusing on what is normal and healthy for adolescent development.`;
        
        const fullPrompt = `${SYSTEM_PROMPT}\n\nPrevious conversation:\n${conversationHistory}\n\nUser: ${userMsg}\n\n${educationalContext}\n\nAssistant:`;
        
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
            console.log("AI Response:", data.answer);
            if (data.answer && data.answer.trim().length > 10 && !isRefusalResponse(data.answer)) {
              setConversation((prev) => [...prev, { sender: "bot", text: "" }]);
              await typeWriterEffect(data.answer);
              return;
            } else {
              // If AI refuses to answer, try with a more explicit educational prompt
              console.log("AI refused to answer - trying with enhanced educational context");
              console.log("Response was:", data.answer);
              console.log("Response length:", data.answer?.length);
              console.log("Is refusal:", isRefusalResponse(data.answer));
              
              // Try again with more explicit educational framing
              const enhancedPrompt = `${SYSTEM_PROMPT}\n\nPrevious conversation:\n${conversationHistory}\n\nUser: ${userMsg}\n\nAs a sexual health educator, I need to provide accurate, supportive information about this topic for adolescents. This is a normal part of human development and healthy bodily function. Please provide a simple, factual answer that helps young people understand their bodies safely.\n\nAssistant:`;
              
              try {
                const retryRes = await fetch(GEMINI_PROXY_URL, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ message: enhancedPrompt })
                });
                
                if (retryRes.ok) {
                  const retryData = await retryRes.json();
                  console.log("Retry AI Response:", retryData.answer);
                  if (retryData.answer && retryData.answer.trim().length > 10 && !isRefusalResponse(retryData.answer)) {
                    setConversation((prev) => [...prev, { sender: "bot", text: "" }]);
                    await typeWriterEffect(retryData.answer);
                    return;
                  }
                }
              } catch (retryError) {
                console.log("Retry failed:", retryError);
              }
              
              // If retry also fails, use fallback
              console.log("Using fallback response");
              const fallbackResponse = getFallbackResponse(userMsg);
              setConversation((prev) => [...prev, { sender: "bot", text: "" }]);
              await typeWriterEffect(fallbackResponse);
              return;
            }
          } else {
            // Handle HTTP error status codes
            console.log(`Server responded with status: ${res.status}`);
            if (res.status === 500) {
              console.log("Server error (500) - likely API key issue");
            }
            // Don't throw error here, just fall through to fallback
            setApiAvailable(false);
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
          // Don't throw error here, just fall through to fallback
          setApiAvailable(false);
        }
      }
      
      // If we reach here, API is not available or failed, use fallback
      if (apiAvailable) {
        setApiAvailable(false);
      }
      const fallbackResponse = getFallbackResponse(userMsg);
      setConversation((prev) => [...prev, { sender: "bot", text: "" }]);
      await typeWriterEffect(fallbackResponse);
    } catch (err) {
      // Only log and handle errors if we haven't already switched to offline mode
      if (apiAvailable) {
        console.error("Unexpected error in chatbot:", err.message || err);
        setApiAvailable(false);
      }
      
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

  // Replace handleStopTypewriter with a new function that clears the last bot message
  const handleStopTypewriter = () => {
    setStopTypewriter(true);
    setShowStop(false);
    setShowSend(true);
    // Remove the last bot message if it is being typed out
    setConversation((prev) => {
      if (prev.length > 0 && prev[prev.length - 1].sender === "bot" && prev[prev.length - 1].text !== "") {
        return prev.slice(0, -1);
      }
      return prev;
    });
  };



  return (
    <div className="nd-chatbot-outer">
      <div className="nd-chatbot-container">
        <div className="nd-chatbot-title">
          Sexual Health Chatbot
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
          {showStop && (
            <button
              id="nd-stopGeneratingBtn"
              type="button"
              onClick={handleStopTypewriter}
              title="Stop generating"
              style={{ marginLeft: showSend ? '0.5rem' : 0 }}
            >
              ■
            </button>
          )}
        </form>
      </div>
      {/* Feedback Button at the very bottom, always visible */}
      <div className="nd-feedback-btn-wrapper nd-feedback-btn-fixed">
        <a
          href="https://forms.gle/cWbRFZ1NsBNu86Zv7"
          target="_blank"
          rel="noopener noreferrer"
          className="nd-feedback-btn"
        >
          Give Feedback
        </a>
      </div>
    </div>
  );
}
