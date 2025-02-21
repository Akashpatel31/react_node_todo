// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/todos';

// Fetch all todos
export const fetchTodos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add a new todo
export const addTodo = async (todo) => {
  try {
    const response = await axios.post(API_URL, todo);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Remove a todo
export const removeTodo = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    throw error;
  }
};

// Toggle a todo's completed status
export const toggleTodo = async (id) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
