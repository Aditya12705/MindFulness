import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatedBackground } from '../../components/layout/AnimatedBackground.jsx';
import { StudentAPI } from '../../services/api.js';
import styles from './StudentDashboard.module.scss';

function formatDistanceToNow(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    let interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)} days ago`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)} hours ago`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)} minutes ago`;
    return "just now";
}

export function StudentDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await StudentAPI.getDashboardSummary();
        if (data) {
          setSummary(data);
        } else {
          setError('No data available. Complete your first assessment to see your dashboard.');
        }
      } catch (err) {
        console.error('Dashboard error:', err);
        const errorMessage = err.response?.data?.message || 'Could not load dashboard data. Please try again later.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSummary();
    
    // Cleanup function to prevent memory leaks
    return () => {
      // Cancel any pending requests here if needed
    };
  }, []);

  const lastAssessment = summary?.lastAssessment;
  // Calculate wellness score (lower score is better, so we invert it for display)
  const wellnessScore = lastAssessment?.totalScore !== undefined 
    ? (100 - (lastAssessment.totalScore / 27) * 100).toFixed(0) 
    : 'N/A';
    
  // Determine risk level based on assessment score or default to low
  const getRiskLevel = () => {
    if (!lastAssessment) return 'low';
    
    const score = lastAssessment.totalScore;
    if (score < 5) return 'low';
    if (score < 10) return 'medium';
    return 'high';
  };
  
  const riskLevel = getRiskLevel();

  return (
    <div className={styles.dashboard}>
      <AnimatedBackground />
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.welcome}>Welcome back, {summary?.studentName || 'Student'}! 👋</h1>
          <p className={styles.subtitle}>Your space for mental clarity and support.</p>
          {loading ? (
            <p>Loading your status...</p>
          ) : error ? (
            <p style={{ color: 'var(--danger)' }}>{error}</p>
          ) : (
            <div className={styles.statusGrid}>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Current Status</span>
                <span className={`${styles.statusValue} ${styles[riskLevel + 'Risk']}`}>
                  {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
                </span>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Last Assessment</span>
                <span className={styles.statusValue}>{formatDistanceToNow(lastAssessment?.completedAt)}</span>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Wellness Score</span>
                <span className={styles.statusValue}>{wellnessScore}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.grid}>
        <section className={`${styles.card} ${styles.actionsCard}`}>
          <div className={styles.cardHeader}>
            <h3>How can we help today?</h3>
            <div className={styles.cardIcon}>⚡</div>
          </div>
          <div className={styles.actionGrid}>
            <Link to="/student/support" className={styles.actionBtn}>
              <div className={styles.actionIcon}>🤝</div>
              <div>
                <div className={styles.actionTitle}>Find Support</div>
                <div className={styles.actionDesc}>Explore your options</div>
              </div>
            </Link>
            <Link to="/student/assessment" className={styles.actionBtn}>
              <div className={styles.actionIcon}>📊</div>
              <div>
                <div className={styles.actionTitle}>Take Assessment</div>
                <div className={styles.actionDesc}>Check on your mood</div>
              </div>
            </Link>
            <Link to="/student/crisis" className={`${styles.actionBtn} ${styles.crisisBtn}`}>
              <div className={styles.actionIcon}>🚨</div>
              <div>
                <div className={styles.actionTitle}>Crisis Alert</div>
                <div className={styles.actionDesc}>Get immediate help</div>
              </div>
            </Link>
          </div>
        </section>
        
        {summary?.nextAppointment && (
          <section className={`${styles.card} ${styles.appointmentCard}`}>
            <div className={styles.cardHeader}>
              <h3>Upcoming Appointment</h3>
              <div className={styles.cardIcon}>📅</div>
            </div>
            <div className={styles.appointmentDetails}>
              <p>With <strong>{summary.nextAppointment.counselorId?.name || 'Counselor'}</strong></p>
              <p>{new Date(summary.nextAppointment.startsAt).toLocaleString('en-US', {
                dateStyle: 'full',
                timeStyle: 'short',
              })}</p>
            </div>
          </section>
        )}

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Recommended For You</h3>
            <div className={styles.cardIcon}>📚</div>
          </div>
          <div className={styles.resourceList}>
            <div className={styles.resourceItem}>
              <div className={styles.resourceIcon}>🧘</div>
              <div className={styles.resourceContent}>
                <div className={styles.resourceTitle}>Mindful Breathing</div>
                <div className={styles.resourceDesc}>A 5-minute guided session to calm your mind.</div>
              </div>
              <Link to="/student/self-help" className={styles.resourceLink}>Start</Link>
            </div>
            <div className={styles.resourceItem}>
              <div className={styles.resourceIcon}>📖</div>
              <div className={styles.resourceContent}>
                <div className={styles.resourceTitle}>Daily Journaling</div>
                <div className={styles.resourceDesc}>Reflect on your day and organize your thoughts.</div>
              </div>
              <Link to="/student/self-help" className={styles.resourceLink}>Write</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}