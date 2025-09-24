import { Link } from 'react-router-dom';
import styles from './StudentDashboard.module.scss';

export function StudentDashboard() {
  return (
    <div className={styles.dashboard}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.welcome}>Welcome back, Student! 👋</h1>
          <p className={styles.subtitle}>Your space for mental clarity and support.</p>
          <div className={styles.statusGrid}>
            <div className={styles.statusItem}>
              <span className={styles.statusLabel}>Current Status</span>
              <span className={`${styles.statusValue} ${styles.lowRisk}`}>Low Risk</span>
            </div>
            <div className={styles.statusItem}>
              <span className={styles.statusLabel}>Last Assessment</span>
              <span className={styles.statusValue}>2 days ago</span>
            </div>
             <div className={styles.statusItem}>
              <span className={styles.statusLabel}>Wellness Score</span>
              <span className={styles.statusValue}>85%</span>
            </div>
          </div>
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