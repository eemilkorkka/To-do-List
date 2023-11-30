const connection = require("../database");
const bcrypt = require("bcryptjs");

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

async function signup(name, email, username, password, callback) {
    try {
        const salt = await bcrypt.genSalt(10);
        const secretPass = await bcrypt.hash(password, salt);

        connection.query("INSERT INTO Users (Name, Email, Username, Password) VALUES (?, ?, ?, ?)", [name, email, username, secretPass], (error, results) => {
            if (error) {
                callback(error, null);
            } else {
                callback(null, results);
            }
        });
    } catch (error) {
        callback(error, null);
    }
}

async function login(username, password, callback) {
    connection.query("SELECT Password FROM Users WHERE Username = ?", [username], (error, results) => {
        if (error) {
            callback(error, null);
        } else {
            if (results.length > 0) {
                const hashedPassword = results[0].Password;
    
                bcrypt.compare(password, hashedPassword, (error, passwordMatch) => {
                    if (passwordMatch) {
                        callback(null, true);
                    } else {
                        callback("Invalid username or password", null);
                    }
                });
            } else {
                callback("User not found", null);
            }
        }
    });
}

module.exports = { emailExists, signup, login };