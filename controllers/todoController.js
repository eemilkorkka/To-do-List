const connection = require("../database");

const todoItems = [];

const getTodos = (req, res) => {
    if (req.session.isLoggedIn) {
        
        // Display the user's todos on the site
        connection.query("SELECT * FROM todos WHERE UserID = ?", [req.session.userID], (error, todos) => {
            if (error) {
                res.status(500).send("An error occurred whilst trying to access webpage.");
            } else {
                if (todos.length > 0) {
                    res.render("home", { newItems: todos });
                } else {
                    res.render("home", { newItems: [] });
                }
            }
        });
    } else {
        res.redirect("/");
    }
}

const createTodo = (req, res) => {
    const todoTitle = req.body.todoTitle;
    const todoDescription = req.body.todoDescription;
    const newTodo = { title: todoTitle, description: todoDescription };
    
    todoItems.push(newTodo);

    connection.query("INSERT INTO todos (TodoTitle, TodoDescription, UserID) VALUES (?, ?, ?)", [todoTitle, todoDescription, req.session.userID], (error, results) => {
        if (error) {
            res.status(500).send("An error occurred whilst trying to create new todo");
        }
    });

    res.redirect("/");
}

const editTodo = (req, res) => {
    const todoID = req.params.todoID;
    const editedTitle = req.body.title;
    const editedDescription = req.body.description;

    connection.query("UPDATE todos SET TodoTitle = ?, TodoDescription = ? WHERE TodoID = ?", [editedTitle, editedDescription, todoID], (error, result) => {
        if (error) {
            return res.status(500).send("An error occurred whilst trying to edit todo.");
        } else {
            if (result.affectedRows > 0) {
                res.sendStatus(200);
            } else {
                res.send("Failed to update todo.");
            }
        }
    });
}

const deleteTodo = (req, res) => {
    const todoID = req.params.todoID;

    connection.query("DELETE FROM todos WHERE TodoID = ?", [todoID], (error, result) => {
        if (error) {
            res.status(500).send("An error occurred whilst trying to delete a todo.");
        } else {
            if (result.affectedRows > 1) {
                res.sendStatus(200);
            } else {
                res.send("Failed to delete todo.");
            }
        }
    });
}

const markTodoAsCompleted = (req, res) => {
    const todoID = req.params.todoID;

    connection.query("UPDATE todos SET Completed = ? WHERE TodoID = ?", [1, todoID], (error, result) => {
        if (error) {
            res.status(500).send("An error occurred whilst trying to mark todo as completed.");
        } else {
            if (result.affectedRows > 0) {
                res.sendStatus(200);
            } else {
                res.send("Failed to mark todo as completed");
            }
        }
    });
}


module.exports = { getTodos, createTodo, deleteTodo, editTodo, markTodoAsCompleted };