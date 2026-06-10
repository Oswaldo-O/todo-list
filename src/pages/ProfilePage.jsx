import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

function ProfilePage() {
  const { user, token } = useAuth();

  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    active: 0,
  });

  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState('');

 useEffect(() => {
  async function fetchTodoStats() {
    if (!token) return;

    try {
      setLoading(true);
      setError('');

      const options = {
        method: 'GET',
        headers: { 'X-CSRF-TOKEN': token },
        credentials: 'include',
      };

      const response = await fetch('/api/tasks', options);

      if (response.status === 401) {
        throw new Error('Unauthorized');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }

      const todos = await response.json();

      // Calculate statistics
      const total = todos.length;
      const completed = todos.filter((todo) => todo.isCompleted).length;
      const active = total - completed;

      setTodoStats({ total, completed, active });
    } catch (err) {
      setError(`Error loading statistics: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  fetchTodoStats();
}, [token]);


  return (
    <div>
      <h1>Profile</h1>

      <section>
        <h2>User Information</h2>

        <p>
          <strong>Name:</strong> {user?.name || 'Unknown User'}
        </p>

        <p>
          <strong>Token:</strong> {token}
        </p>
      </section>

      <section>
        <h2>Todo Statistics</h2>

        {Loading && <p>Loading statistics...</p>}

        {error && <p>{error}</p>}

        {!Loading && !error && (
          <ul>
            <li>Total Todos: {stats.total}</li>
            <li>Completed Todos: {stats.completed}</li>
            <li>Active Todos: {stats.active}</li>
          </ul>
        )}
      </section>
    </div>
  );
}

export default ProfilePage;