import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import TodoList from './TodoList';
import TodoForm from './TodoForm';




function App() {
  const[ todoList, setTodoList] =  useState([])
  
  function addTodo(todoTitle){
    const newTodo = {
      id: Date.now(),
      title: todoTitle
    };

  setTodoList(previous => [newTodo, ...previous])

  }

    return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo}/>
      <TodoList todoList={todoList} />
    </div>
  )
}

export default App
