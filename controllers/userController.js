const connection = require("../database");

function getUserId(username, callback) {
    connection.query("SELECT UserID FROM users WHERE Username = ?", [username], (error, results) => {
        if (error) return callback(error, null);

        if (results.length > 0) {
            const userID = results[0].UserID;
            callback(null, userID);
        } else {
            callback(new Error("User not found"), null);
        }
    });
}

module.exports = { getUserId };