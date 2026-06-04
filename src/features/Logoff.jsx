import { useAuth } from "../../contexts/AuthContext";

function Logoff() {
  const { logout } = useAuth();

  const handleLogout = () => {
    try {
      logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <button onClick={handleLogout}>
      Log Off
    </button>
  );
}

export default Logoff;