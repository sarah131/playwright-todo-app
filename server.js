const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname))); // Serve static files

let todos = [];
let idCounter = 1;

const sortTodos = () => {
    todos.sort((a, b) => a.completed - b.completed);
};

// Serve the index.html file when visiting "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/todos', (req, res) => {
    sortTodos();
    res.json(todos);
});

app.post('/todos', (req, res) => {
    const { task } = req.body;
    if (!task || task.trim() === '') {
        return res.status(400).json({ message: "Task cannot be empty" });
    }
    const newTodo = { id: idCounter++, task: task.trim(), completed: false };
    todos.push(newTodo);
    sortTodos();
    res.json(newTodo);
});

app.put('/todos/:id', (req, res) => {
    const todo = todos.find(t => t.id === parseInt(req.params.id));
    if (!todo) {
        return res.status(404).json({ message: "Task not found" });
    }
    todo.completed = !todo.completed;
    sortTodos();
    res.json(todo);
});

app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = todos.length;
    todos = todos.filter(t => t.id !== id);

    if (todos.length === initialLength) {
        return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted", remainingTasks: todos });
});

// Start the server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
