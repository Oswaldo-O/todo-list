import { createContext, useContext, useState } from 'react';

// Create the context
const AuthContext = createContext();

// Custom hook with error checking
export function useAuth() {
  const context = useContext(AuthContext);
  //console.log('Auth context:', context); // Remove this later
   
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


export function AuthProvider({ children }) {
  // State for authentication
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  const API_URL = import.meta.env.VITE_TARGET; ////////////////
  
  // Functions will go here...
    const login = async (userEmail, password) => {
    try {
        const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, password }),
        credentials: 'include',
        };
        
        const res = await fetch(`${API_URL}/api/users/logon`, options); //////////////////////////
        const data = await res.json();
        
        if (res.status === 200 && data.name && data.csrfToken) {
        // Success: Update state
        setEmail(data.name);
        setToken(data.csrfToken);
        return { success: true };
        } else {
        // Failure: Return error
        return {
            success: false,
            error: `Authentication failed: ${data?.message}`,
        };
        }
    } catch (error) {
        return {
        success: false,
        error: 'Network error during login',
        };
    }
    };
  


// =========================
  // LOGOUT (UPDATED)
  // =========================
  const logout = async () => {
    const csrfToken = token;

    // 1. If no token, just clear state
    if (!token) {
      setEmail('');
      setToken('');

      return {
        success: true,
        message: 'Already logged out',
      };
    }

    try {
      // 2. Call logout API
      const res = await fetch(`${API_URL}/api/users/logoff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Logout request failed');
      }

      return {
        success: true,
        message: 'Logged out successfully',
      };

    } catch (error) {
      return {
        success: false,
        error: error.message || 'Logout failed',
      };

    } finally {
      // 3. ALWAYS clear auth state
      setEmail('');
      setToken('');
    }
  };

  // =========================
  // CONTEXT VALUE
  // =========================
  const value = {
    email,
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };

  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}


