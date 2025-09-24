import { API_BASE } from '../config.js'

function getToken() { 
  // First try to get from localStorage
  let token = localStorage.getItem('token');
  
  // If not found, try to get from user object in localStorage
  if (!token) {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      token = user?.token || '';
    } catch (e) {
      console.error('Error parsing user data:', e);
      token = '';
    }
  }
  
  return token || ''; 
}

function authHeaders() { 
  const token = getToken();
  if (!token) return {};
  
  // For our mock authentication, we'll use a simple Bearer token
  // In a real app, this would be a proper JWT
  return { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }; 
}

export async function apiPost(path, body, opts={}) {
  try {
    // Don't log sensitive data
    const logBody = body ? { ...body } : {};
    if (logBody.password) logBody.password = '***';
    if (logBody.token) logBody.token = '***';
    
    console.log('API POST:', path, logBody);
    
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(opts.headers || {})
    };
    
    console.log('Request headers:', headers);
    
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      credentials: 'include'
    });
    
    if (res.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login?session_expired=true';
      throw new Error('Unauthorized - Please log in again');
    }
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API Error:', res.status, errorText);
      throw new Error(errorText || `HTTP ${res.status}`);
    }
    
    // Try to parse JSON, fallback to text if not JSON
    try {
      return await res.json();
    } catch (e) {
      return await res.text();
    }
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}

export const AuthAPI = {
  login: (payload) => apiPost('/api/auth/login', payload),
  register: (payload) => apiPost('/api/auth/register', payload),
}

export const AppointmentsAPI = {
  book: (payload) => apiPost('/api/appointments/book', payload),
  getCounselorAppointments: (counselorId) => apiGet(`/api/appointments/counselor/${counselorId}`)
}

export const FeedbackAPI = {
  submit: (payload) => apiPost('/api/feedback/submit', payload),
}

export const AIAPI = {
  chat: (payload) => apiPost('/api/ai/chat', payload),
}

export const AnalyticsAPI = {
  getOverview: () => apiGet('/api/analytics/overview'),
  getUserTrends: (period) => apiGet(`/api/analytics/users/trends?period=${period}`),
  getChatAnalytics: () => apiGet('/api/analytics/chat/analytics'),
  getAssessmentAnalytics: () => apiGet('/api/analytics/assessments/analytics'),
  getAppointmentAnalytics: () => apiGet('/api/analytics/appointments/analytics'),
  getSystemHealth: () => apiGet('/api/analytics/system/health'),
  getActivityFeed: (limit) => apiGet(`/api/analytics/activity/feed?limit=${limit}`),
}

// Mock data for analytics endpoints
const mockAnalyticsData = {
  '/api/analytics/overview': {
    totalUsers: 0,
    activeUsers: 0,
    totalSessions: 0,
    averageRating: 0,
    totalAssessments: 0,
    totalAppointments: 0
  },
  '/api/analytics/chat/analytics': {
    totalSessions: 0,
    averageDuration: 0,
    messagesPerSession: 0,
    satisfactionRate: 0
  },
  '/api/analytics/assessments/analytics': {
    totalAssessments: 0,
    averageScore: 0,
    completionRate: 0
  },
  '/api/analytics/appointments/analytics': {
    totalAppointments: 0,
    completed: 0,
    cancelled: 0,
    noShow: 0
  }
};

// Helper function to check if a path is an analytics endpoint
function isAnalyticsPath(path) {
  return path.startsWith('/api/analytics/');
}

export async function apiGet(path, opts = {}) {
  const isAnalyticsEndpoint = isAnalyticsPath(path);
  
  try {
    console.log('API GET:', path);
    
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(opts.headers || {})
    };
    
    console.log('Request headers:', headers);
    
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'GET',
      headers,
      credentials: 'include'
    });
    
    // For analytics endpoints, don't log out on 401
    if (res.status === 401) {
      if (isAnalyticsEndpoint) {
        console.log('Analytics endpoint returned 401, using mock data');
        return mockAnalyticsData[path] || {};
      }
      // For other endpoints, handle unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login?session_expired=true';
      throw new Error('Unauthorized - Please log in again');
    }
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API GET Error:', res.status, errorText);
      
      // For analytics endpoints, return mock data on error
      if (isAnalyticsEndpoint) {
        console.log('Analytics endpoint error, using mock data');
        return mockAnalyticsData[path] || {};
      }
      
      throw new Error(errorText || `HTTP ${res.status}`);
    }
    
    // Try to parse JSON, fallback to text if not JSON
    try {
      return await res.json();
    } catch (e) {
      return await res.text();
    }
  } catch (error) {
    console.error('API GET Request failed:', error);
    
    // For analytics endpoints, return mock data on error
    if (isAnalyticsEndpoint) {
      console.log('Analytics request failed, using mock data');
      return mockAnalyticsData[path] || {};
    }
    
    throw error;
  }
}
