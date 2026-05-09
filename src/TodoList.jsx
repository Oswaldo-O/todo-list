import TodoListItem from "./TodoListItem";

function TodoList({todoList, onCompleteTodo}) {
    const filteredTodoList = todoList.filter( function (todo) {
      return todo.isCompleted === false
    })


  return (
    todoList.lenght=== 0 ? (
    <p>Add todo above to get started</p>
    ) : (
      <ul>
        {filteredTodoList.map((todo)=>(
          <TodoListItem 
          key={todo.id} 
          todo={todo}
          onCompleteTodo = {onCompleteTodo}/>
        ))}
      </ul>

    )
  );
}

export default TodoList;