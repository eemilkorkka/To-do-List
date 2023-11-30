const express = require("express");
const router = express.Router()
const connection = require("../database");

const todoItems = [];

router.get("/", (req, res) => {
    if (req.session.isLoggedIn) {
        fetchUserTodos(req.session.username, req, (error, todos) => {
            if (error) {
                console.log(error);
                res.render("home", { newItems: [] });
            } else {
                console.log(todos);
                res.render("home", { newItems: todos });
            }
        })
    } else {
        res.redirect("/");
    }
});

router.post("/", (req, res) => {
    const todoTitle = req.body.todoTitle;
    const todoDescription = req.body.todoDescription;
    const newTodo = { title: todoTitle, description: todoDescription };
    const todoID = Math.random().toString(16).slice(2);
    
    todoItems.push(newTodo);

    getUserId(req.session.username, (error, userID) => {
        if (error) {
            console.log(error);
        } else {
            // Insert todo into the database
            connection.query("INSERT INTO Todos (TodoID, TodoTitle, TodoDescription, UserID) VALUES (?, ?, ?, ?)", [todoID, todoTitle, todoDescription, userID]);
        }
    });

    res.redirect("/");
});

function getUserId(username, callback) {
    connection.query("SELECT UserID FROM Users WHERE Username = ?", [username], (error, results) => {
        if (error) return callback(error, null);

        if (results.length > 0) {
            const userID = results[0].UserID;
            callback(null, userID);
        } else {
            callback(new Error("User not found"), null);
        }
    });
}

function fetchUserTodos(userID, req, callback) {
    getUserId(req.session.username, (error, userID) => {
        if (error) {
            return callback(error, null);
        } else {
            connection.query("SELECT * FROM Todos WHERE UserID = ?", [userID], (error, results) => {
                if (error) {
                    return callback(error, null);
                } else {
                    callback(null, results);
                }
            });
        }
    });
}

module.exports = router