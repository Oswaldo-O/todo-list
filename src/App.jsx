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
      title: todoTitle,
      isCompleted: false
    };

  setTodoList(previous => [newTodo, ...previous])

  }

    function completeTodo (id) {
      const updatedTodos = todoList.map(todo =>{
        if(todo.id ===id){
          return {...todo, isCompleted:true}
        }
        return todo
      })
      setTodoList(updatedTodos)
    }


    return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo}/>
      <TodoList 
      todoList={todoList} 
      onCompleteTodo  = {completeTodo }
      />
    </div>
  )
}

export default App
