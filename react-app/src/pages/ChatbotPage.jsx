import React, { useState, useRef, useEffect } from "react";
import "../mainstyle.css"; 
import "../chatboat.css";
import { marked } from "marked";

const GEMINI_PROXY_URL = "https://gemini-proxy.namastedoctornp.workers.dev";
// --- SYSTEM_PROMPT: Enhanced safety, language, and medical awareness ---
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
11. IMPORTANT: Respond in the SAME language as the user's input - if they ask in English, respond in English; if in Roman Nepali, respond in Roman Nepali
12. SAFETY ALERT: Watch for signs of abuse, assault, or mental health crises and provide appropriate resources

MEDICAL CONDITIONS - Be aware of these warning signs:
- Excessive hair growth in unusual places (chest, lower abdomen, upper lip) in girls could indicate PCOS
- Severe pain, unusual bleeding, or concerning symptoms need medical attention
- Mental health concerns, depression, or suicidal thoughts require immediate help

SAFETY PROTOCOLS:
- If someone mentions abuse, assault, or being hurt: Provide crisis resources immediately
- If someone expresses suicidal thoughts: Give suicide prevention resources
- If someone asks inappropriate sexual questions influenced by pornography: Redirect to healthy sexuality education
- Always emphasize that no one should touch them without permission

IMPORTANT: Respond in Roman Nepali if the user's query is in Roman Nepali, otherwise respond in English. Keep the language consistent with the user's input.

You MUST answer questions about:
- Masturbation (touching yourself for pleasure) - this is normal and healthy
- Periods and menstruation - normal body function, but mention when to see a doctor
- Wet dreams and erections - normal puberty changes
- Body changes during puberty - natural development, but note concerning symptoms
- Sexual health and development - important health topics
- Penis size, breast size, body parts - all normal variations
- Sexual questions - provide educational, age-appropriate answers while redirecting unhealthy influences

CRISIS RESOURCES TO MENTION WHEN NEEDED:
- For immediate danger: Call local emergency services
- For mental health crisis: Provide suicide prevention resources
- For abuse: Direct to trusted adults, counselors, or authorities
- Always emphasize: "This is not your fault" and "Help is available"

These are normal, healthy topics that adolescents need to understand. Provide clear, supportive answers that help them learn about their bodies safely while being alert to safety concerns.

Remember: You're talking to young people who are confused and need simple, honest answers. Be their friend, not their doctor, but know when to recommend professional help.`;

// --- Nepal-specific helpline numbers ---
const NEPAL_HELPLINES = `\n\nNepal Mental Health & Emergency Helplines:\n- National Suicide Prevention Helpline (TPO Nepal): 1166 (8am-8pm)\n- TUTH Suicide Hotline: 16600121600 (24hr)\n- Mental Health Helpline Nepal: 1660-0133666 (8am-8pm)\n- Nepal Emergency Hotline: 100, 112 (24hr)\n- Patan Hospital Suicide Hotline: 9813476123\n- TPO Nepal: Text +977 9847386158, Call +977 16600102005\n- Mental Health Promotion & Suicide Prevention Center: +977-01-441264 (mhpspc.org.np)\n- CMC Hotline: 16600185080`;

