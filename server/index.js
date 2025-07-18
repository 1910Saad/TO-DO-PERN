const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db'); // Import the database connection
const path = require('path');

//midleware
app.use(cors()); // allows cross-origin requests
app.use(express.json()); // parses incoming JSON requests
app.use(express.static(path.join(__dirname, '../client/build')));

//ROUTES//

// get all todos
app.get('/todos', async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todo");
        res.json(allTodos.rows); // Return all todos as JSON
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error'); // Send a 500 error if something goes wrong
    }
})

// get a todo
app.get('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params; // Get the todo ID from the request parameters
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);
        
        if (todo.rows.length === 0) {
            return res.status(404).send('Todo not found'); // Send a 404 error if the todo is not found
        }
        
        res.json(todo.rows[0]); // Return the found todo
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error'); // Send a 500 error if something goes wrong
    }
})

// create a todo
app.post('/todos', async (req, res) => {
    try {
        const { description } = req.body; // Get the description from the request body
        const newTodo = await pool.query(
            "INSERT INTO todo (description) VALUES($1) RETURNING *",
            [description]
        );
        res.json(newTodo.rows[0]); // Return the newly created todo
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error'); // Send a 500 error if something goes wrong
    }
})

// update a todo
app.put('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params; // Get the todo ID from the request parameters
        const { description } = req.body; // Get the new description from the request body
        
        const updateTodo = await pool.query(
            "UPDATE todo SET description = $1 WHERE todo_id = $2 RETURNING *",
            [description, id]
        );
        
        if (updateTodo.rows.length === 0) {
            return res.status(404).send('Todo not found'); // Send a 404 error if the todo is not found
        }
        
        res.json(updateTodo.rows[0]); // Return the updated todo
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error'); // Send a 500 error if something goes wrong
    }
})

// delete a todo
app.delete('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params; // Get the todo ID from the request parameters
        const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);
        
        if (deleteTodo.rowCount === 0) {
            return res.status(404).send('Todo not found'); // Send a 404 error if the todo is not found
        }
        
        res.json({ message: 'Todo deleted successfully' }); // Return a success message
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error'); // Send a 500 error if something goes wrong
    }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});