const express = require("express")
const bcrypt = require("bcryptjs");
const router = express.Router()
const connection = require("../database");

router.get("/", (req, res) => {
    res.render("signup");
}); 

router.post("/", async (req, res) => {
    try {
        let name = req.body.name;
        let username = req.body.username;
        let password = req.body.password;

        usernameExists(username, async (exists) => {
            if (exists) {
                res.send("An account with the username you entered already exists. Use a different username.");
            } else {
                const salt = await bcrypt.genSalt(10);
                const secretPass = await bcrypt.hash(password, salt);

                connection.query("INSERT INTO Users (Name, Username, Password) VALUES (?, ?, ?)", [name, username, secretPass]);
                res.redirect("/");
            }
        });

    } catch {
        res.redirect("/signup");
    }
});

function usernameExists(username, callback) {
    connection.query("SELECT * FROM Users WHERE Username = ?", [username], (error, results) => {
        if (error) throw error;

        if (results.length > 0) {
            callback(true);
        } else {
            callback(false);
        }
    });
}

module.exports = router