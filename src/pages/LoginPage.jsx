import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get intended destination from location state, default to /todos
  const from = location.state?.from?.pathname || '/todos';

  ////////////////////////////////////////////////
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingOn, setIsLoggingOn] = useState(false);

//////////////////////////////////////////////////////

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);


  // Handle login form submission
  async function handleSubmit(e) {
    e.preventDefault();
    // ... existing login logic
            setIsLoggingOn(true);
            setAuthError("");


    const result = await login(email, password);
    if (!result.success) {
      // useEffect will handle redirect
      ////////////////////
      setAuthError(result.error);
      /////////////////////
    }
////////////////////////////
    setIsLoggingOn(false);
/////////////////////
  }
  
  // ... rest of component with form JSX
////////////////////////////////////
return (
    <form onSubmit={handleSubmit}>
      {authError && <p>{authError}</p>}

      <div>
        <label>Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label>Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button type="submit" disabled={isLoggingOn}>
        {isLoggingOn ? "Logging in..." : "Log On"}
      </button>
    </form>
  );
}

export default LoginPage;