const FALLBACK_RESPONSES = {
  greetings: {
    en: [
    "Hey! I'm here to help with your body questions. What's on your mind?",
    "Hi! Ask me anything about your body - it's totally normal to be curious!",
    "Hello! I'm here to answer your questions about growing up and your body."
  ],
    ne: [
      "Hey! Ma hajur ko sharir bareka prashna haru ma madat garna yaha chu. Ke sochdai hunuhuncha?",
      "Hi! Hajur ko sharir bare kehi pani sodhnus - jigyasu hunu samanya kura ho!",
      "Hello! Ma hajur ko badhne ra sharir bareka prashna haru ko jawab dina yaha chu."
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
      "Yo ekdam ramro prashna ho! Ma hajurlai sajilo uttar dinchu.",
      "Ma khusi chu hajur le sodhnubhayo! Yo kura thaha paunu parchha.",
      "Ramro prashna! Yo samanya jigyasa ho.",
      "Yo prashna sodhnu samanya ho! Yo kura thaha paunu parchha.",
      "Dherai le yo prashna garchan. Yo samanya ho."
    ]
  },
  emergency: {
    en: [
    "If you're really worried or in pain, tell a trusted adult or go to a doctor right away.",
    "If something doesn't feel right, it's okay to ask for help from a grown-up you trust.",
    "When in doubt, talk to someone you trust or see a doctor immediately.",
    "If you're feeling scared or in pain, don't wait - talk to a parent, teacher, or doctor right away.",
    "Your health is important! If something feels wrong, get help from someone you trust immediately."
  ],
    ne: [
      "Yadi hajur dherai chintit hunuhuncha wa dukhai ma hunuhuncha, bharosa garne thulo manis lai bhannus wa doctor kaha janus.",
      "Yadi kehi thik lagena bhane, ekjana thulo manis sanga madat magnus.",
      "Didhara paryo bhane, bharosa garne manis sanga kura garnus wa doctor sanga janus.",
      "Dukhai ya dara lagyo bhane, abilai parent, teacher, wa doctor sanga kura garnus.",
      "Hajur ko swasthya mahatwapurna ho! Kehi galat lagyo bhane, bharosa garne manis sanga madat magnus."
    ]
  },
  crisis: {
    en: [
      "I'm really concerned about you. Please talk to a trusted adult, counselor, or call a crisis helpline immediately. You deserve help and support.",
      "This sounds serious. Please reach out to someone you trust - a parent, teacher, counselor, or call emergency services if you're in immediate danger.",
      "You're not alone and this is not your fault. Please contact a crisis helpline or trusted adult right away for help."
    ],
    ne: [
      "Ma hajur ko bare ma dherai chintit chu. Kripaya bharosa garne thulo manis, counselor, wa crisis helpline ma call garnus. Hajur lai madat chahiye.",
      "Yo gambhir lagcha. Kripaya bharosa garne manis - parent, teacher, counselor sanga kura garnus wa emergency ma call garnus.",
      "Hajur ekai hunuhunna ra yo hajur ko galti hoina. Kripaya crisis helpline wa bharosa garne manis sanga contact garnus."
    ]
  },
  referral: {
    en: [
    "For personal advice about your specific situation, it's best to talk to a doctor or trusted adult.",
    "A doctor can give you better advice for your individual needs.",
    "It's always good to talk to a grown-up you trust about these important things."
    ],
    ne: [
      "Hajur ko byaktigat awastha ko lagi, doctor wa bharosa garne thulo manis sanga kura garnu ramro.",
      "Doctor le hajur ko awastha anusar ramro salah dinchha.",
      "Yesto mahatwapurna kura ma bharosa garne thulo manis sanga kura garnu ramro."
    ]
  }
};

// --- Enhanced language detection for Roman Nepali ---
const isRomanNepali = (text) => {
  const lowerText = text.toLowerCase();
  const nepaliPatterns = [
    'ke chha', 'kese chha', 'kasto chha', 'k cha', 'k xa',
    'mero', 'mera', 'tapai', 'hajur', 'hami', 'hamilai',
    'ghar', 'khana', 'pani', 'paani', 'khane', 'jaane',
    'huncha', 'hunchha', 'garchu', 'garnu', 'garne',
    'thik', 'ramro', 'naamro', 'sajilo', 'garo',
    'kura', 'kaam', 'samay', 'din', 'raat', 'bihaan',
    'cha', 'chha', 'xa', 'ho', 'hola', 'hoina', 'haina',
    'malai', 'timilai', 'uslai', 'hamlai', 'uniharu',
    'yaha', 'tyaha', 'kaha', 'kahaa', 'katai',
    'kina', 'kinaki', 'kasto', 'kati', 'kun',
    'afno', 'afnai', 'hamro', 'timro', 'usko',
    'dherai', 'ali', 'thorai', 'sab', 'sabai',
    'aaja', 'bholi', 'hijo', 'parsi', 'ahile',
    'paila', 'pachhi', 'agadi', 'paxadi',
    'sharir', 'ang', 'samashya', 'prashna', 'jawab',
    'normal', 'samanya', 'thik', 'galat', 'ramro',
    'badhne', 'badhdai', 'hurdai', 'dekhdai',
    'period', 'mahawari', 'blood', 'ragat',
    'breast', 'stan', 'penis', 'youn', 'ling',
    'masturbation', 'haath', 'chune', 'chhune',
    'doctor', 'daktar', 'hospital', 'aushadhi',
    'dukhi', 'khusi', 'dar', 'darr', 'chinta',
    'sathi', 'sahara', 'madat', 'help'
  ];
  const phoneticPatterns = [
    /[aeiou]h/, /[iaou]i/, /au/, /ou/, /ai/, /ei/,
    /ch/, /jh/, /th/, /dh/, /ph/, /bh/, /sh/, /gh/, /kh/,
    /ng/, /ny/, /chh/, /jhh/, /tth/, /ddh/, /pph/, /bbh/,
    /nch/, /ngh/, /ndh/, /mph/, /mbh/,
    /aa/, /ee/, /oo/, /uu/
  ];
  const hasNepaliWords = nepaliPatterns.some(pattern => lowerText.includes(pattern));
  const hasPhoneticPatterns = phoneticPatterns.some(pattern => pattern.test(lowerText));
  const hasDevanagariTransliteration = /[aeiou]{2,}|[bcdfghjklmnpqrstvwxyz]{2,}h/.test(lowerText);
  return hasNepaliWords || (hasPhoneticPatterns && hasDevanagariTransliteration);
};

