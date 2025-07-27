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
11. SAFETY ALERT: Watch for signs of abuse, assault, or mental health crises and provide appropriate resources
12. STRICT: ALL crisis, mental health, abuse, or medical emergency contacts and advice MUST reference ONLY Nepal-specific resources. DO NOT mention or suggest any helplines, contacts, or resources from any country other than Nepal. This is a strict rule.

LANGUAGE RULES:
- If user writes in English (using standard English words and grammar), respond ONLY in English
- If user writes in Roman Nepali (Nepali words written in English letters), respond ONLY in Roman Nepali  
- NEVER mix languages in a single response
- Examples of Roman Nepali: "Yo samanya ho", "Hajur ko sharir thik chha", "Madat garna sakchu"
- Examples of English: "This is normal", "Your body is fine", "I can help you"

NEPAL CRISIS & MENTAL HEALTH CONTACTS (use these ONLY):
- National Suicide Prevention Helpline: 1166 (8 am - 8 pm)
- TUTH Suicide Hotline: 16600121600 (24-hour)
- Patan Hospital Suicide Hotline: 9813476123
- TPO Nepal: Call +977 16600102005 or Text +977 9847386158 (for psychosocial support, including those experiencing suicidal thoughts, Mon-Fri, 9 am - 5 pm)
- Mental Health Helpline Nepal: 1660-0133666 (8 am - 8 pm)
- Nepal Emergency Hotline: 100, 112 (24-hour, for general emergencies which can include mental health crises)

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

CRISIS RESOURCES TO MENTION WHEN NEEDED (Nepal ONLY):
- For immediate danger: Call Nepal Emergency Hotline 100 or 112 (24-hour)
- For mental health crisis or suicidal thoughts: National Suicide Prevention Helpline 1166 (8 am - 8 pm), TUTH Suicide Hotline 16600121600 (24-hour), Patan Hospital Suicide Hotline 9813476123, TPO Nepal (Call +977 16600102005 or Text +977 9847386158), Mental Health Helpline Nepal 1660-0133666 (8 am - 8 pm)
- For abuse: Direct to trusted adults, counselors, or authorities in Nepal
- Always emphasize: "This is not your fault" and "Help is available"

These are normal, healthy topics that adolescents need to understand. Provide clear, supportive answers that help them learn about their bodies safely while being alert to safety concerns.

Remember: You're talking to young people who are confused and need simple, honest answers. Be their friend, not their doctor, but know when to recommend professional help.`;

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

