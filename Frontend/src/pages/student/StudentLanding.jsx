import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useMood } from '../../context/MoodContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { AnimatedBackground } from '../../components/layout/AnimatedBackground.jsx';
import styles from './StudentLanding.module.scss';

export function StudentLanding() {
  const { currentMood, emotions, updateMood, personalizedContent, isLoading, getMoodInsights } = useMood();
  const { studentLoggedIn } = useAuth();
  const [animationKey, setAnimationKey] = useState(0);
  const [customMessage, setCustomMessage] = useState('');
  const insights = getMoodInsights();
  
  const emotionMessages = {
    happy: {
      title: 'Great to see you\'re doing well!',
      message: 'Keep up the positive energy! Consider sharing your good mood with others or journaling about what made you happy today.',
      action: 'Share your happiness'
    },
    sad: {
      title: 'We\'re here for you',
      message: 'It\'s okay to feel this way. Would you like to try a guided meditation or talk to someone?',
      action: 'Get support now'
    },
    anxious: {
      title: 'Feeling anxious?',
      message: 'Let\'s take a moment to breathe. Try our 5-minute guided meditation or talk to a counselor.',
      action: 'Start meditation'
    },
    angry: {
      title: 'Feeling frustrated?',
      message: 'It\'s okay to feel angry. Let\'s find a healthy way to process these emotions together.',
      action: 'Calm down'
    },
    tired: {
      title: 'Feeling drained?',
      message: 'Your well-being matters. Consider taking a break or trying a quick relaxation exercise.',
      action: 'Relax now'
    },
    stressed: {
      title: 'Stress getting to you?',
      message: 'You\'re not alone. Let\'s find some strategies to help you manage stress effectively.',
      action: 'Manage stress'
    }
  };

  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [currentMood]);

  const handleEmotionSelect = async (emotionId) => {
    await updateMood(emotionId, `User selected ${emotionId} on landing page`);
    setCustomMessage(emotionMessages[emotionId]);
  };

  const getDynamicGreeting = () => {
    if (studentLoggedIn) return "Welcome back! How are you feeling?";
    return <em>"Find your peace of mind"</em>;
  };

  const getDynamicDescription = () => {
    if (personalizedContent) {
      return personalizedContent.message;
    }
    if (studentLoggedIn) {
      return "Continue your mental health journey with personalized support and resources.";
    }
    return "Experience a new way of emotional support. Our AI companion is here to listen, understand, and guide you through life's journey.";
  };

  return (
    <div className={styles.pageWrapper}>
      <AnimatedBackground />

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.brand}>
            <img src="/images/logo.png" alt="MindFulness Logo" className={styles.logo} />
            <div className={styles.brandText}>
              <span className={styles.brandName}>MindFulness</span>
              <span className={styles.tagline}>Your Mental Health Companion</span>
            </div>
          </Link>
          <nav className={styles.nav}>
            <Link to="/" className={styles.navLink}>Home</Link>
            <Link to="/student/self-help" className={styles.navLink}>Resources</Link>
            <Link to="/student/assessment" className={styles.navLink}>Assessment</Link>
            <Link to="/student/counselor" className={styles.navLink}>Counselor</Link>
            <Link to="/student/feedback" className={styles.navLink}>Feedback</Link>
            {studentLoggedIn && <Link to="/student/support" className={styles.navLink}>Support</Link>}
            <Link 
              to={studentLoggedIn ? "/student/dashboard" : "/login?role=student"} 
              className={styles.signInBtn}
            >
              {studentLoggedIn ? 'Dashboard' : 'Sign In'}
            </Link>
          </nav>
        </div>
      </header>

      <main className={styles.mainContent}>
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>
              <span>Your AI Mental Health Companion</span>
            </div>
            <h1 className={styles.headline} key={animationKey}>
              {getDynamicGreeting()}
            </h1>
            <p className={styles.description}>
              {getDynamicDescription()}
            </p>
            {personalizedContent && (
              <div className={styles.personalizedContent}>
                <div className={styles.activityCard}>
                  <span>💡 {personalizedContent.activity}</span>
                </div>
                <div className={styles.quoteCard}>
                  <span>"{personalizedContent.quote}"</span>
                </div>
              </div>
            )}
            <div className={styles.emotionSection}>
              <p className={styles.emotionPrompt}>Whatever you're feeling, we're here to listen</p>
              <div className={styles.emotionGrid}>
                {emotions.map(emotion => (
                  <button
                    key={emotion.id}
                    className={`${styles.emotionBtn} ${currentMood === emotion.id ? styles.active : ''}`}
                    onClick={() => handleEmotionSelect(emotion.id)}
                    disabled={isLoading}
                    style={{ '--emotion-color': emotion.color }}
                  >
                    <div className={styles.emotionEmoji}>{emotion.emoji}</div>
                    <div className={styles.emotionLabel}>{emotion.label}</div>
                    {isLoading && currentMood === emotion.id && (
                      <div className={styles.loadingSpinner}></div>
                    )}
                  </button>
                ))}
              </div>
              {customMessage && !isLoading && (
                <div className={styles.customMessage}>
                  <h4>{customMessage.title}</h4>
                  <p>{customMessage.message}</p>
                  <button 
                    className={styles.messageAction}
                    onClick={() => {
                      // Handle action based on emotion
                      if (currentMood === 'sad' || currentMood === 'anxious' || currentMood === 'stressed') {
                        // Navigate to support or start a meditation
                        window.location.href = '/student/support';
                      } else if (currentMood === 'tired') {
                        // Suggest rest or relaxation
                        window.location.href = '/student/self-help';
                      } else {
                        // Default action
                        window.location.href = '/student/assessment';
                      }
                    }}
                  >
                    {customMessage.action}
                  </button>
                </div>
              )}
            </div>
            <div className={styles.ctaButtons}>
              <Link to={studentLoggedIn ? "/student/dashboard" : "/login?role=student"} className={styles.primaryBtn}>
                {studentLoggedIn ? "Go to Dashboard" : "Get Started"}
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className={styles.infoSection}>
          <div className={styles.infoGrid}>
            <div className={styles.featuresCard}>
              <h2 className={styles.cardTitle}>Why Choose MindFulness?</h2>
              <div className={styles.featuresList}>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>🤖</div>
                  <div>
                    <h4>AI-Powered Support</h4>
                    <p>24/7 intelligent companion</p>
                  </div>
                </div>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>👥</div>
                  <div>
                    <h4>Peer Support</h4>
                    <p>Connect with fellow students</p>
                  </div>
                </div>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>👨‍⚕️</div>
                  <div>
                    <h4>Professional Counselors</h4>
                    <p>Licensed mental health professionals</p>
                  </div>
                </div>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>📊</div>
                  <div>
                    <h4>Mood Tracking</h4>
                    <p>Monitor your emotional patterns</p>
                  </div>
                </div>
              </div>
            </div>
            <div id="about" className={styles.aboutCard}>
              <h2 className={styles.cardTitle}>About MindFulness</h2>
              <div className={styles.aboutContent}>
                <p>MindFulness is a dedicated mental health platform created to support university students through their academic journey and beyond. Our mission is to provide accessible, compassionate, and effective mental health support tailored to the unique needs of students.</p>
                
                <h4>Our Approach</h4>
                <p>We combine evidence-based practices with innovative technology to deliver personalized mental health support. Our platform offers a safe space for students to explore their emotions, develop coping strategies, and connect with professional support when needed.</p>
                
                <h4>Confidential & Secure</h4>
                <p>Your privacy is our priority. All interactions and data are handled with the utmost confidentiality and security, ensuring you can seek help with complete peace of mind.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="support" className={styles.supportSection}>
          <h2 className={styles.sectionTitle}>Student Support Options</h2>
          <div className={styles.supportGrid}>
            <div className={styles.supportCard}>
              <div className={styles.supportIcon}>🤖</div>
              <h3>AI Companion</h3>
              <p>Chat with our intelligent AI for 24/7 support</p>
              <Link to="/student/peer" className={styles.supportBtn}>Start Chatting</Link>
            </div>
            <div className={styles.supportCard}>
              <div className={styles.supportIcon}>👥</div>
              <h3>Peer Support</h3>
              <p>Connect with fellow students who understand</p>
              <Link to="/student/peer" className={styles.supportBtn}>Join Community</Link>
            </div>
            <div className={styles.supportCard}>
              <div className={styles.supportIcon}>👨‍⚕️</div>
              <h3>Professional Counseling</h3>
              <p>Book sessions with licensed professionals</p>
              <Link to="/student/counselor" className={styles.supportBtn}>Book Session</Link>
            </div>
            <div className={styles.supportCard}>
              <div className={styles.supportIcon}>📚</div>
              <h3>Self-Help Resources</h3>
              <p>Access mental health resources and exercises</p>
              <Link to="/student/self-help" className={styles.supportBtn}>Explore Resources</Link>
            </div>
          </div>
        </section>

        {insights && studentLoggedIn && (
          <section className={styles.insightsSection}>
            <h2 className={styles.sectionTitle}>Your Mood Insights</h2>
            <div className={styles.insightsCard}>
              <div className={styles.insightsContent}>
                <div className={styles.insightItem}>
                  <span className={styles.insightLabel}>Recent Trend:</span>
                  <span className={styles.insightValue}>{insights.trend.replace('_', ' ')}</span>
                </div>
                <div className={styles.insightItem}>
                  <span className={styles.insightLabel}>Most Common:</span>
                  <span className={styles.insightValue}>{insights.dominantMood}</span>
                </div>
              </div>
              <div className={styles.moodChart}>
                {Object.entries(insights.moodCounts).map(([mood, count]) => (
                  <div key={mood} className={styles.moodBar}>
                    <span>{emotions.find(e => e.id === mood)?.emoji}</span>
                    <div
                      className={styles.bar}
                      style={{
                        width: `${(count / Math.max(...Object.values(insights.moodCounts))) * 100}%`,
                        backgroundColor: emotions.find(e => e.id === mood)?.color
                      }}
                    />
                    <span>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>
              <div className={styles.footerLogoIcon}>💚</div>
              <span>MindFulness</span>
            </div>
            <p>Your mental health companion for university life</p>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.footerColumn}>
              <h4>Support</h4>
              <a href="#features">Features</a>
              <a href="#about">About</a>
              <a href="#support">Student Support</a>
            </div>
            <div className={styles.footerColumn}>
              <h4>Resources</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Help Center</a>
            </div>
            <div className={styles.footerColumn}>
              <h4>Contact</h4>
              <a href="mailto:support@hopeline.edu">support@hopeline.edu</a>
              <a href="mailto:crisis@hopeline.edu">crisis@hopeline.edu</a>
              <a href="tel:+18001234567">+1 (800) 123-4567</a>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2025 MindFulness. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}