const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // Import cors
const bodyParser = require('body-parser'); // Import body-parser
const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Enable body-parser

const server = http.createServer(app);
const io = socketIo(server);

let todos = []; // In-memory storage for todos

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Get all todos
app.get('/todos', (req, res) => {
  console.log('Received request for /todos');
  res.json(todos);
});

// Add a new todo
app.post('/todos', (req, res) => {
  const newTodo = req.body;
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// Remove a todo
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  todos = todos.filter(todo => todo.id !== id);
  res.status(204).end();
});

// Toggle a todo
app.patch('/todos/:id', (req, res) => {
  const { id } = req.params;
  todos = todos.map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  res.status(200).json(todos.find(todo => todo.id === id));
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});