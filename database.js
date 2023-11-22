const mysql = require("mysql");

const connection = mysql.createConnection({
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
