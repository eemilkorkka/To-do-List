const express = require("express")
const bcrypt = require("bcryptjs");
const router = express.Router()
const connection = require("../database");

router.get("/", (req, res) => {
    res.render("signup", { errorMessage: null });
}); 

router.post("/", (req, res) => {
    try {
        let name = req.body.name;
        let email = req.body.email;
        let username = req.body.username;
        let password = req.body.password;

        emailExists(email, async (exists) => {
            if (exists) {
                res.render("signup", { errorMessage: "An account with the email you entered already exists. Use a different email." });
            } else {
                const salt = await bcrypt.genSalt(10);
                const secretPass = await bcrypt.hash(password, salt);

                connection.query("INSERT INTO Users (Name, Email, Username, Password) VALUES (?, ?, ?, ?)", [name, email, username, secretPass]);
                res.redirect("/");
            }
        });

    } catch {
        res.redirect("/signup");
    }
});

function emailExists(email, callback) {
    connection.query("SELECT * FROM Users WHERE Email = ?", [email], (error, results) => {
        if (error) throw error;

        if (results.length > 0) {
            callback(true);
        } else {
            callback(false);
        }
    });
}

module.exports = { router, emailExists };