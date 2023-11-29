const express = require("express");
const app = express();
const router = express.Router();
const bcrypt = require("bcryptjs");
const connection = require("../database");

router.get("/", (req, res) => {
    res.render("resetpassword");
});

router.post("/", async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let verificationCode = req.body.verificationCode;

    connection.query("SELECT ResetCode, ResetCodeExpiry FROM Users WHERE Username = ?", [username], async (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send("An error occured whilst executing SQL query.");
        } else {
            if (results.length > 0) {
                const resetCode = results[0].ResetCode;
                const resetCodeExpiry = results[0].ResetCodeExpiry;

                if (resetCodeExpiry < Date.now()) {
                    res.render("Password reset request expired.");
                } else {
                    if (verificationCode == resetCode) {

                        // Password reset was successful
                        const salt = await bcrypt.genSalt(10);
                        const secretPass = await bcrypt.hash(password, salt);
                        
                        connection.query("UPDATE Users SET Password = ? WHERE Username = ?", [secretPass, username]);
                        res.redirect("/");
                    }
                }
            }
        }
    });
});

module.exports = router;