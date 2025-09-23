export const BOT_MESSAGES = {
  en: {
    hello: "Hi! I'm your MindFulness assistant. How can I help?",
    placeholder: "Type a message",
    nudge: "Need help? Try our chatbot!",
    crisis: "If you feel unsafe, tap Crisis Alert or call your local helpline.",
    help: "You can choose Self Help, Peer Support, or Counselor from Support.",
    breathe: "Try a 5-minute breathing exercise in Self Help → Meditation.",
    default: "Thanks for sharing. I'm listening.",
  },
  hi: {
    hello: "नमस्ते! मैं MindFulness सहायक हूँ। मैं आपकी कैसे मदद कर सकता/सकती हूँ?",
    placeholder: "यहाँ लिखें",
    nudge: "मदद चाहिए? चैटबॉट आज़माएँ!",
    crisis: "यदि आप असुरक्षित महसूस कर रहे हैं, तो Crisis Alert दबाएँ।",
    help: "आप Self Help, Peer Support, या Counselor चुन सकते हैं।",
    breathe: "Self Help → Meditation में 5 मिनट का श्वास व्यायाम आज़माएँ।",
    default: "धन्यवाद, मैं आपकी बात समझ रहा/रही हूँ।",
  },
  ta: {
    hello: "வணக்கம்! நான் உங்கள் MindFulness உதவியாளர். நான் உங்களுக்கு எப்படி உதவ முடியும்?",
    placeholder: "உங்கள் செய்தியை உள்ளிடவும்",
    nudge: "உதவி தேவையா? எங்கள் சாட்பாடை முயற்சிக்கவும்!",
    crisis: "நீங்கள் பாதுகாப்பற்றதாக உணர்ந்தால், Crisis Alert ஐ அழுத்தவும்.",
    help: "நீங்கள் சுய உதவி, சக ஆதரவு அல்லது ஆலோசகர் ஆகியவற்றைத் தேர்ந்தெடுக்கலாம்.",
    breathe: "சுய உதவி → தியானத்தில் 5 நிமிட மூச்சு பயிற்சியை முயற்சிக்கவும்.",
    default: "பகிர்ந்து கொண்டதற்கு நன்றி. நான் கேட்டுக்கொண்டிருக்கிறேன்.",
  },
  te: {
    hello: "నమస్కారం! నేను మీ MindFulness సహాయకుడిని. నేను మీకు ఎలా సహాయం చేయగలను?",
    placeholder: "మీ సందేశాన్ని ఇక్కడ టైప్ చేయండి",
    nudge: "సహాయం కావాలా? మా చాట్‌బాట్‌ని ప్రయత్నించండి!",
    crisis: "మీరు అసురక్షితంగా భావిస్తే, Crisis Alert నొక్కండి.",
    help: "మీరు స్వీయ సహాయం, సహచర మద్దతు లేదా కౌన్సిలర్‌ను ఎంచుకోవచ్చు.",
    breathe: "స్వీయ సహాయం → ధ్యానంలో 5 నిమిషాల శ్వాస వ్యాయామం ప్రయత్నించండి.",
    default: "షేర్ చేసినందుకు ధన్యవాదాలు. నేను వింటున్నాను.",
  },
  bn: {
    hello: "হ্যালো! আমি আপনার MindFulness সহায়ক। আমি আপনাকে কিভাবে সাহায্য করতে পারি?",
    placeholder: "আপনার বার্তা লিখুন",
    nudge: "সাহায্য দরকার? আমাদের চ্যাটবট চেষ্টা করুন!",
    crisis: "আপনি যদি অসহায় বোধ করেন, তাহলে Crisis Alert টিপুন।",
    help: "আপনি সেল্ফ হেল্প, পিয়ার সাপোর্ট বা কাউন্সেলর বেছে নিতে পারেন।",
    breathe: "সেল্ফ হেল্প → মেডিটেশনে ৫ মিনিটের শ্বাস-প্রশ্বাসের ব্যায়াম চেষ্টা করুন।",
    default: "শেয়ার করার জন্য ধন্যবাদ। আমি শুনছি।",
  },
}

const INTENTS = [
  { 
    key: 'crisis', 
    patterns: [
      /suicid|hurt|unsafe|danger/i, 
      /आत्महत्या|खतरा|असुरक्षित/i,
      /தற்கொலை|ஆபத்து|பாதுகாப்பற்ற/i,
      /ఆత్మహత్య|ప్రమాదం|అసురక్షితం/i,
      /আত্মহত্যা|বিপদ|অসুরক্ষিত/i
    ] 
  },
  { 
    key: 'help', 
    patterns: [
      /help|support|assist/i, 
      /मदद|सहायता/i,
      /உதவி|ஆதரவு/i,
      /సహాయం|మద్దతు/i,
      /সাহায্য|সহায়তা/i
    ] 
  },
  { 
    key: 'breathe', 
    patterns: [
      /anx|anxiety|panic|breathe/i, 
      /घबराहट|सांस/i,
      /கவலை|மூச்சு/i,
      /ఆందోళన|ఊపిరి/i,
      /উদ্বেগ|শ্বাস/i
    ] 
  },
]

export function detectLanguage(text) {
  // Detect language based on character ranges
  if (/[\u0900-\u097F]/.test(text)) return 'hi'  // Hindi
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta'  // Tamil
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te'  // Telugu
  if (/[\u0980-\u09FF]/.test(text)) return 'bn'  // Bengali
  return 'en'  // Default to English
}

export function replyFor(text, lang='en') {
  const pack = BOT_MESSAGES[lang] || BOT_MESSAGES.en
  if (!text.trim()) return pack.default
  for (const intent of INTENTS) {
    if (intent.patterns.some(p=>p.test(text))) return pack[intent.key] || pack.default
  }
  return pack.default
}


