import {  useState, useRef  } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel';
import { isValidTodoTitle } from '../../utils/todoValidation';
import styles from './TodoForm.module.css';


function TodoForm({ onAddTodo }) {

  const [ workingTodoTitle, setWorkingTodoTitle ] = useState("");
  const todoInputRef = useRef(null);
  

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
    <form className={styles.form} onSubmit={handleAddTodo}>
      <div className={styles.inputWrapper}>
      <TextInputWithLabel
        elementId="todoTitle"
        labelText="Todo"
        onChange={(event) =>{
          setWorkingTodoTitle(event.target.value)
        }}
        ref={todoInputRef}
        value={workingTodoTitle}
        
      />


      <button 
        className={styles.button}
        disabled={!isValidTodoTitle(workingTodoTitle)}
      >
        Add Todo
      </button>
      </div>
    </form>
  );
}

export default TodoForm;


     