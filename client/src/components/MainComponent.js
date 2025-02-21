import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodosRequest, fetchTodosSuccess, fetchTodosFailure, addTodo } from '../redux/actions';
import { fetchTodos, addTodo as addTodoApi } from '../api'; // Import from api.js
import { trainModel, predictTasks } from '../ai'; // Use predictTasks for task suggestion
import './mainComponent.css';

const MainComponent = () => {
  const dispatch = useDispatch();
  const { todos, loading, error } = useSelector((state) => state.data);
  const [newTodo, setNewTodo] = useState('');
  const [suggestedTask, setSuggestedTask] = useState('');
  const [model, setModel] = useState(null);  // State to hold the trained model

  useEffect(() => {
    const loadTodos = async () => {
      dispatch(fetchTodosRequest());
      try {
        const todosData = await fetchTodos();  // Use the fetchTodos from api.js
        dispatch(fetchTodosSuccess(todosData));
        const trainedModel = await trainModel(todosData); // Train AI model with existing todos
        setModel(trainedModel); // Set the trained model in state
        console.log("Model trained successfully.");
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

  const handleSuggestTask = async () => {
    if (model && todos.length > 0) {
        // Generate task suggestion using the trained model and current todos
        const suggestion = await predictTasks(model, todos);
        if (suggestion) {
            setSuggestedTask(suggestion.text);  // Show the most relevant task
            console.log("Predicted Tasks: ", suggestion);  // Log the suggestion to the console
        } else {
            setSuggestedTask("No suggestions available.");
        }
    } else {
        console.error('Model not trained or no todos available.');
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
      {suggestedTask && <p className="suggestion">Suggested Task: {suggestedTask}</p>}
      <button onClick={handleSuggestTask}>Get Task Suggestion</button>
      {/* Removed the Todo List */}
    </div>
  );
};

export default MainComponent;
