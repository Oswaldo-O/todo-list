import { useState } from 'react';
import { useNavigate } from 'react-router';  // Add this import
import { useAuth } from '../contexts/AuthContext';

function Logoff() {
  const { logout } = useAuth();
  const navigate = useNavigate();  // Add this hook

  const [isLoggingOff, setIsLoggingOff] = useState(false);
  const [error, setError] = useState('');


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
    <>
    <button onClick={handleLogoff}  disabled={isLoggingOff}>
      {isLoggingOff ? 'Logging off...' : 'Log Off'}
    </button>

    {error && <p>{error}</p>}
    </>
  );
}

export default Logoff;


