const mysql = require("mysql");
const env = require("dotenv").config();

const connection = mysql.createConnection({

    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((error) => {
    if (error) {
        console.error("Error connecting to database: ", error);
        return;
    }
    console.log("Connected to MySQL database");
});

module.exports = connection;
