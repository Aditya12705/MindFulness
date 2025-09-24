import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { AdminCharts } from './AdminCharts.jsx';
import { AnimatedBackground } from '../../components/layout/AnimatedBackground.jsx';
import { AppointmentsAPI } from '../../services/api.js';
import styles from './AdminDashboard.module.scss';

export function AdminDashboard() {
  const { logoutAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Map usernames to their corresponding counselor IDs
  const counselorIds = {
    'rajat': '000000000000000000000001',
    'iyer': '000000000000000000000002'
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        
        if (!user) {
          console.error('No user data available');
          setError('Not authenticated. Please log in again.');
          return;
        }
        
        // Debug: Log the complete user object
        console.log('Current user object:', JSON.stringify(user, null, 2));
        
        // Get the counselor ID from the user object
        // Use the counselorId from the user object or map from username
        let counselorId = user.counselorId || 
                         (user.role === 'counselor' && user._id) || 
                         (user.role === 'counselor' && user.id) ||
                         (user.username && counselorIds[user.username]);
        
        // Ensure we have a valid ID
        if (!counselorId) {
          console.error('No counselor ID found for user:', user);
          setError('Counselor ID not found. Please log in as a counselor.');
          return;
        }
        
        // Convert to string and ensure it's a valid MongoDB ID format
        counselorId = String(counselorId).trim();
        if (counselorId.length < 24) {
          counselorId = counselorId.padStart(24, '0');
        }
        
        console.log('Fetching appointments for counselor ID:', counselorId);
        
        console.log('Fetching appointments for counselor ID:', counselorId);
        const appointments = await AppointmentsAPI.getCounselorAppointments(counselorId);
        console.log('Fetched appointments:', appointments);
        setUpcomingAppointments(appointments || []);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Stats with updated appointments count
  const stats = {
    activeUsers: 128,
    pendingCases: upcomingAppointments?.length || 0,
    onlineCounselors: 2,
    activeChats: 0,
  };

  const recentActivity = [
    ...upcomingAppointments.slice(0, 3).map(appt => ({
      icon: '📅',
      title: `Appointment with ${appt.studentId?.name || 'Student'}`,
      time: formatDate(appt.startsAt)
    })),
    { icon: '👤', title: 'New user registered', time: '2 minutes ago' },
    { icon: '💬', title: 'Chat session completed', time: '5 minutes ago' },
  ].slice(0, 3); // Show max 3 items


  return (
    <div className={styles.dashboardContainer}>
      <AnimatedBackground />
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <img src="/images/logo.png" alt="Logo" className={styles.logo} />
          <h1>MindFulness Counsellor Portal</h1>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.adminStatus}>
            <span className={styles.statusDot}></span>
            <span>Welcome, {user?.name || 'Counsellor'}</span>
          </div>
          <button 
            onClick={() => {
              logoutAdmin();
              navigate('/counselor/login');
            }} 
            className={styles.logoutBtn}
          >
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
          <section className="card" style={{ marginBottom: '20px' }}>
            <div className={styles.cardHeader}>
              <h3>Upcoming Appointments</h3>
              <div className={styles.cardIcon}>📅</div>
            </div>
            {loading ? (
              <p>Loading appointments...</p>
            ) : error ? (
              <p>{error}</p>
            ) : upcomingAppointments.length === 0 ? (
              <p>No upcoming appointments</p>
            ) : (
              <div className={styles.appointmentList}>
                {upcomingAppointments.map((appointment, index) => (
                  <div key={index} className={styles.appointmentItem}>
                    <div className={styles.appointmentTime}>
                      {new Date(appointment.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className={styles.appointmentDetails}>
                      <div className={styles.appointmentTitle}>
                        {appointment.studentId?.name || 'Student'}
                      </div>
                      <div className={styles.appointmentDate}>
                        {new Date(appointment.startsAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

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
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}