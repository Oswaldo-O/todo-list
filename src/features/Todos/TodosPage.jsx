import { useEffect, useState } from 'react';
import TodoList from './TodoList/TodoList';
import TodoForm from './TodoForm'

 function TodosPage({token}){
 const[error, setError] = useState("")
 const[isTodoListLoading, setIsTodoListLoading ] = useState(false)

 const[ todoList, setTodoList] =  useState([])



useEffect(() => {
    if (!token) return;

    async function fetchTodos() {
      setIsTodoListLoading(true);
      setError("");

      try {
        const response = await fetch("/api/tasks", {
          method: "GET",
          credentials: "include",
          headers: {
            "X-CSRF-TOKEN": token,
          },
        });

        if (response.status === 401) {
          throw new Error("unauthorized");
        }

        if (!response.ok) {
          throw new Error("error fetching todos");
        }

        const data = await response.json();

        // backend: { tasks: [], pagination: {} }
        setTodoList(data.tasks);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsTodoListLoading(false);
      }
    }

    fetchTodos();
  }, [token]);
  



  async function addTodo(todoTitle) {
  // 1. crear id temporal
  const tempId = Date.now();

  const newTodo = {
    id: tempId,
    title: todoTitle,
    isCompleted: false,
  };

  // 2. optimistic update (UI inmediata)
  setTodoList((prev) => [newTodo, ...prev]);

  try {
    // 3. llamada API
    const response = await fetch("/api/tasks", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": token,
      },
      body: JSON.stringify({
        title: todoTitle,
        isCompleted: false,
      }),
    });

    if (!response.ok) {
      throw new Error("error creating todo");
    }

    const savedTodo = await response.json();

    // 4. reemplazar el temporal por el real
    setTodoList((prev) =>
      prev.map((todo) =>
        todo.id === tempId ? savedTodo : todo
      )
    );

  } catch (err) {
    // 5. rollback si falla
    setTodoList((prev) =>
      prev.filter((todo) => todo.id !== tempId)
    );

    setError(err.message);
  }
}

  

  async function completeTodo(id) {
  // 1. guardar original
  const originalTodo = todoList.find(
    (todo) => todo.id === id
  );

  // 2. optimistic update
  setTodoList((prev) =>
    prev.map((todo) =>
      todo.id === id
        ? { ...todo, isCompleted: true }
        : todo
    )
  );

  try {
    // 3. request backend
    const response = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": token,
      },
      body: JSON.stringify({
        isCompleted: true,
      }),
    });

    if (!response.ok) {
      throw new Error("error completing todo");
    }

  } catch (err) {
    // 4. rollback
    setTodoList((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? originalTodo
          : todo
      )
    );

    setError(err.message);
  }
}

    




    async function updateTodo(editedTodo) {
  // 1. guardar original (para rollback)
  const originalTodo = todoList.find(
    (todo) => todo.id === editedTodo.id
  );

  // 2. optimistic update (UI inmediata)
  setTodoList((prev) =>
    prev.map((todo) =>
      todo.id === editedTodo.id ? editedTodo : todo
    )
  );

  try {
    // 3. request al backend
    const response = await fetch(
      `/api/tasks/${editedTodo.id}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        body: JSON.stringify({
          title: editedTodo.title,
          isCompleted: editedTodo.isCompleted,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("error updating todo");
    }

    // opcional: puedes sincronizar con backend
    // const updated = await response.json();

  } catch (err) {
    // 4. rollback si falla
    setTodoList((prev) =>
      prev.map((todo) =>
        todo.id === editedTodo.id
          ? originalTodo
          : todo
      )
    );

    setError(err.message);
  }
}




   return (
  <div>
    <h1>My Todos</h1>

    {/* ERROR SECTION */}
    {error && (
      <div>
        <p>{error}</p>

        <button onClick={() => setError("")}>
          Clear Error
        </button>
      </div>
    )}

    {/* LOADING */}
    {isTodoListLoading && (
      <p>Loading todos...</p>
    )}

    <TodoForm onAddTodo={addTodo} />

    <TodoList 
      todoList={todoList} 
      onCompleteTodo={completeTodo}
      onUpdateTodo={updateTodo}
    />
  </div>
)
}

export default TodosPage