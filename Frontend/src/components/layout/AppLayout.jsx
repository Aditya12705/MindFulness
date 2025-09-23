import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import styles from './AppLayout.module.scss'
import { useAuth } from '../../context/AuthContext.jsx'
import { MoodIndicator } from '../mood/MoodIndicator.jsx'

export function AppLayout() {
  const { adminLoggedIn, studentLoggedIn, logoutStudent, logoutAdmin } = useAuth()
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system')
  const navigate = useNavigate()
  
  function goAdmin() { navigate(adminLoggedIn ? '/admin/dashboard' : '/login?role=admin') }
  
  function handleLogout() {
    // Call the appropriate logout function based on the user's role
    if (studentLoggedIn) {
      logoutStudent()
    } else if (adminLoggedIn) {
      logoutAdmin()
    }
    
    // Force a hard navigation to ensure the app fully resets
    window.location.href = '/'
  }

  // Determine effective theme when using system preference
  function getSystemTheme(){
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  useEffect(() => {
    const root = document.documentElement
    const apply = (mode) => {
      const effective = mode === 'system' ? getSystemTheme() : mode
      if (effective === 'dark') root.setAttribute('data-theme', 'dark')
      else root.removeAttribute('data-theme')
    }

    apply(theme)
    localStorage.setItem('theme', theme)

    // Listen to OS changes when in system mode
    const mql = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null
    const handler = () => { if (theme === 'system') apply('system') }
    if (mql) mql.addEventListener ? mql.addEventListener('change', handler) : mql.addListener(handler)
    return () => { if (mql) mql.removeEventListener ? mql.removeEventListener('change', handler) : mql.removeListener(handler) }
  }, [theme])

  function toggleTheme(){
    setTheme(t => t === 'light' ? 'dark' : t === 'dark' ? 'system' : 'light')
  }
  const effectiveTheme = theme === 'system' ? (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme
  const themeIcon = theme === 'system' ? '🖥️' : effectiveTheme === 'dark' ? '🌙' : '☀️'
  const themeTitle = `Theme: ${theme} (click to switch)`
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className={styles.shell} style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'var(--bg)'
    }}>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'var(--panel)',
        boxShadow: 'var(--shadow-md)',
        padding: '10px 0',
        borderBottom: '1px solid var(--border)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 20px',
          height: '70px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            <button 
              onClick={handleGoBack}
              aria-label="Go back"
              title="Go back"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--panel-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text)',
                fontSize: '18px',
                padding: '8px 12px',
                cursor: 'pointer',
                transition: 'var(--transition)',
                minWidth: '40px',
                height: '40px',
                '&:hover': {
                  background: 'var(--panel-3)'
                }
              }}
            >
              ←
            </button>
            <Link 
              to="/" 
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                '&:hover': {
                  opacity: 0.9
                }
              }}
            >
              <img 
                src="/images/logo.png" 
                alt="MindFulness Logo"
                style={{
                  width: '40px',
                  height: '40px',
                  objectFit: 'contain'
                }}
              />
              <span style={{
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: '700',
                fontSize: '22px',
                lineHeight: 1.2
              }}>
                MindFulness
              </span>
            </Link>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <div style={{
              display: 'flex',
              gap: '10px',
              marginRight: '20px'
            }}>
              <NavLink 
                to="/student"
                style={({ isActive }) => ({
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'rgba(74, 137, 220, 0.1)' : 'transparent',
                  transition: 'var(--transition)',
                  fontWeight: '500',
                  '&:hover': {
                    color: 'var(--primary)',
                    backgroundColor: 'rgba(74, 137, 220, 0.1)'
                  }
                })}
              >
                Student
              </NavLink>
              <NavLink 
                to="/student/dashboard"
                style={({ isActive }) => ({
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'rgba(74, 137, 220, 0.1)' : 'transparent',
                  transition: 'var(--transition)',
                  fontWeight: '500',
                  '&:hover': {
                    color: 'var(--primary)',
                    backgroundColor: 'rgba(74, 137, 220, 0.1)'
                  }
                })}
              >
                Dashboard
              </NavLink>
              <NavLink 
                to="/student/support"
                style={({ isActive }) => ({
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'rgba(74, 137, 220, 0.1)' : 'transparent',
                  transition: 'var(--transition)',
                  fontWeight: '500',
                  '&:hover': {
                    color: 'var(--primary)',
                    backgroundColor: 'rgba(74, 137, 220, 0.1)'
                  }
                })}
              >
                Support
              </NavLink>
            </div>

            <MoodIndicator compact={true} />
            
            <button 
              onClick={toggleTheme} 
              aria-label="Toggle theme" 
              title={themeTitle}
              style={{
                background: 'var(--panel-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'var(--transition)',
                '&:hover': {
                  background: 'var(--panel-3)'
                }
              }}
            >
              <span style={{fontSize:'18px', lineHeight:1}}>{themeIcon}</span>
            </button>
            
            {studentLoggedIn ? (
              <button 
                onClick={handleLogout}
                style={{
                  background: 'var(--danger)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '0 20px',
                  height: '40px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  '&:hover': {
                    opacity: 0.9,
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                Logout
              </button>
            ) : (
              <button 
                onClick={goAdmin}
                style={{
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '0 20px',
                  height: '40px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: 'var(--shadow-md)'
                  }
                }}
              >
                {adminLoggedIn ? 'Admin Panel' : 'Login'}
              </button>
            )}
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className={styles.mainContent} style={{
        flex: 1,
        padding: '30px 20px',
        maxWidth: '1400px',
        width: '100%',
        margin: '0 auto'
      }}>
        <div className={styles.mainContentArea}>
          <div className={styles.contentArea}>
            <Outlet />
          </div>
          <div className={styles.sidebar}>
            <MoodIndicator showHistory={true} />
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className={styles.footer} style={{
        background: 'var(--panel)',
        borderTop: '1px solid var(--border)',
        padding: '20px 0',
        marginTop: 'auto'
      }}>
        <div className={styles.footerContent} style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontSize: '14px'
        }}>
          <p style={{ margin: 0 }}> 2025 MindFulness. All rights reserved.</p>
          <div className={styles.footerLinks} style={{
            display: 'flex',
            gap: '20px',
            marginTop: '8px'
          }}>
            <Link to="/privacy" style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              transition: 'var(--transition)',
              '&:hover': {
                color: 'var(--primary)'
              }
            }}>Privacy Policy</Link>
            <Link to="/terms" style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              transition: 'var(--transition)',
              '&:hover': {
                color: 'var(--primary)'
              }
            }}>Terms of Service</Link>
            <Link to="/contact" style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              transition: 'var(--transition)',
              '&:hover': {
                color: 'var(--primary)'
              }
            }}>Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
