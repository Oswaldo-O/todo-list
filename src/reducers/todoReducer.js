export const TODO_ACTIONS = {
  // =========================
  // FETCH OPERATIONS
  // =========================
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',

  // =========================
  // ADD TODO OPERATIONS
  // =========================
  ADD_TODO_START: 'ADD_TODO_START',
  ADD_TODO_SUCCESS: 'ADD_TODO_SUCCESS',
  ADD_TODO_ERROR: 'ADD_TODO_ERROR',

  // =========================
  // COMPLETE TODO OPERATIONS
  // =========================
  COMPLETE_TODO_START: 'COMPLETE_TODO_START',
  COMPLETE_TODO_SUCCESS: 'COMPLETE_TODO_SUCCESS',
  COMPLETE_TODO_ERROR: 'COMPLETE_TODO_ERROR',

  // =========================
  // UPDATE TODO OPERATIONS
  // =========================
  UPDATE_TODO_START: 'UPDATE_TODO_START',
  UPDATE_TODO_SUCCESS: 'UPDATE_TODO_SUCCESS',
  UPDATE_TODO_ERROR: 'UPDATE_TODO_ERROR',

  // =========================
  // UI OPERATIONS (NO API)
  // =========================
  SET_SORT: 'SET_SORT',
  //SET_SORT_BY: 'SET_SORT_BY',
  //: 'SET_SORT_DIRECTION',
  SET_FILTER_TERM: 'SET_FILTER_TERM',

  CLEAR_ERROR: 'CLEAR_ERROR',
  CLEAR_FILTER_ERROR: 'CLEAR_FILTER_ERROR',

  RESET_FILTERS: 'RESET_FILTERS',

  // =========================
  // OPTIONAL (useful extras)
  // =========================
  SET_DATA_VERSION: 'SET_DATA_VERSION',
};





export const initialTodoState = {
  todoList: [],
  error: '',
  filterError: '',
  isTodoListLoading: false,
  sortBy: 'createdDate',
  sortDirection: 'asc',
  filterTerm: '',
  dataVersion: 0,
};



export function todoReducer(state, action) {
  switch (action.type) {
    // We'll add cases here
    case TODO_ACTIONS.FETCH_START:
    return {
        ...state,
        isTodoListLoading: true,
        error: '',
        filterError: '',
    };

    case TODO_ACTIONS.FETCH_SUCCESS:
        return {
            ...state,
            isTodoListLoading: false,
            todoList: action.payload,
        };


    case TODO_ACTIONS.FETCH_ERROR:
        return {
            ...state,
            isTodoListLoading: false,
            error: action.payload,
        };


    
    case TODO_ACTIONS.ADD_TODO_START: {
        const tempTodo = {
            id: action.payload.tempId,
            title: action.payload.title,
            isCompleted: false,
        };

        return {
            ...state,
            todoList: [tempTodo, ...state.todoList],
            error: '',
        };
        }


    
    case TODO_ACTIONS.ADD_TODO_SUCCESS:
        return {
            ...state,
            todoList: state.todoList.map((todo) =>
            todo.id === action.payload.tempId
                ? action.payload.savedTodo
                : todo
            ),
        };


    
    case TODO_ACTIONS.ADD_TODO_ERROR:
        return {
            ...state,
            todoList: state.todoList.filter(
            (todo) => todo.id !== action.payload.tempId
            ),
            error: action.payload.error,
        };


    case TODO_ACTIONS.COMPLETE_TODO_START: {
        return {
            ...state,
            todoList: state.todoList.map((todo) =>
            todo.id === action.payload.id
                ? { ...todo, isCompleted: !todo.isCompleted }
                : todo
            ),
            error: '',
        };
        }


    case TODO_ACTIONS.COMPLETE_TODO_SUCCESS: {
        return {
            ...state,
        };
        }


    case TODO_ACTIONS.COMPLETE_TODO_ERROR: {
        return {
            ...state,
            todoList: state.todoList.map((todo) =>
            todo.id === action.payload.id
                ? action.payload.originalTodo
                : todo
            ),
            error: action.payload.error,
        };
        }


    case TODO_ACTIONS.UPDATE_TODO_START: {
        return {
            ...state,
            todoList: state.todoList.map((todo) =>
            todo.id === action.payload.editedTodo.id
                ? action.payload.editedTodo
                : todo
            ),
            error: '',
        };
        }




    case TODO_ACTIONS.UPDATE_TODO_SUCCESS: {
        return {
            ...state,
            todoList: state.todoList.map((todo) =>
            todo.id === action.payload.updatedTodo.id
                ? action.payload.updatedTodo
                : todo
            ),
        };
        }


    case TODO_ACTIONS.UPDATE_TODO_ERROR: {
        return {
            ...state,
            todoList: state.todoList.map((todo) =>
            todo.id === action.payload.originalTodo.id
                ? action.payload.originalTodo
                : todo
            ),
            error: action.payload.error,
        };
        }

/*
    case TODO_ACTIONS.SET_SORT_BY:
        return {
            ...state,
            sortBy: action.payload,
        };


    case TODO_ACTIONS.SET_SORT_DIRECTION:
        return {
            ...state,
            sortDirection: action.payload,
        };

*/
    case TODO_ACTIONS.SET_SORT:
        return {
            ...state,
            sortBy: action.payload.sortBy,
            sortDirection: action.payload.sortDirection,
        };

        
    case TODO_ACTIONS.SET_FILTER_TERM:
        return {
            ...state,
            filterTerm: action.payload,
        };
    

    case TODO_ACTIONS.CLEAR_ERROR:
        return {
            ...state,
            error: '',
        };

    

    case TODO_ACTIONS.CLEAR_FILTER_ERROR:
        return {
            ...state,
            filterError: '',
        };



    case TODO_ACTIONS.RESET_FILTERS:
        return {
            ...state,
            filterTerm: '',
            sortBy: 'createdDate',
            sortDirection: 'asc',
            filterError: '',
        };


    case TODO_ACTIONS.SET_DATA_VERSION:
        return {
            ...state,
            dataVersion: state.dataVersion + 1,
        };
            

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}