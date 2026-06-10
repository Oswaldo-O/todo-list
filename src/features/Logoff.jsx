import { useState } from 'react';
import { useNavigate } from 'react-router';  // Add this import
import { useAuth } from '../contexts/AuthContext';

function Logoff() {
  const { logout } = useAuth();
  const navigate = useNavigate();  // Add this hook

  async function handleLogoff() {
    setIsLoggingOff(true);
    setError('');

    const result = await logout();

    if (result.success) {
      navigate('/login');  // Add this navigation
    } else {
      setError(result.error);
      setIsLoggingOff(false);
    }
  }

  return (
    <button onClick={handleLogout}>
      Log Off
    </button>
  );
}

export default Logoff;
