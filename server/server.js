const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // Import cors
const bodyParser = require('body-parser'); // Import body-parser
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Enable body-parser

const server = http.createServer(app);
const io = socketIo(server);

// Connect to MongoDB
// Connect to MongoDB (Fix the issue)
mongoose.connect('mongodb://localhost:27017/todos')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));


const todoSchema = new mongoose.Schema({
  id: String,
  text: String,
  completed: Boolean,
});

const Todo = mongoose.model('Todo', todoSchema);

let todos = []; // In-memory storage for todos

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find({});
        console.log("Fetched Todos:", todos); // Debugging Log
        res.json(todos);
    } catch (error) {
        console.error("Error fetching todos:", error);
        res.status(500).json({ message: error.message });
    }
});

// Add a new todo
app.post('/todos', async (req, res) => {
    const newTodo = new Todo({
      id: req.body.id,
      text: req.body.text,
      completed: req.body.completed,
    });
  
    try {
      const savedTodo = await newTodo.save();
      res.status(201).json(savedTodo);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

// Remove a todo
app.delete('/todos/:id', async (req, res) => {
    try {
      await Todo.deleteOne({ id: req.params.id });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

// Toggle a todo
app.patch('/todos/:id', async (req, res) => {
    try {
      const todo = await Todo.findOne({ id: req.params.id });
      todo.completed = !todo.completed;
      const updatedTodo = await todo.save();
      res.status(200).json(updatedTodo);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});