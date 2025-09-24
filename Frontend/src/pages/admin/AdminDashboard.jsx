import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { AdminCharts } from './AdminCharts.jsx';
import styles from './AdminDashboard.module.scss';

export function AdminDashboard() {
  const { logoutAdmin } = useAuth();
  const navigate = useNavigate();

  // Mock data for display purposes
  const stats = {
    activeUsers: 128,
    pendingCases: 6,
    onlineCounselors: 4,
    activeChats: 23,
  };

  const recentActivity = [
    { icon: '👤', title: 'New user registered', time: '2 minutes ago' },
    { icon: '💬', title: 'Chat session completed', time: '5 minutes ago' },
    { icon: '📊', title: 'Assessment submitted', time: '10 minutes ago' },
  ];

  const systemStatus = [
    { name: 'API Server', status: 'Online' },
    { name: 'Database', status: 'Online' },
    { name: 'AI Service', status: 'Online' },
    { name: 'Chat Service', status: 'Online' },
  ];

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <img src="/images/logo.png" alt="Logo" className={styles.logo} />
          <h1>MindFulness Admin</h1>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.adminStatus}>
            <span className={styles.statusDot}></span>
            <span>Admin Online</span>
          </div>
          <button onClick={logoutAdmin} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </header>

      <section className={styles.statsSection}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.activeUsers}</div>
            <div className={styles.statLabel}>Active Users</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📋</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.pendingCases}</div>
            <div className={styles.statLabel}>Pending Cases</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👨‍⚕️</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.onlineCounselors}</div>
            <div className={styles.statLabel}>Online Counselors</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💬</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.activeChats}</div>
            <div className={styles.statLabel}>Active Chats</div>
          </div>
        </div>
      </section>

      <div className={styles.contentGrid}>
        <div className={styles.mainContent}>
          <section className="card">
            <div className={styles.cardHeader}>
              <h3>Analytics Overview</h3>
              <div className={styles.cardIcon}>📈</div>
            </div>
            <AdminCharts />
          </section>

          <section className="card">
            <div className={styles.cardHeader}>
              <h3>Recent Activity</h3>
              <div className={styles.cardIcon}>🕒</div>
            </div>
            <div className={styles.activityList}>
              {recentActivity.map((item, index) => (
                <div key={index} className={styles.activityItem}>
                  <div className={styles.activityIcon}>{item.icon}</div>
                  <div className={styles.activityContent}>
                    <div className={styles.activityTitle}>{item.title}</div>
                    <div className={styles.activityTime}>{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className={styles.sidebar}>
          <section className="card">
            <div className={styles.cardHeader}>
              <h3>Quick Actions</h3>
              <div className={styles.cardIcon}>⚡</div>
            </div>
            <div className={styles.actionList}>
              <button className={styles.actionBtn} onClick={() => navigate('/admin/users')}>
                <div className={styles.actionIcon}>👥</div>
                <span>Manage Users</span>
              </button>
              <button className={styles.actionBtn} onClick={() => navigate('/admin/cases')}>
                <div className={styles.actionIcon}>📋</div>
                <span>View Cases</span>
              </button>
              <button className={styles.actionBtn} onClick={() => navigate('/admin/reports')}>
                <div className={styles.actionIcon}>📊</div>
                <span>Generate Reports</span>
              </button>
              <button className={styles.actionBtn}>
                <div className={styles.actionIcon}>🔔</div>
                <span>Send Notification</span>
              </button>
            </div>
          </section>

          <section className="card">
            <div className={styles.cardHeader}>
              <h3>System Status</h3>
              <div className={styles.cardIcon}>🟢</div>
            </div>
            <div className={styles.statusList}>
              {systemStatus.map((item, index) => (
                <div key={index} className={styles.statusItem}>
                  <span className={styles.statusLabel}>{item.name}</span>
                  <span className={styles.statusValue}>{item.status}</span>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}