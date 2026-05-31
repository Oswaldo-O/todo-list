import { useEffect, useState, useCallback } from 'react';
import TodoList from './TodoList/TodoList';
import TodoForm from './TodoForm'
import SortBy from '../../shared/SortBy';
import useDebounce from '../../utils/useDebounce';
import FilterInput from '../../shared/FilterInput';

 function TodosPage({token}){
 const[error, setError] = useState("")
 const[isTodoListLoading, setIsTodoListLoading ] = useState(false)
 const[ todoList, setTodoList] =  useState([])

 const[ sortBy, setSortBy ] = useState("creationDate")
 const[ sortDirection, setSortDirection ] =useState("desc")

 const [filterTerm, setFilterTerm] = useState('');
 const debouncedFilterTerm = useDebounce(filterTerm, 300);

 const handleFilterChange = (newTerm) => { setFilterTerm(newTerm); };

 const [dataVersion, setDataVersion ] = useState(0);

 

 const invalidateCache = useCallback(() => { 
                                              console.log("Invalidating memo cache after todo mutation")
                                              setDataVersion((prev) => prev + 1)
                                             },[])

 const[filterError, setFilterError ] = useState("")


useEffect(() => {
    if (!token) return;

    async function fetchTodos() {
      setIsTodoListLoading(true);
      setError("");


      const paramsObject = {
        sortBy,
        sortDirection,
       };
      if (debouncedFilterTerm) {
        paramsObject.find = debouncedFilterTerm;
      }
      const params = new URLSearchParams(paramsObject);



      try {
        const response = await fetch(`/api/tasks?${params}`, {
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

        setFilterError("");

      } catch (error) {
        if (debouncedFilterTerm || sortBy !== 'creationDate' || sortDirection !== 'desc') {
          setFilterError(`Error filtering/sorting todos: ${error.message}`);
        } else {
          setError(`Error fetching todos: ${error.message}`);
        }
      } finally {
        setIsTodoListLoading(false);
      }
    }

    fetchTodos();
  }, [token, sortBy , sortDirection, debouncedFilterTerm  ]);
  



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

    invalidateCache();

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

    invalidateCache();

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

    invalidateCache();

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

   

   {/* ERROR SPECIFIC */}
  {filterError && (
      <div>
        <p>{filterError}</p>

        <button onClick={() => setFilterError("")}>
          Clear Filter Error
        </button>

        <button
          onClick={() => {
            setFilterTerm("");
            setSortBy("creationDate");
            setSortDirection("desc");
            setFilterError("");
          }}
        >
          Reset Filters
        </button>
      </div>
  )}

            

    {/* LOADING */}
    {isTodoListLoading && (
      <p>Loading todos...</p>
    )}

    <SortBy
      sortBy={sortBy}
      sortDirection={sortDirection}
      onSortByChange={setSortBy}
      onSortDirectionChange={setSortDirection}
    />

    <FilterInput
      filterTerm = {filterTerm}
      onFilterChange = {handleFilterChange}
    />

    <TodoForm onAddTodo={addTodo} />

    <TodoList 
      todoList={todoList} 
      onCompleteTodo={completeTodo}
      onUpdateTodo={updateTodo}
      dataVersion = {dataVersion }
    />
  </div>
)
}

export default TodosPage