//import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import TodosPage from './features/Todos/TodosPage'
import Header from './shared/Header'
import Logon from './features/Logon'
import { useAuth } from './contexts/AuthContext'



function App() {
  // const[ email, setEmail] = useState("")
  // const[ token, setToken] = useState("")
  const { isAuthenticated } = useAuth()

   return (
    <>
    <Header />

      {isAuthenticated ? (
        <TodosPage />
      ) : (
        <Logon />
      )}
    </>
   ) 
}

export default App

