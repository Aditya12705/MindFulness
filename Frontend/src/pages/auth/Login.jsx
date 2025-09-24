import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export function Login() {
  const { login, loginAdmin } = useAuth();
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const initialRole = params.get('role') === 'counselor' ? 'counselor' : 'student';
  const [role, setRole] = useState(initialRole);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(
    params.get('registered') ? 'Registration successful! Please log in.' : ''
  );

  useEffect(() => { 
    if (role !== initialRole) { 
      // Update the URL when role changes
      navigate(`/login?role=${role}`, { replace: true });
    } 
  }, [role, initialRole, navigate]);

  async function submit(e) {
    e.preventDefault();
    setError('');
    
    const form = new FormData(e.currentTarget);
    const identity = form.get('identity');
    const password = form.get('password');

    try {
      if (role === 'counselor') {
        // Use loginAdmin for counselor authentication
        await loginAdmin(identity, password);
        navigate('/counselor/dashboard');
      } else {
        // Use regular login for students
        await login({ email: identity, password });
        navigate('/student/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  }

  // Back button component to go to home page
  const BackToHome = () => (
    <button
      type="button"
      onClick={() => navigate('/')}
      style={{
        background: 'transparent',
        border: '1px solid var(--border)',
        color: 'var(--text-secondary)',
        padding: '12px 24px',
        borderRadius: 'var(--radius-md)',
        width: '100%',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontSize: '15px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        marginTop: '16px'
      }}
      onMouseOver={(e) => {
        e.target.style.background = 'var(--panel-2)';
        e.target.style.color = 'var(--text)';
      }}
      onMouseOut={(e) => {
        e.target.style.background = 'transparent';
        e.target.style.color = 'var(--text-secondary)';
      }}
    >
      <span>←</span> Back to Home
    </button>
  );

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, var(--bg-grad-1) 0%, var(--bg-grad-2) 100%)',
      color: 'var(--text)'
    }}>
      <div style={{
        background: 'var(--panel)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '40px',
        boxShadow: 'var(--shadow-lg)',
        maxWidth: '480px',
        width: '100%',
        transition: 'var(--transition)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '18px',
            marginBottom: '24px',
            fontWeight: '500'
          }}>
            Welcome back! Please sign in to continue.
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <img 
              src="/images/logo.png" 
              alt="MindFulness Logo"
              style={{
                width: '80px',
                height: '80px',
                objectFit: 'contain',
                marginRight: '20px'
              }}
            />
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: 'var(--primary)',
              margin: '0',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>MindFulness</h1>
          </div>
          <p style={{
            color: 'var(--muted)',
            fontSize: '16px',
            margin: '8px 0 0 0',
            fontWeight: '500'
          }}>Your mental health companion</p>
          {successMessage && (
            <div style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: 'rgba(102, 204, 102, 0.1)',
              border: '1px solid #66cc66',
              borderRadius: '8px',
              color: '#66cc66',
              textAlign: 'center',
              fontSize: '14px'
            }}>
              {successMessage}
            </div>
          )}
        </div>

        <form onSubmit={submit}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: 'var(--text)',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            {role === 'counselor' ? 'Counselor Sign In' : 'Student Sign In'}
          </h2>
          
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: 'var(--radius-full)',
              background: role === 'student' ? 'var(--primary)' : 'transparent',
              border: `1px solid ${role === 'student' ? 'var(--primary-dark)' : 'var(--border)'}`,
              color: role === 'student' ? 'white' : 'var(--muted)',
              cursor: 'pointer',
              transition: 'var(--transition)',
              fontWeight: '500',
              flex: '0 0 auto'
            }}>
              <input 
                type="radio" 
                name="role" 
                checked={role === 'student'} 
                onChange={() => setRole('student')}
                style={{ display: 'none' }}
              />
              Student
            </label>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: 'var(--radius-full)',
              background: role === 'counselor' ? 'var(--primary)' : 'transparent',
              border: `1px solid ${role === 'counselor' ? 'var(--primary-dark)' : 'var(--border)'}`,
              color: role === 'counselor' ? 'white' : 'var(--muted)',
              cursor: 'pointer',
              transition: 'var(--transition)',
              fontWeight: '500',
              flex: '0 0 auto'
            }}>
              <input 
                type="radio" 
                name="role" 
                checked={role === 'counselor'} 
                onChange={() => setRole('counselor')}
                style={{ display: 'none' }}
              />
              Counselor
            </label>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--text-secondary)'
            }}>
              {role === 'counselor' ? 'Username' : 'Email Address'}
            </label>
            <input
              type={role === 'counselor' ? 'text' : 'email'}
              name="identity"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                fontSize: '15px',
                color: 'var(--text)',
                backgroundColor: 'var(--panel)',
                transition: 'var(--transition)'
              }}
              placeholder={role === 'counselor' ? 'Enter your username' : 'you@university.edu'}
              autoComplete={role === 'counselor' ? 'username' : 'email'}
              defaultValue={role === 'counselor' ? '' : 'student@university.edu'}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--text-secondary)'
            }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                fontSize: '15px',
                color: 'var(--text)',
                backgroundColor: 'var(--panel)',
                transition: 'var(--transition)'
              }}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <button 
              type="submit"
              style={{
                width: '100%',
                padding: '14px 24px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                color: 'white',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'var(--transition)',
                boxShadow: 'var(--shadow-sm)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(74, 137, 220, 0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              Sign In
            </button>
          </div>

          {role === 'student' && (
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <p style={{ color: 'var(--muted)', marginBottom: '8px' }}>
                Don't have an account?
              </p>
              <button
                type="button"
                onClick={() => navigate('/student/register')}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--primary)',
                  color: 'var(--primary)',
                  padding: '12px 24px',
                  borderRadius: 'var(--radius-md)',
                  width: '100%',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  fontSize: '16px',
                  fontWeight: '500',
                  marginBottom: '16px'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(74, 137, 220, 0.1)';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.color = 'var(--primary)';
                }}
              >
                Register as Student
              </button>
              <BackToHome />
            </div>
          )}

          {role !== 'student' && (
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <BackToHome />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;
