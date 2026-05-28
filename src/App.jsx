import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import TodosPage from './features/Todos/TodosPage'
import Header from './shared/Header'
import Logon from './features/Logon'



function App() {
  const[ email, setEmail] = useState("")
  const[ token, setToken] = useState("")

   return (
    <>
    <Header
      token = {token}
      onSetToken ={setToken}
      onSetEmail = {setEmail}
    />

    { token ? (
      <TodosPage token={token} />
    ):(
    <Logon 
      onSetEmail={setEmail} 
      onSetToken={setToken} 
    />
    )}
    
    </>
   ) 
}

export default App

