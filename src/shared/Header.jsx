import { useAuth } from '../contexts/AuthContext'

function Header() {
  const { isAuthenticated } = useAuth()

  return (
    <>
      <h1>Todo List</h1>

      {isAuthenticated && (
        <p>Logged In</p>
      )}
    </>
  )
}

export default Header