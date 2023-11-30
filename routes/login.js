const express = require("express")
const router = express.Router()
const authenticationController = require("../controllers/authenticationController");
const todoController = require("../controllers/todoController");
const userController = require("../controllers/userController");

router.get("/", (req, res) => {
    res.render("login");
});

router.post("/", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    
    userController.getUserId(username, (error, userID) => {
        if (error) {
            console.log(error);
        } else {
            req.session.userID = userID;
        }
    })

    authenticationController.login(username, password, (error, results) => {
        if (error) {
            res.render("login", { errorMessage: error });
        } else {
            // Login successful
            req.session.isLoggedIn = true;
            req.session.username = username;
            console.log(req.session.userID);
            res.redirect("/home");
        }
    });
});

module.exports = router