import { useState, useRef, useEffect } from 'react';
import styles from './ChatbotWidget.module.scss';
import { BOT_MESSAGES, detectLanguage, replyFor } from './botMessages.js';
import { AIAPI } from '../../services/api.js';

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [lang, setLang] = useState('en');
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: BOT_MESSAGES['en'].hello }
  ]);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open]);

  function send() {
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [...prev, { id: prev.length + 1, from: 'you', text }]);
    setInput('');
    setTimeout(async () => {
      const detected = detectLanguage(text) || lang;
      try {
        const ai = await AIAPI.chat({ messages: [{ role: 'user', content: text }], lang: detected });
        setLang(detected);
        setMessages(prev => [...prev, { id: prev.length + 1, from: 'bot', text: ai.reply }]);
      } catch {
        const fallback = replyFor(text, detected);
        setLang(detected);
        setMessages(prev => [...prev, { id: prev.length + 1, from: 'bot', text: fallback }]);
      }
    }, 200);
  }

  const handleLangChange = (e) => {
    const newLang = e.target.value;
    setLang(newLang);
    setMessages([{ id: 1, from: 'bot', text: BOT_MESSAGES[newLang].hello }]);
  };

  return (
    <div className={styles.root}>
      {!open && (
        <div className={styles.nudge} onClick={() => setOpen(true)}>
          <div className={styles.nudgeIcon}>💬</div>
          <span>{BOT_MESSAGES[lang].nudge}</span>
        </div>
      )}

      <div className={styles.widgetContainer}>
        {open && (
          <div className={styles.panel}>
            <div className={styles.header}>
              <div className={styles.headerInfo}>
                <img src="/images/logo.png" alt="Logo" className={styles.logo} />
                <span className={styles.title}>AI Assistant</span>
              </div>
              <select value={lang} onChange={handleLangChange} className={styles.langSelect}>
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="ta">Tamil</option>
                <option value="te">Telugu</option>
                <option value="bn">Bengali</option>
              </select>
            </div>
            <div className={styles.list} ref={listRef}>
              {messages.map(m => (
                <div key={m.id} className={`${styles.msg} ${m.from === 'you' ? styles.you : styles.bot}`}>
                  {m.text}
                </div>
              ))}
            </div>
            <form className={styles.inputRow} onSubmit={(e) => { e.preventDefault(); send(); }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={BOT_MESSAGES[lang].placeholder}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
              />
              <button type="submit" className="btn primary">Send</button>
            </form>
          </div>
        )}
        <button className={styles.fab} onClick={() => setOpen(v => !v)} aria-label="Toggle Chatbot">
          {open ? '×' : '💬'}
        </button>
      </div>
    </div>
  );
}