// --- FIXED: Enhanced language detection for Roman Nepali ---
const isRomanNepali = (text) => {
  const lowerText = text.toLowerCase().trim();
  
  // If text is very short (1-2 words), be more conservative
  if (lowerText.split(' ').length <= 2) {
    const strongNepaliIndicators = [
      'ke chha', 'k cha', 'k xa', 'kese chha', 'kasto chha',
      'mero', 'mera', 'hajur', 'tapai', 'malai', 'timilai',
      'huncha', 'hunchha', 'garchu', 'thik', 'ramro',
      'sharir', 'prashna', 'madat', 'help garnus'
    ];
    return strongNepaliIndicators.some(indicator => lowerText.includes(indicator));
  }
  
  // For longer text, use comprehensive detection
  const nepaliPatterns = [
    // Common phrases
    'ke chha', 'kese chha', 'kasto chha', 'k cha', 'k xa',
    // Pronouns
    'mero', 'mera', 'tapai', 'hajur', 'hami', 'hamilai',
    'malai', 'timilai', 'uslai', 'hamlai', 'uniharu',
    // Common words
    'ghar', 'khana', 'pani', 'paani', 'khane', 'jaane',
    'huncha', 'hunchha', 'garchu', 'garnu', 'garne',
    'thik', 'ramro', 'naamro', 'sajilo', 'garo',
    'kura', 'kaam', 'samay', 'din', 'raat', 'bihaan',
    'cha', 'chha', 'xa', 'ho', 'hola', 'hoina', 'haina',
    // Location words
    'yaha', 'tyaha', 'kaha', 'kahaa', 'katai',
    // Question words
    'kina', 'kinaki', 'kasto', 'kati', 'kun',
    // Possessive
    'afno', 'afnai', 'hamro', 'timro', 'usko',
    // Quantity
    'dherai', 'ali', 'thorai', 'sab', 'sabai',
    // Time
    'aaja', 'bholi', 'hijo', 'parsi', 'ahile',
    'paila', 'pachhi', 'agadi', 'paxadi',
    // Health/body terms
    'sharir', 'ang', 'samashya', 'prashna', 'jawab',
    'normal', 'samanya', 'galat', 'badhne', 'badhdai',
    'period', 'mahawari', 'blood', 'ragat',
    'breast', 'stan', 'penis', 'youn', 'ling',
    'masturbation', 'haath', 'chune', 'chhune',
    'doctor', 'daktar', 'hospital', 'aushadhi',
    'dukhi', 'khusi', 'dar', 'darr', 'chinta',
    'sathi', 'sahara', 'madat'
  ];
  
  // Phonetic patterns common in Roman Nepali
  const phoneticPatterns = [
    /[aeiou]h/, /[iaou]i/, /au/, /ou/, /ai/, /ei/,
    /ch/, /jh/, /th/, /dh/, /ph/, /bh/, /sh/, /gh/, /kh/,
    /ng/, /ny/, /chh/, /jhh/, /tth/, /ddh/, /pph/, /bbh/,
    /nch/, /ngh/, /ndh/, /mph/, /mbh/,
    /aa/, /ee/, /oo/, /uu/
  ];
  
  // Count matches
  const nepaliWordMatches = nepaliPatterns.filter(pattern => lowerText.includes(pattern)).length;
  const phoneticMatches = phoneticPatterns.filter(pattern => pattern.test(lowerText)).length;
  
  // Scoring system
  const totalWords = lowerText.split(' ').length;
  const nepaliScore = nepaliWordMatches / totalWords;
  const phoneticScore = phoneticMatches / Math.max(totalWords, 5);
  
  // Decision logic
  if (nepaliWordMatches >= 2) return true; // Strong Nepali indicators
  if (nepaliScore > 0.3) return true; // High ratio of Nepali words
  if (phoneticMatches >= 3 && phoneticScore > 0.2) return true; // Phonetic patterns
  
  return false;
};

