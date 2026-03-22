import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../config/api';
import toast from 'react-hot-toast';

// ✅ FIX: type-only imports (removes TS1484 errors)
import type { 
  User, 
  FoodEntry, 
  ActivityEntry, 
  Credentials 
} from '../types';

// 1. Create the Context
export const AppContext = createContext<any>(null);

// 2. Define the Provider Component
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  // --- States ---
  const [user, setUser] = useState<User | null>(null);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [allFoodLogs, setAllFoodLogs] = useState<FoodEntry[]>([]);
  const [allActivityLogs, setAllActivityLogs] = useState<ActivityEntry[]>([]);
  
  const [isUserFetched, setIsUserFetched] = useState(() => {
    return localStorage.getItem('token') ? false : true;
  });

  // --- Auth Functions ---
  const fetchUser = async (token: string) => {
    try {
      const { data } = await API.get('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUser({ ...data, token });
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      if (data.age && data.weight && data.goal) {
        setOnboardingCompleted(true);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn("User session expired or server restarted. Logging out.");
        toast.error("Session expired. Please sign in or sign up again.");
        logout();
      } else {
        console.error("Failed to fetch user:", error);
      }
    } finally {
      setIsUserFetched(true);
    }
  };

  const signup = async (credentials: Credentials) => {
    try {
      const { data } = await API.post('/api/auth/local/register', credentials);
      
      const userData = { ...data.user, token: data.jwt };
      setUser(userData);
      localStorage.setItem('token', data.jwt);
      API.defaults.headers.common['Authorization'] = `Bearer ${data.jwt}`;
      
      return data;
    } catch (error: any) {
      const message = error.response?.data?.error?.message || "Signup failed";
      return { error: message };
    }
  };

  const login = async (credentials: any) => {
    try {
      const { data } = await API.post('/api/auth/local', {
        identifier: credentials.email,
        password: credentials.password,
      });

      const userData = { ...data.user, token: data.jwt };
      setUser(userData);
      localStorage.setItem('token', data.jwt);
      API.defaults.headers.common['Authorization'] = `Bearer ${data.jwt}`;

      if (data.user.age && data.user.weight && data.user.goal) {
        setOnboardingCompleted(true);
      }
      
      return data;
    } catch (error: any) {
      const message = error.response?.data?.error?.message || "Invalid email or password";
      return { error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setOnboardingCompleted(false);
    API.defaults.headers.common['Authorization'] = "";
    navigate('/');
  };

  const fetchFoodLogs = async (token: string) => {
    try {
      const { data } = await API.get('/api/food-logs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllFoodLogs(data);
    } catch (error) {
      console.error("Failed to fetch food logs", error);
    }
  };

  const fetchActivityLogs = async (token: string) => {
    try {
      const { data } = await API.get('/api/activity-logs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllActivityLogs(data);
    } catch (error) {
      console.error("Failed to fetch activity logs", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    } else {
      setIsUserFetched(true);
    }
  }, []);

  useEffect(() => {
    if (user?.token) {
      fetchFoodLogs(user.token);
      fetchActivityLogs(user.token);
    }
  }, [user?.token]);

  const value = {
    user,
    setUser,
    isUserFetched,
    onboardingCompleted,
    setOnboardingCompleted,
    allFoodLogs,
    setAllFoodLogs,
    allActivityLogs,
    setAllActivityLogs,
    signup,
    login,
    logout,
    fetchUser
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// ✅ ✅ THIS LINE FIXES 80% OF YOUR ERRORS
export const useAppContext = () => useContext(AppContext);