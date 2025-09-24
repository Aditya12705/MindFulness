import { createContext, useContext, useEffect, useState } from 'react'
import { AuthAPI } from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [studentLoggedIn, setStudentLoggedIn] = useState(false)
  const [adminLoggedIn, setAdminLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(()=>{
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (token && role) {
      setUser({ role })
      setStudentLoggedIn(role==='student')
      setAdminLoggedIn(role==='admin')
    }
  }, [])

  async function login(payload){
    const data = await AuthAPI.login(payload)
    localStorage.setItem('token', data.token)
    localStorage.setItem('role', data.user.role)
    setUser(data.user)
    setStudentLoggedIn(data.user.role==='student')
    setAdminLoggedIn(data.user.role==='admin')
  }

  const loginStudent = () => { 
    try {
      setStudentLoggedIn(true); 
      setAdminLoggedIn(false);
      localStorage.setItem('role', 'student');
      setUser({ role: 'student' });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
  
  const logoutStudent = async () => { 
    try {
      // Add any API call for logout if needed
      // await AuthAPI.logout();
      
      setStudentLoggedIn(false); 
      localStorage.removeItem('token'); 
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, we still want to clear the local state
      setStudentLoggedIn(false);
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      setUser(null);
      throw error;
    }
  }
  
  const loginAdmin = () => { 
    try {
      setAdminLoggedIn(true); 
      setStudentLoggedIn(false);
      localStorage.setItem('role', 'admin');
      setUser({ role: 'admin' });
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  }
  
  const logoutAdmin = async () => { 
    try {
      // Add any API call for logout if needed
      // await AuthAPI.logout();
      
      setAdminLoggedIn(false); 
      localStorage.removeItem('token'); 
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Admin logout error:', error);
      // Even if there's an error, we still want to clear the local state
      setAdminLoggedIn(false);
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      setUser(null);
      throw error;
    }
  }

  return (
    <AuthContext.Provider value={{ user, studentLoggedIn, adminLoggedIn, loginStudent, logoutStudent, loginAdmin, logoutAdmin, login }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() { return useContext(AuthContext) }