// --- ADDED: Search detection function for grounding ---
const needsGroundingSearch = (message) => {
  const groundingTriggers = [
    // Recent/current information
    'latest', 'recent', 'current', 'new', 'updated', 'nowadays', 'today',
    'this year', '2024', '2025', 'recent research', 'latest study',
    'current statistics', 'recent data', 'updated guidelines',
    
    // Health trends and developments
    'latest research on', 'recent findings about', 'current trends in',
    'new developments', 'updated information about', 'recent studies show',
    
    // Specific current queries
    'what\'s happening now', 'current situation', 'present day',
    'modern research', 'contemporary studies'
  ];
  
  const lowerMessage = message.toLowerCase();
  return groundingTriggers.some(trigger => lowerMessage.includes(trigger));
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

// --- UPDATED: Nepal helpline numbers and descriptions ---
const getRelevantHelplines = (type, lang = 'en') => {
  if (type === 'abuse') {
    return lang === 'ne'
      ? `\n\nमहत्‍वपूर्ण सहायता नम्बरहरू (नेपाल):\n- नेपाल आपतकालीन हेल्पलाइन: 100, 112 (२४ घण्टा)\n- TPO Nepal: Text +977 9847386158, Call +977 16600102005 (नि:शुल्क, गोप्य, सहानुभूतिपूर्ण सहयोग)\n- आत्महत्या रोकथामको लागि राष्ट्रिय हेल्पलाइन: 1166 (८ बजे बिहानदेखि ८ बजे साँझ)\n- Mental Health Helpline Nepal: 1660-0133666 (८ बजे बिहानदेखि ८ बजे साँझ)\n- Patan Hospital Suicide Hotline: 9813476123\n- CMC Hotline: 16600185080\n- Mental Health Promotion & Suicide Prevention Center: +977-01-441264 (mhpspc.org.np)`
      : `\n\nImportant help numbers (Nepal):\n- Nepal Emergency Hotline: 100, 112 (24hr)\n- TPO Nepal: Text +977 9847386158, Call +977 16600102005 (free, confidential, compassionate support)\n- National Suicide Prevention Helpline: 1166 (8am-8pm)\n- Mental Health Helpline Nepal: 1660-0133666 (8am-8pm)\n- Patan Hospital Suicide Hotline: 9813476123\n- CMC Hotline: 16600185080\n- Mental Health Promotion & Suicide Prevention Center: +977-01-441264 (mhpspc.org.np)`;
  }
  if (type === 'mentalHealth') {
    return lang === 'ne'
      ? `\n\nमहत्‍वपूर्ण मानसिक स्वास्थ्य सहायता (नेपाल):\n- आत्महत्या रोकथामको लागि राष्ट्रिय हेल्पलाइन: 1166 (८ बजे बिहानदेखि ८ बजे साँझ)\n- TUTH Suicide Hotline: 16600121600 (२४ घण्टा)\n- Mental Health Helpline Nepal: 1660-0133666 (८ बजे बिहानदेखि ८ बजे साँझ)\n- Patan Hospital Suicide Hotline: 9813476123\n- TPO Nepal: Text +977 9847386158, Call +977 16600102005\n- Mental Health Promotion & Suicide Prevention Center: +977-01-441264 (mhpspc.org.np)\n- CMC Hotline: 16600185080`
      : `\n\nImportant mental health help (Nepal):\n- National Suicide Prevention Helpline: 1166 (8am-8pm)\n- TUTH Suicide Hotline: 16600121600 (24hr)\n- Mental Health Helpline Nepal: 1660-0133666 (8am-8pm)\n- Patan Hospital Suicide Hotline: 9813476123\n- TPO Nepal: Text +977 9847386158, Call +977 16600102005\n- Mental Health Promotion & Suicide Prevention Center: +977-01-441264 (mhpspc.org.np)\n- CMC Hotline: 16600185080`;
  }
  if (type === 'emergency') {
    return lang === 'ne'
      ? `\n\nनेपाल आपतकालीन हेल्पलाइन: 100, 112 (२४ घण्टा)`
      : `\n\nNepal Emergency Hotline: 100, 112 (24hr)`;
  }
  if (type === 'generalMental') {
    return lang === 'ne'
      ? `\n\nमानसिक स्वास्थ्य सहायता (नेपाल):\n- CMC Hotline: 16600185080\n- Mental Health Promotion & Suicide Prevention Center: +977-01-441264 (mhpspc.org.np)`
      : `\n\nPsychosocial support (Nepal):\n- CMC Hotline: 16600185080\n- Mental Health Promotion & Suicide Prevention Center: +977-01-441264 (mhpspc.org.np)`;
  }
  return '';
};

// --- FIXED: Enhanced getFallbackResponse with better language detection ---
const getFallbackResponse = (userMessage) => {
  // --- FIXED: Better language detection ---
  const isNepali = isRomanNepali(userMessage);
  const lang = isNepali ? 'ne' : 'en';
  const message = userMessage.toLowerCase();
  const crisis = detectCrisis(message);

  // Suicide thoughts: answer in the same language as the question, only Nepal helplines
  if (
    message.includes('suicide') ||
    message.includes('suicidal') ||
    message.includes('kill myself') ||
    message.includes('want to die') ||
    message.includes('end my life') ||
    message.includes('hurt myself') ||
    message.includes('self harm') ||
    message.includes('cut myself') ||
    message.includes('harm myself') ||
    message.includes('worthless') ||
    message.includes('hopeless') ||
    message.includes("can't take it") ||
    message.includes('want to disappear') ||
    message.includes('nobody cares') ||
    message.includes('better off dead') ||
    message.includes('end the pain')
  ) {
    if (isNepali) {
      return `Suscide thoughts haru aayeko chha bhane, timi eklai chainau. Yasto soch aaunu common ho, ra help available chha. Timro school ko counselor, family member, or trusted adult sanga kura gara. Urgent help chahiyo bhane, 1166 (National Suicide Prevention Helpline), 1660-0133666 (Mental Health Helpline Nepal), 16600121600 (TUTH Suicide Hotline), 9813476123 (Patan Hospital Suicide Hotline), ya TPO Nepal (Text +977 9847386158, Call +977 16600102005) ma call gara. Timi important chhau.`;
    } else {
      return `If you are having suicide thoughts, you are not alone. It's common to feel this way, and help is available. Please talk to your school counselor, a family member, or a trusted adult. For urgent help in Nepal, call 1166 (National Suicide Prevention Helpline), 1660-0133666 (Mental Health Helpline Nepal), 16600121600 (TUTH Suicide Hotline), 9813476123 (Patan Hospital Suicide Hotline), or TPO Nepal (Text +977 9847386158, Call +977 16600102005). You are important.`;
    }
  }

  // Crisis responses with updated helplines
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

  // Masturbation responses
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

  // Period responses
  if (message.includes('period') || message.includes('menstruation') || message.includes('mensuration') || message.includes('mahawari')) {
    if (isNepali) {
      return "Period bhanne ke ho bhane hajur ko uterus bata har mahina ragat ra tissue niskine process ho. Yo keti haru ko lagi samanya ho ra badhne process ko bhag ho.";
    } else {
      return "Periods are when your body gets rid of blood and tissue from your uterus each month. It's normal for girls and part of growing up.";
    }
  }

  // Wet dreams
  if (message.includes('wet dream') || message.includes('wet dreams') || message.includes('night discharge')) {
    if (isNepali) {
      return "Wet dreams keta haru ko lagi samanya ho. Sutda hajur ko sharir bata fluid niskine ho - yo bilkul natural ho ra chinta garne kura hoina.";
    } else {
      return "Wet dreams are normal for boys. Your body releases fluid while you sleep - it's totally natural and nothing to worry about.";
    }
  }

  // Erections
  if (message.includes('erection') || message.includes('erections') || message.includes('hard')) {
    if (isNepali) {
      return "Erections samanya ho ra penis ma ragat jane waqt huncha. Yo badhne process ko bhag ho ra lajjit hunu parne kura hoina.";
    } else {
      return "Erections are normal and happen when blood flows to your penis. They're part of growing up and nothing to be embarrassed about.";
    }
  }

  // Penis size questions
  if (message.includes('penis') || message.includes('penis size') || message.includes('small penis') || message.includes('ling')) {
    if (isNepali) {
      if (message.includes('ideal') || message.includes('average') || message.includes('normal size')) {
        return "Koi 'ideal' penis size hudaina! Penis sabai shape ra size ma huncha. Mahatwapurna kura healthy hunu ra afno sharir sanga comfortable hunu ho. Size le kei important kura nirdharit gardaina.";
      } else if (message.includes('small') || message.includes('problem') || message.includes('sano')) {
        return "Sano penis bilkul samanya ho! Dherai keta haru size ko chinta garchan, tara yo health wa relationship ko lagi mahatwa rakhdaina. Hajur ko sharir perfect cha jasto cha!";
      } else {
        return "Penis size dherai farak huncha manche haru ma. Koi 'right' size hudaina - sabai different chan ra yo bilkul samanya ho!";
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

  // Breast development
  if (message.includes('breast') || message.includes('breasts') || message.includes('boobs') || message.includes('stan')) {
    if (isNepali) {
      if (message.includes('small') || message.includes('big') || message.includes('size') || message.includes('sano') || message.includes('thulo')) {
        return "Breast size dherai farak huncha! Kehi keti haru ko sano breast huncha, aru ko thulo. Duitai bilkul samanya ra sundara ho. Hajur ko size hajur ko lagi perfect cha!";
      } else if (message.includes('bigger') || message.includes('grow') || message.includes('badhne')) {
        return "Breast size mostly genes le nirdharit garcha. Hajur le tiniharulai thulo banaauna sakdaina, tara yo bilkul thik cha! Sano breast thulo jasti nai samanya ra sundara ho.";
      } else {
        return "Breast development keti haru ko lagi puberty ko time ma samanya ho. Tiniharuko growth rate ra size different huncha - sabai different chan!";
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

  // Discharge
  if (message.includes('discharge') || message.includes('white stuff') || message.includes('safed paani')) {
    if (isNepali) {
      return "Vaginal discharge samanya ho ra hajur ko vagina lai sapha ra swasthya rakhna madat garcha. Yo hajur ko sharir ko sapha rahne tarika ho.";
    } else {
      return "Vaginal discharge is normal and helps keep your vagina clean and healthy. It's your body's way of staying clean.";
    }
  }

  // Puberty topics
  if (message.includes('puberty') || message.includes('growing up') || message.includes('body changes') || message.includes('badhne')) {
    if (isNepali) {
      return "Puberty hajur ko sharir bachha dekhi adult ma change hune time ho. Hajur lambai badhchha, naya body parts develop hunchha, ra hajur ko feelings pani change huna sakcha. Yo sabai samanya ho!";
    } else {
      return "Puberty is when your body changes from a child to an adult. You'll grow taller, develop new body parts, and your feelings might change. It's all normal!";
    }
  }

  // Voice changes
  if (message.includes('voice') || message.includes('voice change') || message.includes('voice cracking') || message.includes('awaz')) {
    if (isNepali) {
      return "Voice changes keta haru ko lagi puberty ko time ma samanya ho. Hajur ko awaz crack huna sakcha wa gahiro huna sakcha. Yo hajur ko sharir badhne process ho!";
    } else {
      return "Voice changes are normal for boys during puberty. Your voice might crack or get deeper. It's just your body growing up!";
    }
  }

  // Emergency keywords
  if (message.includes('emergency') || message.includes('urgent') || message.includes('pain') || message.includes('bleeding') || message.includes('dukhai')) {
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
      text: "Hey! I'm here to help with your body questions. Growing up can be confusing - ask me anything!"
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

  // --- handleSubmit: Enhanced with grounding search functionality ---
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
      
      // Determine expected language early
      const expectedLanguage = isRomanNepali(userMsg) ? 'ne' : 'en';
      console.log(`Expected language: ${expectedLanguage} for input: "${userMsg}"`);
      
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
        
        // Enhanced prompt with grounding instruction
        const useGrounding = needsGroundingSearch(userMsg);
        const groundingInstruction = useGrounding ? 
          "\n\nIMPORTANT: This question requires current/recent information. Please search for and include the latest medical research, statistics, or guidelines related to this topic from reputable health organizations." : "";
        
        const fullPrompt = `${SYSTEM_PROMPT}\n\nPrevious conversation:\n${conversationHistory}\n\nUser: ${userMsg}\n\n${educationalContext}${groundingInstruction}${languageInstruction}\n\nAssistant:`;
        
        // Enhanced request body with grounding parameters
        const requestBody = {
          message: fullPrompt,
          // Enable grounding search
          useGrounding: useGrounding,
          // Optional: specify search parameters
          groundingConfig: {
            enableWebSearch: true,
            searchQueries: useGrounding ? [
              `${userMsg} sexual health medical research`,
              `${userMsg} adolescent health guidelines`,
              `recent studies ${userMsg} puberty development`
            ] : undefined
          }
        };
        
        const fetchPromise = fetch(GEMINI_PROXY_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody)
        });
        
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), 20000); // Increased timeout for search
        });
        
        try {
          // Show search indicator if grounding is used
          if (useGrounding) {
            setConversation((prev) => [...prev, { sender: "bot", text: "🔍 Searching for latest information..." }]);
          }
          
          const res = await Promise.race([fetchPromise, timeoutPromise]);
          
          if (res.ok) {
            const data = await res.json();
            
            // Remove search indicator
            if (useGrounding) {
              setConversation((prev) => prev.slice(0, -1));
            }
            
            if (data.answer && data.answer.trim().length > 10 && !isRefusalResponse(data.answer)) {
              let finalResponse = data.answer;
              
              // Add grounding sources if available
              if (data.groundingSources && data.groundingSources.length > 0) {
                const isNepali = isRomanNepali(userMsg);
                const sourcesHeader = isNepali ? 
                  "\n\n📚 Sources (स्रोतहरू):" : 
                  "\n\n📚 Sources:";
                
                finalResponse += sourcesHeader;
                data.groundingSources.slice(0, 3).forEach((source, index) => {
                  finalResponse += `\n${index + 1}. ${source.title || 'Medical Source'}\n   ${source.url || ''}`;
                });
              }
              
              setConversation((prev) => [...prev, { sender: "bot", text: "" }]);
              await typeWriterEffect(finalResponse);
              return;
            } else {
              // Retry with more explicit grounding request
              const retryBody = {
                message: `Please search for current medical information about: ${userMsg}\n\n${SYSTEM_PROMPT}${languageInstruction}`,
                useGrounding: true,
                groundingConfig: {
                  enableWebSearch: true,
                  requireGrounding: true
                }
              };
              
              try {
                const retryRes = await fetch(GEMINI_PROXY_URL, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(retryBody)
                });
                
                if (retryRes.ok) {
                  const retryData = await retryRes.json();
                  if (retryData.answer && retryData.answer.trim().length > 10 && !isRefusalResponse(retryData.answer)) {
                    let finalResponse = retryData.answer;
                    
                    // Add sources from retry
                    if (retryData.groundingSources && retryData.groundingSources.length > 0) {
                      const isNepali = isRomanNepali(userMsg);
                      const sourcesHeader = isNepali ? "\n\n📚 Sources:" : "\n\n📚 Sources:";
                      finalResponse += sourcesHeader;
                      retryData.groundingSources.slice(0, 3).forEach((source, index) => {
                        finalResponse += `\n${index + 1}. ${source.title}\n   ${source.url}`;
                      });
                    }
                    
                    setConversation((prev) => [...prev, { sender: "bot", text: "" }]);
                    await typeWriterEffect(finalResponse);
                    return;
                  }
                }
              } catch (retryError) {
                console.error('Retry with grounding failed:', retryError);
              }
              
              // Remove search indicator if still showing
              if (useGrounding) {
                setConversation((prev) => prev.slice(0, -1));
              }
              
              // Fallback to regular response
              const fallbackResponse = getFallbackResponse(userMsg);
              setConversation((prev) => [...prev, { sender: "bot", text: "" }]);
              await typeWriterEffect(fallbackResponse);
              return;
            }
          } else {
            // Remove search indicator
            if (useGrounding) {
              setConversation((prev) => prev.slice(0, -1));
            }
            setApiAvailable(false);
          }
        } catch (fetchError) {
          console.error('Grounding search error:', fetchError);
          // Remove search indicator
          if (useGrounding) {
            setConversation((prev) => prev.slice(0, -1));
          }
          setApiAvailable(false);
        }
      }
      
      // Fallback mode
      if (!apiAvailable) {
        console.log("Using fallback mode");
      }
      
      const fallbackResponse = getFallbackResponse(userMsg);
      setConversation((prev) => [...prev, { sender: "bot", text: "" }]);
      await typeWriterEffect(fallbackResponse);
      
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      setApiAvailable(false);
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
