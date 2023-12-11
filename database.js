const mysql = require("mysql");

// See create_db.txt for the necessary MySQL queries for creating the database

const connection = mysql.createConnection({

    // Change these accordingly if needed to match your credentials
    host: "localhost",
    user: "root",
    password: "password",
    database: "tododb"
});

connection.connect((error) => {
    if (error) {
        console.error("Error connecting to database: ", error);
        return;
    }
    console.log("Connected to MySQL database");
});

module.exports = connection;
