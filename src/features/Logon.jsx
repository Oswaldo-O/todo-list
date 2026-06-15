import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function Logon() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoggingOn, setIsLoggingOn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingOn(true);
    setAuthError("");

    const result = await login(email, password);

    if (!result.success) {
      setAuthError(result.error);
    }

    setIsLoggingOn(false);
  };

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

export default Logon;