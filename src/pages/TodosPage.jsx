import { useSearchParams } from 'react-router';
import StatusFilter from '../shared/StatusFilter';
import { useEffect, useState, useCallback,useReducer } from 'react';
import TodoList from '../features/Todos/TodoList/TodoList';
import TodoForm from '../features/Todos/TodoForm'
import SortBy from '../shared/SortBy';
import useDebounce from '../utils/useDebounce';
import FilterInput from '../shared/FilterInput';
import { useAuth } from '../contexts/AuthContext';



import {
  todoReducer,
  initialTodoState,
  TODO_ACTIONS,
} from '../reducers/todoReducer';



 function TodosPage(){
  const { token } = useAuth();

  const [searchParams] = useSearchParams();  // Add this line

  const [state, dispatch] = useReducer(todoReducer, initialTodoState);

   // Get status filter from URL, default to 'all'
  const statusFilter = searchParams.get('status') || 'all';  // Add this line

  const {
    todoList,
    isTodoListLoading,
    error,
    filterError,
    sortBy,
    sortDirection,
    filterTerm,
    dataVersion,
  } = state;

 const debouncedFilterTerm = useDebounce(filterTerm, 300);

 const handleFilterChange = (newTerm) => { 
                                            dispatch({
                                              type: TODO_ACTIONS.SET_FILTER_TERM,
                                              payload: newTerm,
                                            });
                                          };

                                          
 const invalidateCache = useCallback(() => { 
                                            //  console.log("Invalidating memo cache after todo mutation")
                                              dispatch({ type: TODO_ACTIONS.SET_DATA_VERSION });
                                             },[dispatch])




useEffect(() => {
    if (!token) return;




    async function fetchTodos() {
       dispatch({ type: TODO_ACTIONS.FETCH_START });


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
        dispatch({
          type: TODO_ACTIONS.FETCH_SUCCESS,
          payload: data.tasks,
        });


      } catch (error) {
       dispatch({
        type: TODO_ACTIONS.FETCH_ERROR,
        payload: error.message,
      });
    }
  }

    fetchTodos();
  }, [token, sortBy , sortDirection, debouncedFilterTerm  ]);
  



  async function addTodo(todoTitle) {
  // 1. crear id temporal
  const tempId = Date.now();

  dispatch({
    type: TODO_ACTIONS.ADD_TODO_START,
    payload: { tempId, title: todoTitle },
  });

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

    dispatch({
      type: TODO_ACTIONS.ADD_TODO_SUCCESS,
      payload: { tempId, savedTodo },
    });
    

  } catch (err) {
    dispatch({
      type: TODO_ACTIONS.ADD_TODO_ERROR,
      payload: { tempId, error: err.message },
    });
  }
}

  

  async function completeTodo(id) {
  // 1. guardar original
  const originalTodo = todoList.find(
    (todo) => todo.id === id
  );

    dispatch({
    type: TODO_ACTIONS.COMPLETE_TODO_START,
    payload: { id },
  });


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

    dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS,
      payload: { id },
    });
    
  } catch (err) {
   dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
      payload: {
        id,
        originalTodo,
        error: err.message,
      },
    });
  }
}

    async function updateTodo(editedTodo) {
  // 1. guardar original (para rollback)
  const originalTodo = todoList.find(
    (todo) => todo.id === editedTodo.id
  );

  dispatch({
    type: TODO_ACTIONS.UPDATE_TODO_START,
    payload: { editedTodo },
  });

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

    dispatch({
      type: TODO_ACTIONS.UPDATE_TODO_SUCCESS,
      payload: { updatedTodo: editedTodo },
    });

    
    invalidateCache();

    // opcional: puedes sincronizar con backend
    // const updated = await response.json();

  } catch (err) {
    dispatch({
      type: TODO_ACTIONS.UPDATE_TODO_ERROR,
      payload: {
        originalTodo,
        error: err.message,
      },
    });
  }
}




   return (
  <div>
    <h1>My Todos</h1>

    {/* ERROR SECTION */}
    {error && (
      <div>
        <p>{error}</p>

        <button onClick={() =>  dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })}>
          Clear Error
        </button>
      </div>
    )}

   

   {/* ERROR SPECIFIC */}
  {filterError && (
      <div>
        <p>{filterError}</p>

        <button onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_FILTER_ERROR })}>
          Clear Filter Error
        </button>

        <button
          onClick={() =>   dispatch({ type: TODO_ACTIONS.RESET_FILTERS })
          }
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
      onSortByChange={(newSortBy) =>
            dispatch({
              type: TODO_ACTIONS.SET_SORT,
              payload: {
                sortBy: newSortBy,
                sortDirection,
              },
            })
          }
      onSortDirectionChange={(newDirection) =>
            dispatch({
              type: TODO_ACTIONS.SET_SORT,
              payload: {
                sortBy,
                sortDirection: newDirection,
              },
            })
          }

    />

     <StatusFilter />  {/* Add this component */}

    
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
      statusFilter={statusFilter}  /* Add this prop */
    />
  </div>
)
}

export default TodosPage


