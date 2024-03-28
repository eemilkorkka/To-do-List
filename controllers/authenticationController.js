const connection = require("../database");
const bcrypt = require("bcryptjs");
const userController = require("../controllers/userController");

function emailExists(email, callback) {
    connection.query("SELECT * FROM users WHERE Email = ?", [email], (error, results) => {
        if (error) throw error;

        if (results.length > 0) {
            callback(true);
        } else {
            callback(false);
        }
    });
}

const signup = (req, res) => {
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

                connection.query("INSERT INTO users (Name, Email, Username, Password) VALUES (?, ?, ?, ?)", [name, email, username, secretPass]);
                res.redirect("/");
            }
        });

    } catch {
        res.redirect("/signup");
    }
}

const login = (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    
    userController.getUserId(username, (error, userID) => {
        if (error) {
            console.log(error);
        } else {
            req.session.userID = userID;
        }
    });

    connection.query("SELECT Password FROM users WHERE Username = ?", [username], (error, results) => {
        if (error) throw error;

        if (results.length > 0) {
            const hashedPassword = results[0].Password;

            bcrypt.compare(password, hashedPassword, (error, passwordMatch) => {
                if (passwordMatch) {
                    req.session.isLoggedIn = true;
                    req.session.username = username;
                    res.redirect("/home");
                } else {
                    res.render("login", { errorMessage: "Invalid username or password." });
                }
            });
        } else {
            res.render("login", { errorMessage: "User not found!" });
        }
    });
}

const logout = (req, res) => {
    req.session.destroy();
    res.redirect("/");
}

module.exports = { emailExists, signup, login, logout };