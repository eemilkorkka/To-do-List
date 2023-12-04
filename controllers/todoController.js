const connection = require("../database");

const todoItems = [];

const getTodos = (req, res) => {
    if (req.session.isLoggedIn) {
        
        // Display the user's todos on the site
        connection.query("SELECT * FROM Todos WHERE UserID = ?", [req.session.userID], (error, todos) => {
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

    connection.query("INSERT INTO Todos (TodoTitle, TodoDescription, UserID) VALUES (?, ?, ?)", [todoTitle, todoDescription, req.session.userID], (error, results) => {
        if (error) {
            res.status(500).send("An error occurred whilst trying to create new todo");
        }
    });

    res.redirect("/");
}

const updateTodo = (req, res) => {
    const todoID = req.params.todoID;

    connection.query("UPDATE Todos SET Completed = ? WHERE TodoID = ?", [1, todoID], (error, result) => {
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

const deleteTodo = (req, res) => {
    const todoID = req.params.todoID;

    connection.query("DELETE FROM Todos WHERE TodoID = ?", [todoID], (error, result) => {
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


module.exports = { getTodos, createTodo, deleteTodo, updateTodo };