import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import TodoList from './TodoList';
import TodoForm from './TodoForm';


  const todos = [
    {id: 1, title: "review resources"},
    {id: 2, title: "take notes"},
    {id: 3, title: "code out app"},
  ]

function App() {
  const[ todoList, setTodoList] =  useState(todos)

    return (
    <div>
      <h1>My Todos</h1>
      <TodoForm />
      <TodoList todoList={todoList} />
    </div>
  )
}

export default App
