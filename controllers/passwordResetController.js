const nodemailer = require("nodemailer");
const connection = require("../database");
const bcrypt = require("bcryptjs");
const env = require("dotenv").config();
const authenticationContoller = require("./authenticationController");

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendPasswordResetEmail(email, callback) {
    const expirationDate = Date.now() + 3600000;
    const resetCode = Math.floor((Math.random() * 999999) + 100000);

    authenticationContoller.emailExists(email, async (exists) => {
        if (exists) {
            const message = {
                from: "eemil.korkka@koudata.fi",
                to: email,
                subject: "Reset Password Code",
                text: "You can reset your password for the Todo List App using the following reset code: " + resetCode,
            };

            // Insert a password reset code and an expiration date value into the database
            await connection.query("UPDATE Users SET ResetCodeExpiry = ?, ResetCode = ? WHERE Email = ?", [expirationDate, resetCode, email]);

            transporter.sendMail(message, (error, res) => {
                if (error) {
                    callback(error, null);
                } else {
                    callback(null, res);
                }
            });
        } else {
            callback("No account registered with the email provided", null);
        }
    });
}

function resetPassword(username, password, verificationCode, callback) {
    connection.query("SELECT ResetCode, ResetCodeExpiry FROM Users WHERE Username = ?", [username], async (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send("An error occured whilst executing SQL query.");
        } else {
            if (results.length > 0) {
                const resetCode = results[0].ResetCode;
                const resetCodeExpiry = results[0].ResetCodeExpiry;

                if (resetCodeExpiry < Date.now()) {
                    callback("Password reset code expired", null);
                } else {
                    if (verificationCode == resetCode) {
                        const salt = await bcrypt.genSalt(10);
                        const secretPass = await bcrypt.hash(password, salt);
                        
                        connection.query("UPDATE Users SET Password = ? WHERE Username = ?", [secretPass, username], (error, results) => {
                            if (error) {
                                callback(error, null);
                            } else {
                                 // Password reset was successful
                                callback(null, results);
                            }
                        });
                    } else {
                        callback("Invalid verification code", null);
                    }
                }
            }
        }
    });
}

module.exports = { sendPasswordResetEmail, resetPassword };
