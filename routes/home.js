const express = require("express");
const router = express.Router()
const todoController = require("../controllers/todoController");
const userController = require("../controllers/userController");

const todoItems = [];

router.get("/", (req, res) => {
    if (req.session.isLoggedIn) {

        // Display the user's todos on the site
        todoController.getTodos(req.session.userID, (error, todos) => {
            if (error) {
                console.log(error);
                res.render("home", { newItems: [] });
            } else {
                res.render("home", { newItems: todos });
            }
        });
    } else {
        res.redirect("/");
    }
});

router.post("/", (req, res) => {
    const todoTitle = req.body.todoTitle;
    const todoDescription = req.body.todoDescription;
    const newTodo = { title: todoTitle, description: todoDescription };
    
    todoItems.push(newTodo);

    todoController.createTodo(todoTitle, todoDescription, req.session.userID, (error, results) => {
        if (error) {
            console.log(error);
        }
    });

    res.redirect("/");
});

module.exports = router