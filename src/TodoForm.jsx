import { useRef } from 'react';
function TodoForm({ onAddTodo }) {
  const inputRef = useRef();

  const handleAddTodo = (event) => {
    event.preventDefault();

    // .trim prevents whitespace only todos
    const todoTitle = inputRef.current.value.trim();
    if (todoTitle) { // Asegúrate de que el todo no esté vacío
      onAddTodo(todoTitle); // Llama a la función prop para añadir el nuevo todo
      event.target.reset(); // Resetea el formulario
      inputRef.current.focus(); // Enfoca nuevamente el campo de input
    }
  };

  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo</label>
      <input
        ref={inputRef}
        type="text"
        id="todoTitle"
        name="todoTitle"
        placeholder="Todo text"
        required
      />
      <button type="submit">
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;