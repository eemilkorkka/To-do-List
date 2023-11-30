const express = require("express");
const app = express();
const router = express.Router();
const bcrypt = require("bcryptjs");
const connection = require("../database");

router.get("/", (req, res) => {
    res.render("resetpassword", { errorMessage: null });
});

router.post("/", (req, res) => {
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
                    res.render("resetpassword", { errorMessage: "Password reset code expired" });
                } else {
                    if (verificationCode == resetCode) {
                        const salt = await bcrypt.genSalt(10);
                        const secretPass = await bcrypt.hash(password, salt);
                        
                        connection.query("UPDATE Users SET Password = ? WHERE Username = ?", [secretPass, username]);

                        // Password reset was successful
                        res.redirect("/");
                    } else {
                        res.render("resetpassword", { errorMessage: "Invalid verification code "});
                    }
                }
            }
        }
    });
});

module.exports = router;