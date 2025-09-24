import { useState, useEffect, useRef } from 'react';
import styles from './PeerSupport.module.scss';

const CHANNELS = [
  {
    id: 'anxiety',
    name: 'Anxiety Support',
    description: 'Dealing with anxiety and panic',
    icon: '🌊',
    members: 23
  },
  {
    id: 'depression',
    name: 'Depression Support',
    description: 'Support for depression & low moods',
    icon: '🌱',
    members: 31
  },
  {
    id: 'stress',
    name: 'Stress & Overwhelm',
    description: 'Managing stress and pressure',
    icon: '⚡',
    members: 18
  },
  {
    id: 'sleep',
    name: 'Sleep Issues',
    description: 'Insomnia and sleep problems',
    icon: '🌙',
    members: 15
  },
  {
    id: 'relationships',
    name: 'Relationships',
    description: 'Family, friends, dating support',
    icon: '💜',
    members: 27
  },
  {
    id: 'selfcare',
    name: 'Self-Care',
    description: 'Building healthy habits',
    icon: '🌸',
    members: 34
  },
  {
    id: 'general',
    name: 'General Support',
    description: 'Open discussions & check-ins',
    icon: '💬',
    members: 42
  }
];

const INITIAL_MESSAGES = {
  anxiety: [
    {
      id: 1,
      username: 'Anonymous',
      timestamp: '2 hours ago',
      text: 'Had my first panic attack in months today. The breathing techniques we talked about here really helped me get through it. Thank you all for the support! 💙',
      reactions: [{ emoji: '💙', count: 5, reacted: false }, { emoji: '🫂', count: 3, reacted: false }]
    },
    {
      id: 2,
      username: 'Anonymous',
      timestamp: '1 hour ago',
      text: 'That\'s amazing! I\'m so proud of you for using those techniques. It shows how much you\'ve grown.',
      reactions: [{ emoji: '👏', count: 2, reacted: false }]
    },
  ],
  depression: [
    {
      id: 1,
      username: 'Anonymous',
      timestamp: '3 hours ago',
      text: 'Having one of those days where getting out of bed feels impossible. But I\'m here, I\'m trying, and that\'s something.',
      reactions: [{ emoji: '💪', count: 8, reacted: false }, { emoji: '🌟', count: 4, reacted: false }]
    },
  ],
  general: [
    {
      id: 1,
      username: 'Anonymous',
      timestamp: '30 min ago',
      text: 'Just wanted to say thank you to this community. Having a safe space to share without judgment means everything. You all are amazing! 💙',
      reactions: [{ emoji: '💙', count: 15, reacted: false }, { emoji: '🤗', count: 8, reacted: false }]
    },
  ]
};

const COMMON_REACTIONS = ['💙', '🫂', '👏', '💪', '🌟', '❤️', '🤗', '✨'];

export function PeerSupport() {
  const [activeChannel, setActiveChannel] = useState('general');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChannel]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      username: 'Anonymous',
      timestamp: 'just now',
      text: newMessage,
      reactions: []
    };

    setMessages(prev => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), userMessage]
    }));

    setNewMessage('');
  };

  const handleReaction = (messageId, emoji) => {
    setMessages(prev => ({
      ...prev,
      [activeChannel]: prev[activeChannel].map(msg => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find(r => r.emoji === emoji);
          if (existingReaction) {
            return {
              ...msg,
              reactions: msg.reactions.map(r => 
                r.emoji === emoji 
                  ? { ...r, count: r.reacted ? r.count - 1 : r.count + 1, reacted: !r.reacted }
                  : r
              ).filter(r => r.count > 0)
            };
          } else {
            return {
              ...msg,
              reactions: [...msg.reactions, { emoji, count: 1, reacted: true }]
            };
          }
        }
        return msg;
      })
    }));
    setShowReactionPicker(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const activeChannelData = CHANNELS.find(c => c.id === activeChannel);
  const currentMessages = messages[activeChannel] || [];

  return (
    <div className={styles.peerSupport}>
      <div className={styles.header}>
        <h1>Peer Support Channels</h1>
        <p>Connect anonymously with others who understand your journey</p>
        <div className={styles.anonymousIndicator}>
          🔒 Your identity is protected - All conversations are anonymous
        </div>
      </div>

      <div className={styles.channelsContainer}>
        <div className={styles.channelsList}>
          <h3><span>💬</span> Support Channels</h3>
          {CHANNELS.map(channel => (
            <div
              key={channel.id}
              className={`${styles.channelItem} ${activeChannel === channel.id ? styles.active : ''}`}
              onClick={() => setActiveChannel(channel.id)}
            >
              <div className={styles.channelIcon}>{channel.icon}</div>
              <div className={styles.channelInfo}>
                <div className={styles.channelName}>{channel.name}</div>
                <div className={styles.channelDesc}>{channel.description}</div>
                <div className={styles.memberCount}>{channel.members} members online</div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.chatContainer}>
          <div className={styles.chatHeader}>
            <h3><span>{activeChannelData?.icon}</span>{activeChannelData?.name}</h3>
            <div className={styles.onlineStatus}>{activeChannelData?.members} members online</div>
          </div>

          <div className={styles.messagesContainer}>
            {currentMessages.map(message => (
              <div key={message.id} className={styles.messageGroup}>
                <div className={styles.messageHeader}>
                  <div className={styles.avatar}>A</div>
                  <span className={styles.username}>Anonymous</span>
                  <span className={styles.timestamp}>{message.timestamp}</span>
                </div>
                <div className={styles.messageContent}>
                  <div className={styles.messageText}>{message.text}</div>
                  <div className={styles.messageReactions}>
                    {message.reactions.map(reaction => (
                      <button
                        key={reaction.emoji}
                        className={`${styles.reaction} ${reaction.reacted ? styles.reacted : ''}`}
                        onClick={() => handleReaction(message.id, reaction.emoji)}
                      >
                        <span className={styles.emoji}>{reaction.emoji}</span>
                        <span className={styles.count}>{reaction.count}</span>
                      </button>
                    ))}
                    <button
                      className={styles.addReaction}
                      onClick={() => setShowReactionPicker(showReactionPicker === message.id ? null : message.id)}
                    >+</button>
                    {showReactionPicker === message.id && (
                      <div className={styles.reactionPicker}>
                        {COMMON_REACTIONS.map(emoji => (
                          <button key={emoji} onClick={() => handleReaction(message.id, emoji)}>{emoji}</button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.messageInput}>
            <div className={styles.inputContainer}>
              <textarea
                className={styles.textInput}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Share your thoughts in #${activeChannelData?.name}...`}
                rows={1}
              />
              <button
                className={styles.sendButton}
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <span>Send</span>
                <span>📤</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}