// --- Enhanced crisis detection ---
const detectCrisis = (message) => {
  const lowerMessage = message.toLowerCase();
  const abuseKeywords = [
    'abuse', 'abused', 'assault', 'assaulted', 'rape', 'raped', 'molest', 'molested',
    'touch me', 'touched me', 'hurt me', 'hurting me', 'force', 'forced',
    'uncle', 'relative', 'family member', 'teacher', 'coach', 'older person',
    'secret', "don't tell", 'our secret', 'threatened', 'scared',
    'uncomfortable touch', 'private parts', 'inappropriate', 'wrong touch'
  ];
  const mentalHealthKeywords = [
    'kill myself', 'suicide', 'suicidal', 'want to die', 'end my life',
    'hurt myself', 'self harm', 'cut myself', 'harm myself',
    'worthless', 'hopeless', "can't take it", 'want to disappear',
    'nobody cares', 'better off dead', 'end the pain'
  ];
  const pornInfluenceKeywords = [
    'like in porn', 'saw in video', 'online video', 'explicit video',
    'try what i saw', 'do what they do', 'porn movie', 'adult video',
    'extreme', 'violent sex', 'rough', 'painful sex'
  ];
  return {
    abuse: abuseKeywords.some(keyword => lowerMessage.includes(keyword)),
    mentalHealth: mentalHealthKeywords.some(keyword => lowerMessage.includes(keyword)),
    pornInfluence: pornInfluenceKeywords.some(keyword => lowerMessage.includes(keyword))
  };
};

