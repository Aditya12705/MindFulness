import { createContext, useContext, useEffect, useState } from 'react'
import { AuthAPI } from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Initialize state from localStorage if available
  const [authState, setAuthState] = useState(() => {
    try {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      
      return {
        studentLoggedIn: role === 'student' && !!token,
        adminLoggedIn: (role === 'admin' || role === 'counselor') && !!token,
        user: user || null,
        initialized: false
      };
    } catch (error) {
      console.error('Error initializing auth state:', error);
      return {
        studentLoggedIn: false,
        adminLoggedIn: false,
        user: null,
        initialized: true
      };
    }
  });
  
  const { studentLoggedIn, adminLoggedIn, user } = authState;

  // Initialize auth state on mount
  useEffect(() => {
    setAuthState(prev => ({
      ...prev,
      initialized: true
    }));
  }, []);

  const login = async (payload) => {
    try {
      const data = await AuthAPI.login(payload);
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setAuthState({
        studentLoggedIn: data.user.role === 'student',
        adminLoggedIn: data.user.role === 'admin' || data.user.role === 'counselor',
        user: data.user,
        initialized: true
      });
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const loginStudent = () => { 
    try {
      const userData = { role: 'student' };
      const token = `student_${Date.now()}`;
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', 'student');
      localStorage.setItem('user', JSON.stringify(userData));
      
      setAuthState({
        studentLoggedIn: true,
        adminLoggedIn: false,
        user: userData,
        initialized: true
      });
      
      return { token, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
  
  const logoutStudent = async () => { 
    try {
      // Add any API call for logout if needed
      // await AuthAPI.logout();
      
      // Clear all auth data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      
      // Reset auth state
      setAuthState({
        studentLoggedIn: false,
        adminLoggedIn: false,
        user: null,
        initialized: true
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, we still want to clear the local state
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      
      setAuthState({
        studentLoggedIn: false,
        adminLoggedIn: false,
        user: null,
        initialized: true
      });
      
      throw error;
    }
  }
  
  const loginAdmin = async (username, password) => { 
    try {
      console.log('loginAdmin called with:', username, password);
      
      // Define the two counselor accounts with their credentials
      const counselors = {
        'rajat': { 
          name: 'Dr. Rajat Sharma', 
          password: 'rajat123',
          role: 'counselor'
        },
        'iyer': { 
          name: 'Ms. R Iyer', 
          password: 'iyer123',
          role: 'counselor'
        }
      };
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check if username exists and password matches
      const counselor = counselors[username];
      if (!counselor || counselor.password !== password) {
        throw new Error('Invalid credentials');
      }
      
      // Generate a simple token (in a real app, this would come from your backend)
      const token = `counselor_${Date.now()}`;
      
      // Store user data without password
      const { password: _, ...counselorData } = counselor;
      const userData = { 
        ...counselorData, 
        id: username,
        token
      };
      
      console.log('Setting auth state with:', userData);
      
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', 'counselor');
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update auth state
      setAuthState(prev => ({
        ...prev,
        studentLoggedIn: false,
        adminLoggedIn: true,
        user: userData,
        initialized: true
      }));
      
      console.log('Auth state updated, returning token');
      return { token, user: userData };
    } catch (error) {
      console.error('Counselor login error:', error);
      throw error;
    }
  }
  
  const logoutAdmin = async () => { 
    try {
      // Add any API call for logout if needed
      // await AuthAPI.logout();
      
      // Clear all auth data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      
      // Reset auth state
      setAuthState({
        studentLoggedIn: false,
        adminLoggedIn: false,
        user: null,
        initialized: true
      });
    } catch (error) {
      console.error('Admin logout error:', error);
      // Even if there's an error, we still want to clear the local state
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      
      setAuthState({
        studentLoggedIn: false,
        adminLoggedIn: false,
        user: null,
        initialized: true
      });
      
      throw error;
    }
  }

  // Only render children once auth state is initialized
  if (!authState.initialized) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user: authState.user, 
        studentLoggedIn: authState.studentLoggedIn, 
        adminLoggedIn: authState.adminLoggedIn, 
        loginStudent, 
        logoutStudent, 
        loginAdmin, 
        logoutAdmin, 
        login 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() { return useContext(AuthContext) }


