import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { fetchTodosRequest, fetchTodosSuccess, fetchTodosFailure, addTodo, removeTodo, toggleTodo } from '../redux/actions';
import './mainComponent.css'; // Ensure the correct path and filename

const MainComponent = () => {
  const dispatch = useDispatch();
  const { todos, loading, error } = useSelector((state) => state.data);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      dispatch(fetchTodosRequest());
      try {
        const response = await axios.get('http://localhost:5000/todos');
        console.log('Received response from /todos:', response.data);
        dispatch(fetchTodosSuccess(response.data));
      } catch (error) {
        console.error('Error fetching todos:', error.message);
        dispatch(fetchTodosFailure(error.message));
      }
    };

    fetchTodos();
  }, [dispatch]);

  const handleAddTodo = async () => {
    const todo = { id: Date.now().toString(), text: newTodo, completed: false };
    try {
      const response = await axios.post('http://localhost:5000/todos', todo);
      dispatch(addTodo(response.data));
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error.message);
    }
  };

  const handleRemoveTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/todos/${id}`);
      dispatch(removeTodo(id));
    } catch (error) {
      console.error('Error removing todo:', error.message);
    }
  };

  const handleToggleTodo = async (id) => {
    try {
      const response = await axios.patch(`http://localhost:5000/todos/${id}`);
      dispatch(toggleTodo(response.data));
    } catch (error) {
      console.error('Error toggling todo:', error.message);
    }
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