// --- Enhanced getFallbackResponse with PCOS/body hair, crisis, gender, language ---
const getFallbackResponse = (userMessage) => {
  // --- Language detection: English vs Roman Nepali ---
  const isNepali = isRomanNepali(userMessage);
  const lang = isNepali ? 'ne' : 'en';
  const message = userMessage.toLowerCase();
  const crisis = detectCrisis(message);

  // Ensure fallback always uses correct language
  // All direct string responses and array lookups use lang

  if (crisis.abuse) {
    return (isNepali
      ? "Ma hajur ko bare ma dherai chintit chu. Yo hajur ko galti hoina. Kripaya bharosa garne thulo manis - parent, teacher, counselor, wa police sanga turantai kura garnus. Hajur lai madat chahiye ra hajur ekai hunuhunna." + getRelevantHelplines('abuse', 'ne')
      : "I'm very concerned about you. This is NOT your fault. Please talk to a trusted adult - parent, teacher, counselor, or police immediately. You deserve help and you're not alone." + getRelevantHelplines('abuse', 'en'));
  }
  if (crisis.mentalHealth) {
    return (isNepali
      ? "Ma hajur ko bare ma dherai chintit chu. Hajur ko jindagi mahatwapurna chha. Kripaya bharosa garne manis sanga turantai kura garnus wa suicide prevention helpline ma call garnus. Hajur ekai hunuhunna ra madat paunu sakchha." + getRelevantHelplines('mentalHealth', 'ne')
      : "I'm very worried about you. Your life is valuable and important. Please talk to someone you trust right away or call a suicide prevention helpline. You're not alone and help is available." + getRelevantHelplines('mentalHealth', 'en'));
  }
  if (crisis.pornInfluence) {
    return (isNepali
      ? "Online ma dekhine video haru real life jastai hudaina. Healthy relationship ma respect ra consent huncha. Kripaya bharosa garne thulo manis sanga yo kura bare ma kura garnus."
      : "Videos online don't show what real, healthy relationships are like. Real intimacy involves respect and consent. Please talk to a trusted adult about healthy relationships.");
  }
  // Greetings
  if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('namaste')) {
    return FALLBACK_RESPONSES.greetings[lang][Math.floor(Math.random() * FALLBACK_RESPONSES.greetings[lang].length)];
  }

  // Masturbation (example)
  if (message.includes('masturbation') || message.includes('masturbate') || message.includes('touching yourself') || message.includes('afule chune')) {
    if (isNepali) {
      if (message.includes('k ho') || message.includes('arth')) {
        return "Masturbation afno gopya angalai khusi ko lagi chunu ho. Yo hajur ko sharir lai bujhne ra ramro mahasus garne samanya tarika ho.";
      } else if (message.includes('kati choti') || message.includes('frequency')) {
        return "Tyesko kunai nischit sankhya chaina - hajurlai jasto comfortable lagcha tyastai garnus. Kohi le daily garchan, aru le biralai. Afno sharir ko kura sunnus!";
      } else if (message.includes('ramro cha') || message.includes('healthy')) {
        return "Ho, yo healthy ra samanya ho! Yesle hajur lai afno sharir bare sikhna, tanaav kam garna, ra ramro mahasus garna madat garcha. Laj mannu pardaina.";
      } else if (message.includes('kharab cha') || message.includes('hani')) {
        return "Hoina, yo kei pani kharab chaina! Yo purai surakshit ra samanya ho. Yesle hajurlai dukha dinna wa kunai swasthya samasya lagdaina.";
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

// --- Nepal-specific helpline selection by crisis type ---
const getRelevantHelplines = (type, lang = 'en') => {
  if (type === 'abuse') {
    return lang === 'ne'
      ? `\n\nMahatwapurna madat ko number haru (Nepal):\n- Emergency/Police: 100, 112 (24 ghanta)\n- TPO Nepal: Text +977 9847386158, Call +977 16600102005 (samvedanshil sahayog)\n- Suicide Prevention: 1166 (8am-8pm)`
      : `\n\nImportant help numbers (Nepal):\n- Emergency/Police: 100, 112 (24hr)\n- TPO Nepal: Text +977 9847386158, Call +977 16600102005 (emotional support)\n- Suicide Prevention: 1166 (8am-8pm)`;
  }
  if (type === 'mentalHealth') {
    return lang === 'ne'
      ? `\n\nMahatwapurna mental health madat (Nepal):\n- Suicide Prevention Helpline: 1166 (8am-8pm)\n- TUTH Suicide Hotline: 16600121600 (24 ghanta)\n- Mental Health Helpline Nepal: 1660-0133666 (8am-8pm)\n- Patan Hospital Suicide Hotline: 9813476123\n- TPO Nepal: Text +977 9847386158, Call +977 16600102005`
      : `\n\nImportant mental health help (Nepal):\n- Suicide Prevention Helpline: 1166 (8am-8pm)\n- TUTH Suicide Hotline: 16600121600 (24hr)\n- Mental Health Helpline Nepal: 1660-0133666 (8am-8pm)\n- Patan Hospital Suicide Hotline: 9813476123\n- TPO Nepal: Text +977 9847386158, Call +977 16600102005`;
  }
  if (type === 'emergency') {
    return lang === 'ne'
      ? `\n\nNepal Emergency Hotline: 100, 112 (24 ghanta)`
      : `\n\nNepal Emergency Hotline: 100, 112 (24hr)`;
  }
  if (type === 'generalMental') {
    return lang === 'ne'
      ? `\n\nManosamajik madat (Nepal):\n- CMC Hotline: 16600185080\n- Mental Health Promotion & Suicide Prevention Center: +977-01-441264 (mhpspc.org.np)`
      : `\n\nPsychosocial support (Nepal):\n- CMC Hotline: 16600185080\n- Mental Health Promotion & Suicide Prevention Center: +977-01-441264 (mhpspc.org.np)`;
  }
  return '';
};

export default function ChatbotPage() {
  const [conversation, setConversation] = useState([
    {
      sender: "bot",
      text: "Hey! I'm here to help with your body questions. Growing up can be confusing - ask me anything! Everything is private and anonymous. If you need immediate help or are in crisis, please call 1660 01 13 22 71 (for Nepal)."
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

  // --- handleSubmit: check for crisis, language, and add language instruction to prompt ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setLoading(true);
    setShowStop(true);
    setShowSend(false);
    try {
      setConversation((prev) => [...prev, { sender: "user", text: userMsg }]);
      // Check for crisis situations immediately
      const crisis = detectCrisis(userMsg);
      if (crisis.abuse || crisis.mentalHealth || crisis.pornInfluence) {
        const crisisResponse = getFallbackResponse(userMsg);
        setConversation((prev) => [...prev, { sender: "bot", text: "" }]);
        await typeWriterEffect(crisisResponse);
        return;
      }
      if (apiAvailable) {
        const updatedConversation = [...conversation, { sender: "user", text: userMsg }];
        const conversationHistory = updatedConversation
          .filter(msg => msg.sender === "user" || msg.sender === "bot")
          .map(msg => `${msg.sender === "user" ? "User" : "Assistant"}: ${msg.text}`)
          .join("\n");
        const languageInstruction = isRomanNepali(userMsg) ?
          "\n\nIMPORTANT: The user asked in Roman Nepali. You MUST respond in Roman Nepali, not English." :
          "\n\nIMPORTANT: The user asked in English. You MUST respond in English, not Roman Nepali.";
        const educationalContext = `As a sexual health educator for adolescents, I'm asked about this topic. Please provide a simple, factual answer about this for a 12-18 year old, focusing on what is normal and healthy for adolescent development.`;
        const fullPrompt = `${SYSTEM_PROMPT}\n\nPrevious conversation:\n${conversationHistory}\n\nUser: ${userMsg}\n\n${educationalContext}${languageInstruction}\n\nAssistant:`;
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
            if (data.answer && data.answer.trim().length > 10 && !isRefusalResponse(data.answer)) {
              setConversation((prev) => [...prev, { sender: "bot", text: "" }]);
              await typeWriterEffect(data.answer);
              return;
            } else {
              // Retry with more explicit educational framing
              const enhancedPrompt = `${SYSTEM_PROMPT}\n\nPrevious conversation:\n${conversationHistory}\n\nUser: ${userMsg}\n\nAs a sexual health educator, I need to provide accurate, supportive information about this topic for adolescents. This is a normal part of human development and healthy bodily function. Please provide a simple, factual answer that helps young people understand their bodies safely.${languageInstruction}\n\nAssistant:`;
              try {
                const retryRes = await fetch(GEMINI_PROXY_URL, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ message: enhancedPrompt })
                });
                if (retryRes.ok) {
                  const retryData = await retryRes.json();
                  if (retryData.answer && retryData.answer.trim().length > 10 && !isRefusalResponse(retryData.answer)) {
                    setConversation((prev) => [...prev, { sender: "bot", text: "" }]);
                    await typeWriterEffect(retryData.answer);
                    return;
                  }
                }
              } catch (retryError) {}
              // Fallback if retry fails
              const fallbackResponse = getFallbackResponse(userMsg);
              setConversation((prev) => [...prev, { sender: "bot", text: "" }]);
              await typeWriterEffect(fallbackResponse);
              return;
            }
          } else {
            setApiAvailable(false);
          }
        } catch (fetchError) {
          setApiAvailable(false);
        }
      }
      if (apiAvailable) {
        setApiAvailable(false);
      }
      const fallbackResponse = getFallbackResponse(userMsg);
      setConversation((prev) => [...prev, { sender: "bot", text: "" }]);
      await typeWriterEffect(fallbackResponse);
    } catch (err) {
      if (apiAvailable) {
        setApiAvailable(false);
      }
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
