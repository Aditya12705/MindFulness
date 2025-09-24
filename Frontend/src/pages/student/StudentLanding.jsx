import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useMood } from '../../context/MoodContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import styles from './StudentLanding.module.scss'

export function StudentLanding() {
  const { currentMood, emotions, updateMood, personalizedContent, isLoading, getMoodInsights } = useMood()
  const { studentLoggedIn, adminLoggedIn } = useAuth()
  const [showInsights, setShowInsights] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)

  const insights = getMoodInsights()

  // Update animation when mood changes
  useEffect(() => {
    setAnimationKey(prev => prev + 1)
  }, [currentMood])

  const handleEmotionSelect = async (emotionId) => {
    await updateMood(emotionId, 'User selected emotion on landing page')
  }

  const getDynamicGreeting = () => {
    if (studentLoggedIn) return <span style={{ 
      fontStyle: 'italic',
      color: '#ffffff',
      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
      fontSize: '2.5rem',
      fontWeight: '700',
      lineHeight: '1.2',
      display: 'inline-block',
      margin: '1rem 0',
      background: 'linear-gradient(135deg, #ffffff, #e6f0ff)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    }}>"Welcome back! How are you feeling today?"</span>
    return <span style={{ 
      fontStyle: 'italic',
      color: '#ffffff',
      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
      fontSize: '3rem',
      fontWeight: '800',
      lineHeight: '1.2',
      display: 'inline-block',
      margin: '1rem 0',
      background: 'linear-gradient(135deg, #ffffff, #e6f0ff)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    }}>Find Your Peace</span>
  }

  const getDynamicDescription = () => {
    const style = {
      color: '#e2e8f0',
      fontSize: '1.25rem',
      lineHeight: '1.6',
      maxWidth: '600px',
      margin: '0 auto',
      textShadow: '0 1px 3px rgba(0,0,0,0.2)',
      fontWeight: '400'
    };
    
    if (personalizedContent) {
      return <span style={style}>{personalizedContent.message}</span>
    }
    if (studentLoggedIn) {
      return <span style={style}>"Continue your mental health journey with personalized support and resources."</span>
    }
    return <span style={style}>"Experience a new way of emotional support. Our AI companion is here to listen, understand, and guide you through life's journey."</span>
  }

  return (
    <div className={styles.hero} style={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      color: '#2c3e50',
      '--gradient-1': '#1a2980',
      '--gradient-2': '#26d0ce',
      '--gradient-3': '#4b6cb7',
      '--gradient-4': '#182848'
    }}>
      {/* Animated Gradient Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          linear-gradient(
            45deg,
            var(--gradient-1),
            var(--gradient-2),
            var(--gradient-3),
            var(--gradient-4)
          )`,
        backgroundSize: '400% 400%',
        animation: 'gradientBG 15s ease infinite',
        zIndex: -1
      }} />
      <style jsx global>{`
        @keyframes gradientBG {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
      {/* Header */}
      <header className={styles.header} style={{
        background: 'var(--panel)',
        boxShadow: 'var(--shadow-md)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        padding: '15px 0'
      }}>
        <div className={styles.logo} style={{
          display: 'flex',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          width: '100%',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src="/images/logo.png" 
              alt="MindFulness Logo" 
              style={{
                height: '60px',
                width: 'auto',
                marginRight: '20px'
              }}
            />
            <div>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>MindFulness</div>
              <div style={{
                color: 'var(--muted)',
                fontSize: '14px',
                marginTop: '4px'
              }}>Your mental health Companion</div>
            </div>
          </div>
          <nav className={styles.nav} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            <a href="#features" style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontWeight: '500',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              transition: 'var(--transition)',
              '&:hover': {
                color: 'var(--primary)',
                backgroundColor: 'rgba(74, 137, 220, 0.1)'
              }
            }}>Features</a>
            <a href="#about" style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontWeight: '500',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              transition: 'var(--transition)',
              '&:hover': {
                color: 'var(--primary)',
                backgroundColor: 'rgba(74, 137, 220, 0.1)'
              }
            }}>About</a>
            <a href="#support" style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontWeight: '500',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              transition: 'var(--transition)',
              '&:hover': {
                color: 'var(--primary)',
                backgroundColor: 'rgba(74, 137, 220, 0.1)'
              }
            }}>Support</a>
            <Link 
              to="/login?role=student" 
              style={{
                background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                color: 'white',
                padding: '10px 20px',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'var(--transition)',
                boxShadow: 'var(--shadow-sm)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 'var(--shadow-md)',
                  background: 'linear-gradient(135deg, var(--primary-light), var(--primary))'
                }
              }}
            >
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.mainContent} style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 20px',
        width: '100%'
      }}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            {/* Badge */}
            <div className={styles.badge}>
              <div className={styles.waveIcon}>🌊</div>
              <span>Your AI Agent Mental Health Companion</span>
            </div>

            {/* Main Headline */}
            <h1 className={styles.headline} key={animationKey}>
              <span className={styles.highlight}>{getDynamicGreeting()}</span>
            </h1>

            {/* Description */}
            <p className={styles.description}>
              {getDynamicDescription()}
            </p>

            {/* Personalized Content */}
            {personalizedContent && (
              <div className={styles.personalizedContent}>
                <div className={styles.activityCard}>
                  <div className={styles.activityIcon}>💡</div>
                  <span>{personalizedContent.activity}</span>
                </div>
                <div className={styles.quoteCard}>
                  <div className={styles.quoteIcon}>💭</div>
                  <span>"{personalizedContent.quote}"</span>
                </div>
              </div>
            )}

            {/* Emotion Selector */}
            <div className={styles.emotionSection}>
              <p className={styles.emotionPrompt}>Whatever you're feeling, we're here to listen</p>
              <div className={styles.emotionGrid}>
                {emotions.map(emotion => (
                  <button
                    key={emotion.id}
                    className={`${styles.emotionBtn} ${currentMood === emotion.id ? styles.active : ''}`}
                    onClick={() => handleEmotionSelect(emotion.id)}
                    disabled={isLoading}
                    style={{
                      '--emotion-color': emotion.color,
                      opacity: isLoading ? 0.7 : 1
                    }}
                  >
                    <div className={styles.emotionEmoji}>{emotion.emoji}</div>
                    <div className={styles.emotionLabel}>{emotion.label}</div>
                    {isLoading && currentMood === emotion.id && (
                      <div className={styles.loadingSpinner}></div>
                    )}
                  </button>
                ))}
              </div>
              
              {/* Slider */}
              <div className={styles.sliderContainer}>
                <div className={styles.sliderTrack}>
                  <div 
                    className={styles.sliderThumb}
                    style={{
                      left: `${emotions.findIndex(e => e.id === currentMood) * 25}%`,
                      backgroundColor: emotions.find(e => e.id === currentMood)?.color
                    }}
                  />
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className={styles.ctaButtons}>
              {studentLoggedIn ? (
                <Link to="/student/dashboard" className={styles.primaryBtn}>
                  Continue Journey
                </Link>
              ) : (
                <Link to="/login?role=student" className={styles.primaryBtn}>
                  Login
                </Link>
              )}
              {/* Admin access removed from student landing page */}
            </div>
          </div>
        </section>

        {/* Features & About Combined Section */}
        <section id="features" className={styles.infoSection}>
          <div className={styles.infoGrid}>
            {/* Features */}
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

            {/* About */}
            <div id="about" className={styles.aboutCard}>
              <h2 className={styles.cardTitle}>About MindFulness</h2>
              <p className={styles.aboutText}>
                A comprehensive digital mental health platform designed specifically for university students. 
                We understand the unique challenges you face and provide accessible, effective support.
              </p>
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <div className={styles.statNumber}>10K+</div>
                  <div className={styles.statLabel}>Students Helped</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statNumber}>24/7</div>
                  <div className={styles.statLabel}>Support Available</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statNumber}>95%</div>
                  <div className={styles.statLabel}>Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Support Options */}
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

        {/* Mood Insights - Only for logged in students */}
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

      {/* Footer */}
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
              <a href="#">support@hopeline.edu</a>
              <a href="#">crisis@hopeline.edu</a>
              <a href="#">+1 (800) 123-4567</a>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2025 MindFulness. All rights reserved. Your mental health matters.</p>
        </div>
      </footer>
    </div>
  )
}