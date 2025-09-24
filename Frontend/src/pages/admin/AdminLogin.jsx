import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export function AdminLogin() {
  const { adminLoggedIn, loginAdmin } = useAuth();
  const [counselor, setCounselor] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!counselor) {
      setError('Please select a counselor');
      return;
    }
    
    if (!password) {
      setError('Please enter your password');
      return;
    }
    
    try {
      await loginAdmin(counselor, password);
      navigate('/counselor/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit} style={{maxWidth: 520, margin: '0 auto'}}>
      <h2>Counsellor Login</h2>
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Select Counsellor</label>
        <select 
          value={counselor}
          onChange={(e) => setCounselor(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--panel)',
            color: 'var(--text)',
            fontSize: '14px',
            outline: 'none',
            marginBottom: '16px'
          }}
        >
          <option value="">-- Select Counsellor --</option>
          <option value="rajat">Dr. Rajat Sharma</option>
          <option value="iyer">Ms. R Iyer</option>
        </select>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Password</label>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
          placeholder="Enter your password"
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--panel)',
            color: 'var(--text)',
            fontSize: '14px',
            outline: 'none'
          }}
        />
      </div>

      {error && (
        <div style={{
          color: 'var(--danger)',
          marginBottom: '16px',
          padding: '8px',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      <button 
        type="submit" 
        className="btn primary" 
        style={{
          width: '100%',
          marginTop: '8px',
          padding: '12px',
          fontSize: '16px',
          fontWeight: '500'
        }}
      >
        Sign In as Counsellor
      </button>
      
      <p style={{
        marginTop: '16px',
        fontSize: '14px',
        color: 'var(--muted)',
        textAlign: 'center'
      }}>
        Status: {adminLoggedIn ? 'Logged In' : 'Not Logged In'}
      </p>
    </form>
  );
}
