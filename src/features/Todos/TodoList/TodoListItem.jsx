import { useState,useRef,useEffect } from "react";
import TextInputWithLabel from "../../../shared/TextInputWithLabel";
import { isValidTodoTitle } from "../../../utils/todoValidation";
import styles from "./TodoListItem.module.css";


function TodoListItem({todo, onCompleteTodo,onUpdateTodo,onDeleteTodo,   }) {
  const [isEditing, setIsEditing] = useState(false)
  const [ workingTitle, setWorkingTitle ] = useState(todo.title)
  const todoInputRef = useRef(null);
  

    // 👉 AQUÍ VA EL useEffect
  useEffect(() => {
    if (isEditing) {
      todoInputRef.current?.focus();
    }
  }, [isEditing]);



  const handleCancel = () => {
  setWorkingTitle(todo.title);
  setIsEditing(false);
  };
  
  const handleEdit = (event) => {
  setWorkingTitle(event.target.value);
  };


  const handleUpdate = (event) => {
    if (!isEditing) {
      return;
    }

    event.preventDefault();

    onUpdateTodo({
      ...todo,
      title: workingTitle,
    });

    setIsEditing(false);
  };

  const handleDelete = () => {
  onDeleteTodo(todo.id);
  };


  return (
  <li className={`${styles.item} ${todo.isCompleted ? styles.itemCompleted : ""}`}>
    <form  onSubmit={handleUpdate}
           className={styles.form}
           >
        {isEditing ? (
          <>
            <TextInputWithLabel 
             elementId="todoTitle"
             labelText="Todo"
             onChange={handleEdit}
             ref={todoInputRef}
             value={workingTitle}
            />

            <div className={styles.buttonGroup}>
              <button type="button"
              className={`${styles.button} ${styles.cancelButton}`}
              onClick={handleCancel}
              >
              Cancel
            </button>

            <button
                type="submit"
                className={styles.button}

                disabled={!isValidTodoTitle(workingTitle)}
              >
                Update
              </button>
            </div>

           </> 
        ) : (
            
                <div className={styles.todoRow}>
                    <input
                        className={styles.checkbox}
                        type="checkbox"
                        id={`checkbox${todo.id}`}
                        checked={todo.isCompleted}
                        onChange={() => onCompleteTodo(todo.id, todo.isCompleted)}
                    />
                
                    <span className={
                              todo.isCompleted
                                    ? `${styles.title} ${styles.completed}`
                                    : styles.title
                                }

                              onClick={() => setIsEditing(true)}
                    >
                              
                    {todo.title}

                    </span>

                    <button
                      type="button"
                      onClick={handleDelete}
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
                </div>
            
        )}
    </form>
</li>

);
}

export default TodoListItem;


