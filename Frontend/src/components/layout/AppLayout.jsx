import { useState, useRef } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { MoodIndicator } from '../mood/MoodIndicator.jsx';
import { ChatbotWidget } from '../chatbot/ChatbotWidget.jsx';
import { useClickAway } from 'react-use';
import styles from './AppLayout.module.scss';

// Icons
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const LogOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="caret">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const AdminIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

export function AppLayout() {
  const { adminLoggedIn, studentLoggedIn, logoutStudent, logoutAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useClickAway(dropdownRef, () => {
    setDropdownOpen(false);
  });

  const handleLogout = async () => {
    try {
      // Close dropdown
      setDropdownOpen(false);
      
      // Call the appropriate logout function
      if (studentLoggedIn) {
        await logoutStudent();
      } else if (adminLoggedIn) {
        await logoutAdmin();
      }
      
      // Force a full page reload to ensure all state is cleared
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if there's an error
      window.location.href = '/';
    }
  };
  
  const getUserInitials = () => {
    if (!user) return 'U';
    if (user.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
    return user.role === 'admin' ? 'AD' : 'U';
  };

  const handleGoBack = () => {
    navigate(-1); // Navigates to the previous page in history
  };

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <button
              onClick={handleGoBack}
              aria-label="Go back"
              title="Go back"
              className={styles.backButton}
            >
              ←
            </button>
            <Link to="/" className={styles.brand}>
              <img
                src="/images/logo.png"
                alt="MindFulness Logo"
                className={styles.logo}
              />
              <span>MindFulness</span>
            </Link>
          </div>
          <nav className={styles.navLinks}>
            <NavLink to="/student/dashboard">Dashboard</NavLink>
            <NavLink to="/student/support">Get Support</NavLink>
            <NavLink to="/student/assessment">Assessment</NavLink>
          </nav>
          <div className={styles.headerRight}>
            <MoodIndicator compact={true} />
            
            {studentLoggedIn || adminLoggedIn ? (
              <div className={styles['user-menu']}>
                <div className={styles['user-avatar']}>
                  {getUserInitials()}
                </div>
                <div className={styles.dropdown} ref={dropdownRef}>
                  <button 
                    className={styles['dropdown-toggle']}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                  >
                    {user?.name || (adminLoggedIn ? 'Admin' : 'User')}
                    <ChevronDown />
                  </button>
                  <div 
                    className={styles['dropdown-menu']} 
                    data-show={dropdownOpen ? 'true' : undefined}
                  >
                    <Link 
                      to={adminLoggedIn ? '/admin/dashboard' : '/student/dashboard'} 
                      className={styles['dropdown-item']}
                      onClick={() => setDropdownOpen(false)}
                    >
                      <UserIcon className={styles['btn-icon']} />
                      {adminLoggedIn ? 'Admin Dashboard' : 'My Dashboard'}
                    </Link>
                    <div className={styles.divider}></div>
                    <button 
                      onClick={handleLogout}
                      className={`${styles['dropdown-item']} ${styles.danger}`}
                    >
                      <LogOutIcon className={styles['btn-icon']} />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login?role=admin')}
                className={`${styles.btn} ${styles['btn-admin']}`}
              >
                <AdminIcon className={styles['btn-icon']} />
                Admin Login
              </button>
            )}
          </div>
        </div>
      </header>
      
      <main className={styles.main}>
        <div className={styles.contentWrapper}>
          <div className={styles.contentArea}>
            <Outlet />
          </div>
          <aside className={styles.sidebar}>
            <MoodIndicator showHistory={true} />
          </aside>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2025 MindFulness. Your mental health matters.</p>
        <div className={styles.footerLinks}>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </footer>
      
      <ChatbotWidget />
    </div>
  );
}