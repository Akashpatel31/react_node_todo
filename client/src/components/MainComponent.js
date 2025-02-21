// MainComponent.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodosRequest, fetchTodosSuccess, fetchTodosFailure, addTodo, removeTodo, toggleTodo } from '../redux/actions';
import { fetchTodos, addTodo as addTodoApi, removeTodo as removeTodoApi, toggleTodo as toggleTodoApi } from '../api'; // Import from api.js
import { trainModel, predictTasks } from '../ai'; // Change suggestTask to predictTasks
import './mainComponent.css';

const MainComponent = () => {
  const dispatch = useDispatch();
  const { todos, loading, error } = useSelector((state) => state.data);
  const [newTodo, setNewTodo] = useState('');
  const [suggestedTask, setSuggestedTask] = useState('');

  useEffect(() => {
    const loadTodos = async () => {
      dispatch(fetchTodosRequest());
      try {
        const todosData = await fetchTodos();  // Use the fetchTodos from api.js
        dispatch(fetchTodosSuccess(todosData));
        await trainModel(todosData); // Train AI model with existing todos
      } catch (error) {
        dispatch(fetchTodosFailure(error.message));
      }
    };

    loadTodos();
  }, [dispatch]);

  const handleAddTodo = async () => {
    const todo = { id: Date.now().toString(), text: newTodo, completed: false };
    try {
      const addedTodo = await addTodoApi(todo);  // Use the addTodo from api.js
      dispatch(addTodo(addedTodo));
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error.message);
    }
  };

  const handleRemoveTodo = async (id) => {
    try {
      await removeTodoApi(id);  // Use removeTodo from api.js
      dispatch(removeTodo(id));
    } catch (error) {
      console.error('Error removing todo:', error.message);
    }
  };

  const handleToggleTodo = async (id) => {
    try {
      const toggledTodo = await toggleTodoApi(id);  // Use toggleTodo from api.js
      dispatch(toggleTodo(toggledTodo));
    } catch (error) {
      console.error('Error toggling todo:', error.message);
    }
  };

  const handleSuggestTask = async () => {
    const suggestion = await suggestTask();
    setSuggestedTask(suggestion);
  };

  return (
    <div className="main-component">
      <h1>Todo List</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error">Error: {error}</p>}
      <div className="todo-input">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
        />
        <button onClick={handleAddTodo}>Add Todo</button>
      </div>
      {suggestedTask && <p className="suggestion">Suggested Task: {suggestedTask}</p>}
      <button onClick={handleSuggestTask}>Get Task Suggestion</button>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
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

export default MainComponent;
