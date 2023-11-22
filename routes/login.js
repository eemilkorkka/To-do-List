const express = require("express")
const bcrypt = require("bcryptjs");
const router = express.Router()
const connection = require("../database");

router.get("/", (req, res) => {
    res.render("login");
});

router.post("/", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    
    connection.query("SELECT Password FROM Users WHERE Username = ?", [username], (error, results) => {
        if (error) throw error;

        if (results.length > 0) {
            const hashedPassword = results[0].Password;

            bcrypt.compare(password, hashedPassword, (error, passwordMatch) => {
                if (passwordMatch) {
                    req.session.isLoggedIn = true;
                    req.session.username = username;
                    res.redirect("/home");
                } else {
                    res.status(401).send("Invalid email or password");
                }
            });
        } else {
            res.send("User not found.");
        }
    });
});

module.exports = router