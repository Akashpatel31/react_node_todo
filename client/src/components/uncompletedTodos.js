import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTodo, removeTodo } from '../redux/actions';

const UncompletedTodos = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.data.todos.filter(todo => !todo.completed));

  const handleToggleTodo = (id) => {
    dispatch(toggleTodo({
      id,
      completed: true,
    }));
  };

  const handleRemoveTodo = (id) => {
    dispatch(removeTodo(id));
  };

  return (
    <div className="uncompleted-todos">
      <h2>Uncompleted Todos</h2>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
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

export default UncompletedTodos;