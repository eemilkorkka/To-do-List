const connection = require("../database");

function getTodos(userID, callback) {
    connection.query("SELECT * FROM Todos WHERE UserID = ?", [userID], (error, results) => {
        if (error) {
            return callback(error, null);
        } else {
            callback(null, results);
        }
    });
}

function createTodo(todoTitle, todoDescription, userID, callback) {
    connection.query("INSERT INTO Todos (TodoTitle, TodoDescription, UserID) VALUES (?, ?, ?)", [todoTitle, todoDescription, userID], (error, results) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
}

module.exports = { getTodos, createTodo };