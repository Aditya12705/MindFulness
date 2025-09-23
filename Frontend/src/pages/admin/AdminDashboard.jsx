import { useAuth } from '../../context/AuthContext.jsx'
import { UserManagement } from './UserManagement.jsx'
import { ReportsAnalytics } from './ReportsAnalytics.jsx'
import { CaseMonitoring } from './CaseMonitoring.jsx'
import { OfflineCounselorSupport } from './OfflineCounselorSupport.jsx'
import { UpdatesNotification } from './UpdatesNotification.jsx'
import { AdminCharts } from './AdminCharts.jsx'
import { Sidebar } from './Sidebar.jsx'
import styles from './AdminDashboard.module.scss'
import { useNavigate } from 'react-router-dom'

export function AdminDashboard() {
  const { adminLoggedIn, logoutAdmin } = useAuth()
  const navigate = useNavigate()
  return (
    <div className={styles.dashboardContainer} style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      color: 'var(--text)'
    }}>
      <div className={styles.dashboardMain} style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '30px 20px',
        width: '100%'
      }}>
        <div className={styles.dashboardRoot}>
          
          {/* Header */}
          <div className={styles.header} style={{
            background: 'var(--panel)',
            boxShadow: 'var(--shadow-md)',
            padding: '15px 0',
            position: 'sticky',
            top: 0,
            zIndex: 1000
          }}>
            <div className={styles.headerContent} style={{
              maxWidth: '1400px',
              margin: '0 auto',
              padding: '0 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%'
            }}>
              <div className={styles.headerLeft} style={{
                display: 'flex',
                alignItems: 'center'
              }}>
                <div className={styles.logo} style={{
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <img 
                    src="/images/logo.png" 
                    alt="MindFulness Logo"
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'contain',
                      marginRight: '15px'
                    }}
                  />
                  <span style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>MindFulness Admin</span>
                </div>
              </div>
              <div className={styles.headerRight} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px'
              }}>
                <div className={styles.adminStatus} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--text-secondary)',
                  fontSize: '14px'
                }}>
                  <span className={styles.statusDot} style={{
                    display: 'inline-block',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--success)',
                    boxShadow: '0 0 10px var(--success)'
                  }}></span>
                  <span>Admin Online</span>
                </div>
                <button 
                  onClick={logoutAdmin}
                  style={{
                    background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                    color: 'white',
                    border: 'none',
                    padding: '8px 20px',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'var(--transition)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: 'var(--shadow-md)'
                    }
                  }}
                >
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <section className={styles.statsSection}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>👥</div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>128</div>
                <div className={styles.statLabel}>Active Users</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📊</div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>6</div>
                <div className={styles.statLabel}>Pending Cases</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>👨‍⚕️</div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>4</div>
                <div className={styles.statLabel}>Online Counselors</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>💬</div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>23</div>
                <div className={styles.statLabel}>Active Chats</div>
              </div>
            </div>
          </section>

          {/* Main Content Grid */}
          <div className={styles.contentGrid}>
            <div className={styles.mainContent}>
              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>Analytics Overview</h3>
                  <div className={styles.cardIcon}>📈</div>
                </div>
                <div className={styles.cardContent}>
                  <AdminCharts />
                </div>
              </section>

              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>Recent Activity</h3>
                  <div className={styles.cardIcon}>🕒</div>
                </div>
                <div className={styles.activityList}>
                  <div className={styles.activityItem}>
                    <div className={styles.activityIcon}>👤</div>
                    <div className={styles.activityContent}>
                      <div className={styles.activityTitle}>New user registered</div>
                      <div className={styles.activityTime}>2 minutes ago</div>
                    </div>
                  </div>
                  <div className={styles.activityItem}>
                    <div className={styles.activityIcon}>💬</div>
                    <div className={styles.activityContent}>
                      <div className={styles.activityTitle}>Chat session completed</div>
                      <div className={styles.activityTime}>5 minutes ago</div>
                    </div>
                  </div>
                  <div className={styles.activityItem}>
                    <div className={styles.activityIcon}>📊</div>
                    <div className={styles.activityContent}>
                      <div className={styles.activityTitle}>Assessment submitted</div>
                      <div className={styles.activityTime}>10 minutes ago</div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className={styles.sidebar}>
              <section className={styles.card}>
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

              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>System Status</h3>
                  <div className={styles.cardIcon}>🟢</div>
                </div>
                <div className={styles.statusList}>
                  <div className={styles.statusItem}>
                    <span className={styles.statusLabel}>API Server</span>
                    <span className={styles.statusValue}>Online</span>
                  </div>
                  <div className={styles.statusItem}>
                    <span className={styles.statusLabel}>Database</span>
                    <span className={styles.statusValue}>Online</span>
                  </div>
                  <div className={styles.statusItem}>
                    <span className={styles.statusLabel}>AI Service</span>
                    <span className={styles.statusValue}>Online</span>
                  </div>
                  <div className={styles.statusItem}>
                    <span className={styles.statusLabel}>Chat Service</span>
                    <span className={styles.statusValue}>Online</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}