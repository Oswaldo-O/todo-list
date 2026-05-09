import { useRef, useState } from 'react';
function TodoForm({ onAddTodo }) {

  const [ workingTodoTitle, setWorkingTodoTitle ] = useState("");
  const inputRef = useRef();

  const handleAddTodo = (event) => {
    event.preventDefault();

    // .trim prevents whitespace only todos
    const todoTitle = workingTodoTitle.trim();
    if (todoTitle) { 
      onAddTodo(todoTitle); 
      setWorkingTodoTitle("");
    }
  };

  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo</label>
      <input
        value = {workingTodoTitle}
        onChange={(event) =>{
          setWorkingTodoTitle(event.target.value)
        }}
        ref={inputRef}
        type="text"
        id="todoTitle"
        name="todoTitle"
        placeholder="Todo text"
        required
      />
      <button 
      type="submit"
      disabled={!workingTodoTitle.trim()}
      >
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;