import { Router } from 'express'

const router = Router()

router.post('/chat', async (req, res) => {
  const { messages = [], lang = 'en' } = req.body || {};
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: 'Missing GEMINI_API_KEY' });
  }

  // A more detailed system instruction for better, more empathetic responses
  const systemInstruction = `You are MindFulness, a friendly and empathetic AI mental health companion for university students. Your goal is to be a supportive listener and provide helpful, general guidance in a conversational manner.

Your personality:
- Warm, encouraging, and non-judgmental.
- Patient and understanding.
- Use a natural tone. You can use emojis where appropriate to convey warmth.

Your capabilities:
- Discuss feelings, stress, anxiety, and daily challenges.
- Suggest general wellness techniques like mindfulness, breathing exercises, or journaling, and mention they can be found in the app's "Self-Help" section.
- Provide encouragement and positive affirmations.

**Crucial Safety Guidelines:**
- **You are NOT a therapist.** Do not provide diagnoses, medical advice, or therapy.
- **If the user expresses thoughts of self-harm, suicide, or being in immediate danger, you MUST gently interrupt and provide this EXACT response:** "It sounds like you are going through a lot right now, and your safety is most important. It's really important to talk to someone who can help right away. Please use the 'Crisis Alert' button in the app or call a local helpline immediately. You are not alone."
- For other serious but non-imminent issues, gently guide them towards professional help by saying something like: "It sounds like this is really weighing on you. Talking to one of the university's professional counselors could provide you with dedicated support for this."

Keep your responses supportive and helpful, but concise enough for a chat interface (2-4 sentences is ideal). Language: ${lang}.`;

  // Format messages for the Gemini API
  const contents = [
    {
      role: 'user',
      parts: [{ text: systemInstruction }]
    },
    {
      role: 'model',
      parts: [{ text: "I understand. I'm ready to help." }]
    },
    ...messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }))
  ];

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const payload = {
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 256,
      topP: 0.95
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  };

  try {
    const apiResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('Gemini API Error:', errorText);
      throw new Error('Failed to get response from AI assistant.');
    }

    const data = await apiResponse.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure how to respond to that. Could you tell me more?";
    res.json({ reply: text });

  } catch (e) {
    console.error('Error calling AI chat:', e);
    const fallback = {
      en: "I'm having a little trouble connecting right now. Please know that your feelings are valid. If this is urgent, please use the Crisis Alert.",
      hi: 'मुझे अभी कनेक्ट होने में थोड़ी दिक्कत हो रही है। कृपया जान लें कि आपकी भावनाएँ मान्य हैं। यदि यह জরুরি है, तो कृपया संकट चेतावनी का उपयोग करें।',
    };
    const text = fallback[lang] || fallback.en;
    res.status(200).json({ reply: text, degraded: true });
  }
});

export default router;