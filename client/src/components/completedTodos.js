// CompletedTodos.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodosRequest, fetchTodosSuccess, fetchTodosFailure, toggleTodo, removeTodo } from '../redux/actions';
import { toggleTodo as toggleTodoApi, removeTodo as removeTodoApi } from '../api'; // Import from api.js

const CompletedTodos = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.data.todos.filter(todo => todo.completed));

  useEffect(() => {
    // Fetch all todos on component mount (if needed)
    const loadTodos = async () => {
      dispatch(fetchTodosRequest());
      try {
        const todosData = await fetchTodos();  // Use fetchTodos from api.js
        dispatch(fetchTodosSuccess(todosData));
      } catch (error) {
        dispatch(fetchTodosFailure(error.message));
      }
    };

    loadTodos();
  }, [dispatch]);

  const handleToggleTodo = async (id) => {
    try {
      const toggledTodo = await toggleTodoApi(id);  // Use the toggleTodo from api.js
      dispatch(toggleTodo(toggledTodo));  // Dispatch the updated todo to Redux store
    } catch (error) {
      console.error('Error toggling todo:', error.message);
    }
  };

  const handleRemoveTodo = async (id) => {
    try {
      await removeTodoApi(id);  // Use removeTodo from api.js
      dispatch(removeTodo(id));  // Dispatch the removal to Redux store
    } catch (error) {
      console.error('Error removing todo:', error.message);
    }
  };

  return (
    <div className="completed-todos">
      <h2>Completed Todos</h2>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item completed">
            <span onClick={() => handleToggleTodo(todo.id)}>
              {todo.text}
            </span>
            <button onClick={() => handleRemoveTodo(todo.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompletedTodos;
